import { Injectable } from "@nestjs/common";
import { DatabasePoolService } from "../database/database-pool.service";
import { publishedFormSchema, type PublishedFormSchema } from "./form-schema";
import { PublishedFormReadError } from "./published-form.errors";

export interface PublishedFormRuntimeView {
  formId: string;
  formVersionId: string;
  version: number;
  sourceRevision: string | null;
  publishedAt: string;
  schema: PublishedFormSchema;
}

interface PublishedFormRow {
  id: string;
  version: number;
  source_revision: string | null;
  published_at: Date;
  schema: unknown;
}

@Injectable()
export class PublishedFormRepository {
  constructor(private readonly database: DatabasePoolService) {}

  async findPublished(formId: string): Promise<PublishedFormRuntimeView | null> {
    try {
      return await this.database.transaction(async (client) => {
        const result = await client.query<PublishedFormRow>(
          `SELECT id, version, source_revision, published_at, schema
             FROM website_form_versions
            WHERE form_id = $1 AND status = 'published'
            ORDER BY version DESC
            LIMIT 1
            FOR SHARE`,
          [formId],
        );

        const row = result.rows[0];
        if (!row) return null;

        const schema = publishedFormSchema.parse(row.schema);

        return {
          formId,
          formVersionId: row.id,
          version: row.version,
          sourceRevision: row.source_revision,
          publishedAt: row.published_at.toISOString(),
          schema,
        };
      });
    } catch (error) {
      throw new PublishedFormReadError(error);
    }
  }
}
