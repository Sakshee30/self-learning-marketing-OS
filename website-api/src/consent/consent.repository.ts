import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { DatabasePoolService } from "../database/database-pool.service";
import type { ConsentBody, ConsentReceipt } from "./consent.contract";
import { ConsentPersistenceError } from "./consent.errors";

interface ConsentRow {
  id: string;
  subject_id: string;
  policy_version: string;
  recorded_at: Date;
}

@Injectable()
export class ConsentRepository {
  constructor(private readonly database: DatabasePoolService) {}

  async record(body: ConsentBody): Promise<ConsentReceipt> {
    try {
      return await this.database.transaction(async (client) => {
        const consentRecordId = randomUUID();
        const subjectId = body.subjectId ?? randomUUID();
        const recordedAt = new Date();
        const inserted = await client.query<ConsentRow>(
          `INSERT INTO website_consent_records (
             id, subject_id, policy_version, decisions, source, recorded_at
           ) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6)
           RETURNING id, subject_id, policy_version, recorded_at`,
          [
            consentRecordId,
            subjectId,
            body.policyVersion,
            JSON.stringify(body.decisions),
            JSON.stringify(body.source),
            recoredAt,
          ],
        );

        const created = inserted.rows[0];
        if (!created) throw new Error("Consent insert did not return a row");

        await client.query(
          `INSERT INTO website_outbox_events (
             id, event_type, aggregate_type, aggregate_id, payload, occurred_at, available_at
           ) VALUES ($1, $2, $3, $4, $5::jsonb, $6, $6)`,
          [
            randomUUID(),
            "website.consent.recorded.v1",
            "website_consent_record",
            created.id,
            JSON.stringify({
              consentRecordId: created.id,
              subjectId: created.subject_id,
              policyVersion: created.policy_version,
              recordedAt: created.recorded_at.toISOString(),
            }),
            created.recorded_at,
          ],
        );

        return {
          consentRecordId: created.id,
          subjectId: created.subject_id,
          policyVersion: created.policy_version,
          recordedAt: created.recorded_at.toISOString(),
        };
      });
    } catch (error) {
      throw new ConsentPersistenceError(error);
    }
  }
}
