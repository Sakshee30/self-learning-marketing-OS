import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { DatabasePoolService } from "../database/database-pool.service";

export const SUBMISSION_ACCEPTED_EVENT = "website.submission.accepted.v1";

export interface ClaimedDeliveryEvent {
  id: string;
  eventType: string;
  payload: unknown;
  attemptNumber: number;
  lockToken: string;
}

interface ClaimRow {
  id: string;
  event_type: string;
  payload: unknown;
  attempt_count: number;
  lock_token: string;
}

interface CompleteDeliveryInput {
  event: ClaimedDeliveryEvent;
  destinationKey: string;
  startedAt: Date;
  responseStatus?: number;
}

interface FailDeliveryInput extends CompleteDeliveryInput {
  errorCode: string;
  errorMessage: string;
  nextAvailableAt?: Date;
  deadLetter: boolean;
}

export class DeliveryClaimLostError extends Error {
  constructor() {
    super("Delivery claim is no longer owned by this worker");
    this.name = "DeliveryClaimLostError";
  }
}

export class DeliveryRepository {
  constructor(private readonly database: DatabasePoolService) {}

  claimNext(leaseMs: number): Promise<ClaimedDeliveryEvent | null> {
    return this.database.transaction(async (client) => {
      const selected = await client.query<{ id: string }>(
        `SELECT id
           FROM website_outbox_events
          WHERE event_type = $1
            AND processed_at IS NULL
            AND dead_lettered_at IS NULL
            AND available_at <= now()
            AND (locked_until IS NULL OR locked_until <= now())
          ORDER BY available_at ASC, occurred_at ASC
          FOR UPDATE SKIP LOCKED
          LIMIT 1`,
        [SUBMISSION_ACCEPTED_EVENT],
      );

      const eventId = selected.rows[0]?.id;
      if (!eventId) return null;

      const lockToken = randomUUID();
      const claimed = await client.query<ClaimRow>(
        `UPDATE website_outbox_events
            SET attempt_count = attempt_count + 1,
                lock_token = $2,
                locked_until = now() + ($3::integer * interval '1 millisecond')
          WHERE id = $1
          RETURNING id, event_type, payload, attempt_count, lock_token`,
        [eventId, lockToken, leaseMs],
      );

      const row = claimed.rows[0];
      if (!row) throw new Error("Claimed outbox event disappeared before update");

      return {
        id: row.id,
        eventType: row.event_type,
        payload: row.payload,
        attemptNumber: row.attempt_count,
        lockToken: row.lock_token,
      };
    });
  }

  complete(input: CompleteDeliveryInput): Promise<void> {
    return this.database.transaction(async (client) => {
      await this.finishEvent(client, input.event, {
        processed: true,
        lastError: null,
      });
      await this.insertAttempt(client, input, {
        outcome: "succeeded",
      });
    });
  }

  fail(input: FailDeliveryInput): Promise<void> {
    return this.database.transaction(async (client) => {
      await this.finishEvent(client, input.event, {
        processed: false,
        deadLetter: input.deadLetter,
        nextAvailableAt: input.nextAvailableAt,
        lastError: input.errorMessage,
      });
      await this.insertAttempt(client, input, {
        outcome: "failed",
        errorCode: input.errorCode,
        errorMessage: input.errorMessage,
      });
    });
  }

  private async finishEvent(
    client: PoolClient,
    event: ClaimedDeliveryEvent,
    state: {
      processed: boolean;
      deadLetter?: boolean;
      nextAvailableAt?: Date;
      lastError: string | null;
    },
  ) {
    const updated = await client.query(
      `UPDATE website_outbox_events
          SET processed_at = CASE WHEN $3::boolean THEN now() ELSE processed_at END,
              dead_lettered_at = CASE WHEN $4::boolean THEN now() ELSE dead_lettered_at END,
              available_at = COALESCE($5::timestamptz, available_at),
              last_error = $6,
              lock_token = NULL,
              locked_until = NULL
        WHERE id = $1
          AND lock_token = $2`,
      [
        event.id,
        event.lockToken,
        state.processed,
        state.deadLetter ?? false,
        state.nextAvailableAt ?? null,
        state.lastError,
      ],
    );

    if (updated.rowCount !== 1) throw new DeliveryClaimLostError();
  }

  private async insertAttempt(
    client: PoolClient,
    input: CompleteDeliveryInput,
    result: {
      outcome: "succeeded" | "failed";
      errorCode?: string;
      errorMessage?: string;
    },
  ) {
    await client.query(
      `INSERT INTO website_delivery_attempts (
         id, outbox_event_id, destination_key, attempt_number, outcome,
         response_status, error_code, error_message, started_at, completed_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())`,
      [
        randomUUID(),
        input.event.id,
        input.destinationKey,
        input.event.attemptNumber,
        result.outcome,
        input.responseStatus ?? null,
        result.errorCode ?? null,
        result.errorMessage ? result.errorMessage.slice(0, 1000) : null,
        input.startedAt,
      ],
    );
  }
}
