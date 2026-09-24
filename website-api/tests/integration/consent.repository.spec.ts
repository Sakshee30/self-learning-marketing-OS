import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ApiConfig } from "../../src/config/api-config";
import { ConsentRepository } from "../../src/consent/consent.repository";
import { DatabasePoolService } from "../../src/database/database-pool.service";

const databaseUrl = process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase("ConsentRepository with PostgreSQL", () => {
  let database: DatabasePoolService;
  let repository: ConsentRepository;
  let adminPool: Pool;
  const subjectIds: string[] = [];

  beforeAll(() => {
    const config: ApiConfig = {
      databaseUrl: databaseUrl!,
      databasePoolMax: 4,
      host: "127.0.0.1",
      port: 3002,
      websiteOrigins: [],
    };
    database = new DatabasePoolService(config);
    repository = new ConsentRepository(database);
    adminPool = new Pool({ connectionString: databaseUrl });
  });

  afterAll(async () => {
    if (subjectIds.length > 0) {
      await adminPool.query(
        "DELETE FROM website_outbox_events WHERE aggregate_id IN (SELECT id FROM website_consent_records WHERE subject_id = ANY($1::uuid[]))",
        [subjectIds],
      );
      await adminPool.query("DELETE FROM website_consent_records WHERE subject_id = ANY($1::uuid[])", [subjectIds]);
    }
    await adminPool.end();
    await database.onModuleDestroy();
  });

  it("stores append-only grant and withdrawal records with one outbox event each", async () => {
    const grant = await repository.record({
      policyVersion: "privacy-2026-09",
      decisions: { analytics: "granted", advertising: "denied" },
      source: { path: "/" },
    });
    subjectIds.push(grant.subjectId);

    const withdrawal = await repository.record({
      subjectId: grant.subjectId,
      policyVersion: "privacy-2026-09",
      decisions: { analytics: "denied", advertising: "denied" },
      source: { path: "/preferences" },
    });

    expect(withdrawal.subjectId).toBe(grant.subjectId);
    expect(withdrawal.consentRecordId).not.toBe(grant.consentRecordId);

    const records = await adminPool.query(
      `SELECT id, decisions
         FROM website_consent_records
        WHERE subject_id = $1`,
      [grant.subjectId],
    );
    expect(records.rowCount).toBe(2);
    const decisionsById = new Map(records.rows.map((row) => [row.id, row.decisions]));
    expect(decisionsById.get(grant.consentRecordId)?.analytics).toBe("granted");
    expect(decisionsById.get(withdrawal.consentRecordId)?.analytics).toBe("denied");

    const outbox = await adminPool.query(
      `SELECT count(*)::int AS count
         FROM website_outbox_events
        WHERE aggregate_id IN (
          SELECT id FROM website_consent_records WHERE subject_id = $1
        ) AND event_type = 'website.consent.recorded.v1'`,
      [grant.subjectId],
    );
    expect(outbox.rows[0].count).toBe(2);
  });
});
