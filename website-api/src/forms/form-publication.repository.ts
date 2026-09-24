import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { DatabasePoolService } from "../database/database-pool.service";
import type { PublishFormVersionBody, PublishedFormVersionReceipt } from "./form-publication.contract";
import { FormPublicationPersistenceError } from "./form-publication.errors";

interface FormVersionRow {
  id: string;
  version: number;
  source_revision: string;
  published_at: Date;
}

@Injectable()
export class FormPublicationRepository {
  constructor(private readonly database: DatabasePoolService) {}

  async publish(formId: string, body: PublishFormVersionBody): Promise<PublishedFormVersionReceipt> {
    try {
      return await this.database.transaction(async (client) => {
        // Serialize publication per form even when no version row exists yet.
        await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [formId]);

        const existing = await client.query<FormVersionRow>(
          `SELECT id, version, source_revision, published_at
             FROM website_form_versions
            WHERE form_id = $1 AND source_revision = $2
            LIMIT 1`,
          [formId, body.sourceRevision],
        );
        if (existing.rows[0]) {
          return this.toReceipt(formId, existing.rows[0], true);
        }

        const nextVersion = await client.query<{ next_version: number }>(
          `SELECT COALESCE(MAX(version), 0)::int + 1 AS next_version
             FROM website_form_versions
            WHERE form_id = $1`,
          [formId],
        );

        await client.query(
          `UPDATE website_form_versions
              SET status = 'archived'
            WHERE form_id = $1 AND status = 'published'`,
          [formId],
        );

        const id = randomUUID();
        const inserted = await client.query<FormVersionRow>(
          `INSERT INTO website_form_versions (
             id, form_id, version, schema, status, published_at, source_revision
           ) VALUES ($1, $2, $3, $4::jsonb, 'published', now(), $5)
           RETURNING id, version, source_revision, published_at`,
          [id, formId, nextVersion.rows[0]?.next_version ?? 1, JSON.stringify(body.schema), body.sourceRevision],
        );

        const created = inserted.rows[0];
        if (!created) throw new Error("Published form version insert returned no row");
        return this.toReceipt(formId, created, false);
      });
    } catch (error) {
      throw new FormPublicationPersistenceError(error);
    }
  }

  private toReceipt(formId: string, row: FormVersionRow, replayed: boolean): PublishedFormVersionReceipt {
    return {
      formId,
      formVersionId: row.id,
      version: row.version,
      sourceRevision: row.source_revision,
      publishedAt: row.published_at.toISOString(),
      replayed,
    };
  }
}
