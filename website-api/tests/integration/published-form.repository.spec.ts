import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ApiConfig } from "../../src/config/api-config";
import { DatabasePoolService } from "../../src/database/database-pool.service";
import { PublishedFormRepository } from "../../src/forms/published-form.repository";

const databaseUrl = process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase("PublishedFormRepository with PostgreSQL", () => {
  let database: DatabasePoolService;
  let repository: PublishedFormRepository;
  let adminPool: Pool;
  const formId = `public-form-${randomUUID().slice(0, 8)}`;

  beforeAll(() => {
    const config: ApiConfig = {
      databaseUrl: databaseUrl!,
      databasePoolMax: 4,
      host: "127.0.0.1",
      port: 3002,
      websiteOrigins: [],
    };
    database = new DatabasePoolService(config);
    repository = new PublishedFormRepository(database);
    adminPool = new Pool({ connectionString: databaseUrl });
  });

  afterAll(async () => {
    await adminPool.query("DELETE FROM website_form_versions WHERE form_id = $1", [formId]);
    await adminPool.end();
    await database.onModuleDestroy();
  });

  it("returns only the active published schema and safe runtime metadata", async () => {
    const archivedId = randomUUID();
    const publishedId = randomUUID();

    await adminPool.query(
      `INSERT INTO website_form_versions (
         id, form_id, version, schema, status, published_at, source_revision
       ) VALUES
       ($1, $3, 1, $4::jsonb, 'archived', now() - interval '1 minute', $5),
       ($2, $3, 2, $6::jsonb, 'published', now(), $7)`,
      [
        archivedId,
        publishedId,
        formId,
        JSON.stringify({ fields: [{ name: "old", label: "Old", type: "text", required: false }] }),
        "1".repeat(64),
        JSON.stringify({ fields: [{ name: "email", label: "Work email", type: "email", required: true }] }),
        "2".repeat(64),
      ],
    );

    const published = await repository.findPublished(formId);

    expect(published).toMatchObject({
      formId,
      formVersionId: publishedId,
      version: 2,
      sourceRevision: "2".repeat(64),
      schema: {
        fields: [{ name: "email", label: "Work email", type: "email", required: true }],
      },
    });
  });

  it("returns null when no published version exists", async () => {
    expect(await repository.findPublished(`missing-${randomUUID().slice(0, 8)}`)).toBeNull();
  });
});
