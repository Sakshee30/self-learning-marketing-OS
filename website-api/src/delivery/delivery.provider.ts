import type { ClaimedDeliveryEvent } from "./delivery.repository";
import type { DeliveryWorkerConfig } from "./delivery.config";

export type DeliveryResult =
  | { ok: true; responseStatus: number }
  | { ok: false; errorCode: string; errorMessage: string; responseStatus?: number };

export interface DeliveryProvider {
  readonly key: string;
  deliver(event: ClaimedDeliveryEvent): Promise<DeliveryResult>;
}

export class WebhookDeliveryProvider implements DeliveryProvider {
  readonly key = "configured-webhook";

  constructor(private readonly config: DeliveryWorkerConfig) {}

  async deliver(event: ClaimedDeliveryEvent): Promise<DeliveryResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);

    try {
      const headers: Record<string, string> = {
        "content-type": "application/json",
        "idempotency-key": event.id,
        "x-growthos-event-type": event.eventType,
      };
      if (this.config.webhookBearerToken) {
        headers.authorization = `Bearer ${this.config.webhookBearerToken}`;
      }

      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          eventId: event.id,
          eventType: event.eventType,
          payload: event.payload,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        return {
          ok: false,
          errorCode: "destination_http_error",
          errorMessage: `Destination returned HTTP ${response.status}`,
          responseStatus: response.status,
        };
      }

      return { ok: true, responseStatus: response.status };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return {
          ok: false,
          errorCode: "destination_timeout",
          errorMessage: "Destination request exceeded the configured timeout",
        };
      }

      return {
        ok: false,
        errorCode: "destination_unavailable",
        errorMessage: error instanceof Error ? error.message : "Destination request failed",
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
