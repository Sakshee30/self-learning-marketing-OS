import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import type { PoolClient } from "pg";
import { normalizeAttribution } from "../attribution/attribution.contract";
import { DatabasePoolService } from "../database/database-pool.service";
import { validateSubmissionFields } from "../forms/form-schema";
import type { SubmissionBody, SubmissionReceipt } from "./submission.contract";
import {
  ConsentRecordNotFoundError,
  IdempotencyConflictError,
  PublishedFormNotFoundError,
  SubmissionFormValidationError,
  SubmissionPersistenceError,
} from "./submission.errors";

interface AcceptSubmissionInput {
  formId: string;
  body: SubmissionBody;
  requestFingerprint: string;
  idempotencyKey?: string;
}

interface ExistingSubmissionRow {
  id: string;
  form_version_id: string;
  request_fingerprint: string;
  received_at: Date;
}

interface PublishedFormRow {
  id: string;
  schema: unknown;
}

@Injectable()
export class SubmissionRepository {
  constructor(private readonly database: DatabasePoolService) {}

  async accept(input: AcceptSubmissionInput): Promise<SubmissionReceipt> {
    try {
      return await this.database.transaction((client) => this.acceptInTransaction(client, input));
    } catch (error) {
      if (
        error instanceof PublishedFormNotFoundError ||
        error instanceof IdempotencyConflictError ||
        error instanceof ConsentRecordNotFoundError ||
        error instanceof SubmissionFormValidationError
      ) {
        throw error;
      }
      throw new SubmissionPersistenceError(error);
    }
  }

  private async acceptInTransaction(
    client: PoolClient,
    input: AcceptSubmissionInput,
  ): Promise<SubmissionReceipt> {
    if (input.idempotencyKey) {
      const existing = await this.findExisting(client, input.formId, input.idempotencyKey);
      if (existing) return this.replay(existing, input);
    }

    if (input.body.consentRecordId) {
      const consent = await client.query<{ id: string }>(
        "SELECT id FROM website_consent_records WHERE id = $1 LIMIT 1",
        [input.body.consentRecordId],
      );
      if (!consent.rows[0]) throw new ConsentRecordNotFoundError(input.body.consentRecordId);
    }

    const publishedForm = await client.query<PublishedFormRow>(
      `SELECT id, schema
         FROM website_form_versions
        WHERE form_id = $1 AND status = 'published'
        ORDER BY version DESC
        LIMIT 1
        FOR SHARE`,
      [input.formId],
    );

    const formVersion = publishedForm.rows[0];
    if (!formVersion) throw new PublishedFormNotFoundError(input.formId);

    const formIssues = validateSubmissionFields(formVersion.schema, input.body.fields);
    if (formIssues.length > 0) {
      throw new SubmissionFormValidationError(formIssues);
    }

    const submissionId = randomUUID();
    const receivedAt = new Date();
    const attribution = normalizeAttribution(input.body.attribution);
    const inserted = await client.query<ExistingSubmissionRow>(
      `INSERT INTO website_submissions (
         id, form_id, form_version_id, idempotency_key, request_fingerprint,
         fields, source, consent_record_id, attribution, received_at
       ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9::jsonb, $10)
       ON CONFLICT (form_id, idempotency_key) WHERE idempotency_key IS NOT NULL
       DO NOTHING
       RETURNING id, form_version_id, request_fingerprint, received_at`,
      [
        submissionId,
        input.formId,
        formVersion.id,
        input.idempotencyKey ?? null,
        input.requestFingerprint,
        JSON.stringify(input.body.fields),
        JSON.stringify(input.body.source),
        input.body.consentRecordId ?? null,
        JSON.stringify(attribution),
        receivedAt,
      ],
    );

    const created = inserted.rows[0];
    if (!created) {
      if (!input.idempotencyKey) {
        throw new Error("Submission insert did not return a row");
      }
      const existing = await this.findExisting(client, input.formId, input.idempotencyKey);
      if (!existing) throw new Error("Idempotency conflict occurred without an existing submission");
      return this.replay(existing, input);
    }

    await client.query(
      `INSERT INTO website_outbox_events (
         id, event_type, aggregate_type, aggregate_id, payload, occurred_at, available_at
       ) VALUES ($1, $2, $3, $4, $5::jsonb, $6, $6)`,
      [
        randomUUID(),
        "website.submission.accepted.v1",
        "website_submission",
        created.id,
        JSON.stringify({
          submissionId: created.id,
          formId: input.formId,
          formVersionId: created.form_version_id,
          acceptedAt: created.received_at.toISOString(),
          consentRecordId: input.body.consentRecordId ?? null,
          attributionStatus: attribution.status,
        }),
        created.received_at,
      ],
    );

    return this.toReceipt(created, input.formId, false);
  }

  private async findExisting(client: PoolClient, formId: string, idempotencyKey: string) {
    const result = await client.query<ExistingSubmissionRow>(
      `SELECT id, form_version_id, request_fingerprint, received_at
         FROM website_submissions
        WHERE form_id = $1 AND idempotency_key = $2
        LIMIT 1`,
      [formId, idempotencyKey],
    );
    return result.rows[0];
  }

  private replay(existing: ExistingSubmissionRow, input: AcceptSubmissionInput): SubmissionReceipt {
    if (existing.request_fingerprint !== input.requestFingerprint) {
      throw new IdempotencyConflictError();
    }
    return this.toReceipt(existing, input.formId, true);
  }

  private toReceipt(row: ExistingSubmissionRow, formId: string, replayed: boolean): SubmissionReceipt {
    return {
      submissionId: row.id,
      formId,
      formVersionId: row.form_version_id,
      acceptedAt: row.received_at.toISOString(),
      replayed,
    };
  }
}
