import { z } from "zod";

const deliveryEnvironmentSchema = z
  .object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(50).default(4),
    DELIVERY_WEBHOOK_URL: z.string().url("DELIVERY_WEBHOOK_URL must be an absolute URL"),
    DELIVERY_WEBHOOK_BEARER_TOKEN: z.string().max(4096).optional(),
    DELIVERY_POLL_INTERVAL_MS: z.coerce.number().int().min(100).max(60_000).default(1_000),
    DELIVERY_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(60_000).default(10_000),
    DELIVERY_LEASE_MS: z.coerce.number().int().min(5_000).max(300_000).default(60_000),
    DELIVERY_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(20).default(8),
    DELIVERY_RETRY_BASE_MS: z.coerce.number().int().min(1_000).max(3_600_000).default(30_000),
    DELIVERY_RETRY_MAX_MS: z.coerce.number().int().min(1_000).max(86_400_000).default(3_600_000),
  })
  .superRefine((value, context) => {
    if (value.DELIVERY_RETRY_MAX_MS < value.DELIVERY_RETRY_BASE_MS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DELIVERY_RETRY_MAX_MS"],
        message: "DELIVERY_RETRY_MAX_MS must be greater than or equal to DELIVERY_RETRY_BASE_MS",
      });
    }
  });

export interface DeliveryWorkerConfig {
  databaseUrl: string;
  databasePoolMax: number;
  webhookUrl: string;
  webhookBearerToken?: string;
  pollIntervalMs: number;
  requestTimeoutMs: number;
  leaseMs: number;
  maxAttempts: number;
  retryBaseMs: number;
  retryMaxMs: number;
}

export function loadDeliveryWorkerConfig(
  env: NodeJS.ProcessEnv = process.env,
): DeliveryWorkerConfig {
  const parsed = deliveryEnvironmentSchema.parse(env);
  const webhookUrl = new URL(parsed.DELIVERY_WEBHOOK_URL);
  if (webhookUrl.protocol !== "http:" && webhookUrl.protocol !== "https:") {
    throw new Error("DELIVERY_WEBHOOK_URL must use http or https");
  }

  const token = parsed.DELIVERY_WEBHOOK_BEARER_TOKEN?.trim();

  return {
    databaseUrl: parsed.DATABASE_URL,
    databasePoolMax: parsed.DATABASE_POOL_MAX,
    webhookUrl: webhookUrl.toString(),
    webhookBearerToken: token || undefined,
    pollIntervalMs: parsed.DELIVERY_POLL_INTERVAL_MS,
    requestTimeoutMs: parsed.DELIVERY_REQUEST_TIMEOUT_MS,
    leaseMs: parsed.DELIVERY_LEASE_MS,
    maxAttempts: parsed.DELIVERY_MAX_ATTEMPTS,
    retryBaseMs: parsed.DELIVERY_RETRY_BASE_MS,
    retryMaxMs: parsed.DELIVERY_RETRY_MAX_MS,
  };
}
