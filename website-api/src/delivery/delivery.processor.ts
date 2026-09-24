import type { DeliveryWorkerConfig } from "./delivery.config";
import type { DeliveryProvider } from "./delivery.provider";
import { DeliveryRepository } from "./delivery.repository";

export type DeliveryRunOutcome =
  | "idle"
  | "succeeded"
  | "retry_scheduled"
  | "dead_lettered";

export function calculateRetryDelayMs(
  attemptNumber: number,
  baseMs: number,
  maxMs: number,
): number {
  const exponent = Math.max(0, attemptNumber - 1);
  return Math.min(maxMs, baseMs * 2 ** exponent);
}

export class DeliveryProcessor {
  constructor(
    private readonly repository: DeliveryRepository,
    private readonly provider: DeliveryProvider,
    private readonly config: DeliveryWorkerConfig,
  ) {}

  async runOnce(): Promise<DeliveryRunOutcome> {
    const event = await this.repository.claimNext(this.config.leaseMs);
    if (!event) return "idle";

    const startedAt = new Date();
    let result;
    try {
      result = await this.provider.deliver(event);
    } catch (error) {
      result = {
        ok: false as const,
        errorCode: "destination_exception",
        errorMessage: error instanceof Error ? error.message : "Unexpected destination failure",
      };
    }

    if (result.ok) {
      await this.repository.complete({
        event,
        destinationKey: this.provider.key,
        startedAt,
        responseStatus: result.responseStatus,
      });
      return "succeeded";
    }

    const deadLetter = event.attemptNumber >= this.config.maxAttempts;
    const nextAvailableAt = deadLetter
      ? undefined
      : new Date(
          Date.now() +
            calculateRetryDelayMs(
              event.attemptNumber,
              this.config.retryBaseMs,
              this.config.retryMaxMs,
            ),
        );

    await this.repository.fail({
      event,
      destinationKey: this.provider.key,
      startedAt,
      responseStatus: result.responseStatus,
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
      deadLetter,
      nextAvailableAt,
    });

    return deadLetter ? "dead_lettered" : "retry_scheduled";
  }
}
