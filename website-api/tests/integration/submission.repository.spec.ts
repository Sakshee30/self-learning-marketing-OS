import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ApiConfig } from "../../src/config/api-config";
import { DatabasePoolService } from "../../src/database/database-pool.service";
import { createRequestFingerprint, submissionBodySchema } from "../../src/submissions/submission.contract";
import { IdempotencyConflictError } from "../../src/submissions/submission.errors";
import { SubmissionRepository } from "../../src/submissions/submission.repository";

const databaseUrl = process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase("SubmissionRepository with PostgreSQL", () => {
  const formId = `request-access-${randomUUID().slice(0, 8)}`;
  const formVersionId = randomUUID();
  let database: DatabasePoolService;
  let repository: SubmissionRepository;
  let adminPool: Pool;

  beforeAll(async () => {
    const config: ApiConfig = {
      databaseUrl: databaseUrl!,
      databasePoolMax: 4,
      host: "127.0.0.1",
      port: 3002,
      websiteOrigins: [],
    };
    database = new DatabasePoolService(config);
    repository = new SubmissionRepository(database);
    adminPool = new Pool({ connectionString: databaseUrl });
    await adminPool.query(
      `INSERT INTO website_form_versions (id, form_id, version, schema, status, published_at)
       VALUES ($1, $2, 1, '{}'::jsonb, 'published', now())`,
      [formVersionId, formId],
    );
  });

  afterAll(async () => {
    await adminPool.query("DELETE FROM website_outbox_events WHERE aggregate_id IN (SELECT id FROM website_submissions WHERE form_id = $1)", [formId]);
    await adminPool.query("DELETE FROM website_submissions WHERE form_id = $1", [formId]);
    await adminPool.query("DELETE FROM website_form_versions WHERE form_id = $1", [formId]);
    await adminPool.end();
    await database.onModuleDestroy();
  });

  it("stores one submission and one outbox event before returning acceptance", async () => {
    const body = submissionBodySchema.parse({ fields: { email: "ada@example.test" }, source: { path: "/contact" } });
    const requestFingerprint = createRequestFingerprint(body);
    const first = await repository.accept({
      formId,
      body,
      requestFingerprint,
      idempotencyKey: "integration-request-1",
    });

    expect(first.replayed).toBe(false);
    expect(first.formVersionId).toBe(formVersionId);

    const stored = await adminPool.query("SELECT count(*)::int AS count FROM website_submissions WHERE id = $1", [first.submissionId]);
    const outbox = await adminPool.query("SELECT count(*)::int AS count FROM website_outbox_events WHERE aggregate_id = $1", [first.submissionId]);
    expect(stored.rows[0].count).toBe(1);
    expect(outbox.rows[0].count).toBe(1);

    const replay = await repository.accept({
      formId,
      body,
      requestFingerprint,
      idempotencyKey: "integration-request-1",
    });
    expect(replay.submissionId).toBe(first.submissionId);
    expect(replay.replayed).toBe(true);

    const outboxAfterReplay = await adminPool.query("SELECT count(*)::int AS count FROM website_outbox_events WHERE aggregate_id = $1", [first.submissionId]);
    expect(outboxAfterReplay.rows[0].count).toBe(1);
  });

  it("rejects reuse of an idempotency key for different content", async () => {
    const original = submissionBodySchema.parse({ fields: { email: "first@example.test" }, source: {} });
    await repository.accept({
      formId,
      body: original,
      requestFingerprint: createRequestFingerprint(original),
      idempotencyKey: "integration-request-2",
    });

    const changed = submissionBodySchema.parse({ fields: { email: "second@example.test" }, source: {} });
    await expect(
      repository.accept({
        formId,
        body: changed,
        requestFingerprint: createRequestFingerprint(changed),
        idempotencyKey: "integration-request-2",
      }),
    ).rejects.toBeInstanceOf(IdempotencyConflictError);
  });
});
