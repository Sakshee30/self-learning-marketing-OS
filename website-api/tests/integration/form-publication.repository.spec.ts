import { randomUUID, createHash } from "node:crypto";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ApiConfig } from "../../src/config/api-config";
import { DatabasePoolService } from "../../src/database/database-pool.service";
import { FormPublicationRepository } from "../../src/forms/form-publication.repository";

const databaseUrl = process.env.DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase("FormPublicationRepository with PostgreSQL", () => {
  let database: DatabasePoolService;
  let repository: FormPublicationRepository;
  let adminPool: Pool;
  const formId = `cms-form-${randomUUID().slice(0, 8)}`;

  beforeAll(() => {
    const config: ApiConfig = {
      databaseUrl: databaseUrl!,
      databasePoolMax: 4,
      host: "127.0.0.1",
      port: 3002,
      websiteOrigins: [],
    };
    database = new DatabasePoolService(config);
    repository = new FormPublicationRepository(database);
    adminPool = new Pool({ connectionString: databaseUrl });
  });

  afterAll(async () => {
    await adminPool.query("DELETE FROM website_form_versions WHERE form_id = $1", [formId]);
    await adminPool.end();
    await database.onModuleDestroy();
  });

  it("publishes immutable versions, archives the previous version, and replays the same source revision", async () => {
    const firstRevision = createHash("sha256").update("first").digest("hex");
    const first = await repository.publish(formId, {
      sourceRevision: firstRevision,
      schema: { fields: [{ name: "email", label: "Email", type: "email", required: true }] },
    });
    expect(first.version).toBe(1);
    expect(first.replayed).toBe(false);

    const replay = await repository.publish(formId, {
      sourceRevision: firstRevision,
      schema: { fields: [{ name: "email", label: "Email", type: "email", required: true }] },
    });
    expect(replay.formVersionId).toBe(first.formVersionId);
    expect(replay.replayed).toBe(true);

    const second = await repository.publish(formId, {
      sourceRevision: createHash("sha256").update("second").digest("hex"),
      schema: {
        fields: [
          { name: "email", label: "Email", type: "email", required: true },
          { name: "message", label: "Message", type: "textarea", required: true },
        ],
      },
    });
    expect(second.version).toBe(2);

    const rows = await adminPool.query(
      `SELECT id, version, status
         FROM website_form_versions
        WHERE form_id = $1
        ORDER BY version`,
      [formId],
    );
    expect(rows.rows).toEqual([
      { id: first.formVersionId, version: 1, status: "archived" },
      { id: second.formVersionId, version: 2, status: "published" },
    ]);
  });
});
