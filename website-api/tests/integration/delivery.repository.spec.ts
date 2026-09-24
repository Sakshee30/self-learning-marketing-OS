import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ApiConfig } from "../../src/config/api-config";
import { DatabasePoolService } from "../../src/database/database-pool.service";
import { DeliveryRepository, SUBMISSION_ACCEPTED_EVENT } from "../../src/delivery/delivery.repository";

const databaseUrl = process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase("DeliveryRepository with PostgreSQL", () => {
  let database: DatabasePoolService;
  let repository: DeliveryRepository;
  let adminPool: Pool;
  const eventIds: string[] = [];

  beforeAll(() => {
    const config: ApiConfig = {
      databaseUrl: databaseUrl!,
      databasePoolMax: 4,
      host: "127.0.0.1",
      port: 3002,
      websiteOrigins: [],
    };
    database = new DatabasePoolService(config);
    repository = new DeliveryRepository(database);
    adminPool = new Pool({ connectionString: databaseUrl });
  });

  afterAll(async () => {
    if (eventIds.length > 0) {
      await adminPool.query("DELETE FROM website_outbox_events WHERE id = ANY($1::uuid[])", [eventIds]);
    }
    await adminPool.end();
    await database.onModuleDestroy();
  });

  it("leases, retries, records history, and completes one submission event", async () => {
    const eventId = randomUUID();
    eventIds.push(eventId);
    await adminPool.query(
      `INSERT INTO website_outbox_events (
         id, event_type, aggregate_type, aggregate_id, payload, occurred_at, available_at
       ) VALUES ($1, $2, 'website_submission', $3, $4::jsonb, now(), now())`,
      [eventId, SUBMISSION_ACCEPTED_EVENT, randomUUID(), JSON.stringify({ submissionId: randomUUID() })],
    );

    const first = await repository.claimNext(60_000);
    expect(first?.id).toBe(eventId);
    expect(first?.attemptNumber).toBe(1);

    const whileLeased = await repository.claimNext(60_000);
    expect(whileLeased).toBeNull();

    await repository.fail({
      event: first!,
      destinationKey: "configured-webhook",
      startedAt: new Date(),
      errorCode: "destination_http_error",
      errorMessage: "Destination returned HTTP 503",
      responseStatus: 503,
      deadLetter: false,
      nextAvailableAt: new Date(Date.now() - 1_000),
    });

    const second = await repository.claimNext(60_000);
    expect(second?.id).toBe(eventId);
    expect(second?.attemptNumber).toBe(2);

    await repository.complete({
      event: second!,
      destinationKey: "configured-webhook",
      startedAt: new Date(),
      responseStatus: 202,
    });

    const state = await adminPool.query(
      `SELECT processed_at, dead_lettered_at, attempt_count, lock_token, locked_until
         FROM website_outbox_events
        WHERE id = $1`,
      [eventId],
    );
    expect(state.rows[0].processed_at).toBeTruthy();
    expect(state.rows[0].dead_lettered_at).toBeNull();
    expect(state.rows[0].attempt_count).toBe(2);
    expect(state.rows[0].lock_token).toBeNull();
    expect(state.rows[0].locked_until).toBeNull();

    const attempts = await adminPool.query(
      `SELECT outcome, response_status, attempt_number
         FROM website_delivery_attempts
        WHERE outbox_event_id = $1
        ORDER BY attempt_number`,
      [eventId],
    );
    expect(attempts.rows).toEqual([
      { outcome: "failed", response_status: 503, attempt_number: 1 },
      { outcome: "succeeded", response_status: 202, attempt_number: 2 },
    ]);
  });
});
