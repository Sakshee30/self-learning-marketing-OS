import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ApiConfig } from "../../src/config/api-config";
import { DatabasePoolService } from "../../src/database/database-pool.service";
import { createRequestFingerprint, submissionBodySchema } from "../../src/submissions/submission.contract";
import { ConsentRecordNotFoundError, IdempotencyConflictError } from "../../src/submissions/submission.errors";
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

    const stored = await adminPool.query("SELECT attribution, count(*) OVER()::int AS count FROM website_submissions WHERE id = $1", [first.submissionId]);
    const outbox = await adminPool.query("SELECT count(*)::int AS count FROM website_outbox_events WHERE aggregate_id = $1", [first.submissionId]);
    expect(stored.rows[0].count).toBe(1);
    expect(stored.rows[0].attribution).toEqual({ status: "unknown" });
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

  it("binds a submission to the exact rendered form version even after a newer version is published", async () => {
    const renderedVersionId = randomUUID();
    const newerVersionId = randomUUID();

    await adminPool.query(
      `UPDATE website_form_versions SET status = 'archived' WHERE id = $1`,
      [formVersionId],
    );
    await adminPool.query(
      `INSERT INTO website_form_versions (id, form_id, version, schema, status, published_at)
       VALUES
       ($1, $3, 2, $4::jsonb, 'archived', now() - interval '1 second'),
       ($2, $3, 3, $5::jsonb, 'published', now())`,
      [
        renderedVersionId,
        newerVersionId,
        formId,
        JSON.stringify({
          fields: [{ name: "email", label: "Email", type: "email", required: true }],
        }),
        JSON.stringify({
          fields: [
            { name: "email", label: "Email", type: "email", required: true },
            { name: "company", label: "Company", type: "text", required: true },
          ],
        }),
      ],
    );

    const body = submissionBodySchema.parse({
      formVersionId: renderedVersionId,
      fields: { email: "rendered@example.test" },
      source: { path: "/contact" },
    });
    const receipt = await repository.accept({
      formId,
      body,
      requestFingerprint: createRequestFingerprint(body),
      idempotencyKey: "integration-version-bind",
    });

    expect(receipt.formVersionId).toBe(renderedVersionId);
  });

  it("rejects a submission that references an unknown consent record", async () => {
    const body = submissionBodySchema.parse({
      fields: { email: "ada@example.test" },
      source: {},
      consentRecordId: randomUUID(),
    });

    await expect(
      repository.accept({
        formId,
        body,
        requestFingerprint: createRequestFingerprint(body),
        idempotencyKey: "integration-request-3",
      }),
    ).rejects.toBeInstanceOf(ConsentRecordNotFoundError);
  });
});
