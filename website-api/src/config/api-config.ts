import { z } from "zod";

export const API_CONFIG = Symbol("API_CONFIG");
export const WEBSITE_API_BODY_LIMIT_BYTES = 64 * 1024;

const environmentSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3002),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(50).default(10),
  WEBSITE_ORIGINS: z.string().default(""),
  CMS_SYNC_TOKEN: z.string().min(24).max(4096).optional(),
});

export interface ApiConfig {
  databaseUrl: string;
  databasePoolMax: number;
  host: string;
  port: number;
  websiteOrigins: string[];
  cmsSyncToken?: string;
}

export function loadApiConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const parsed = environmentSchema.parse(env);
  const websiteOrigins = parsed.WEBSITE_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      const url = new URL(origin);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error(`WEBSITE_ORIGINS contains an unsupported origin: ${origin}`);
      }
      return url.origin;
    });

  const cmsSyncToken = parsed.CMS_SYNC_TOKEN?.trim();

  return {
    databaseUrl: parsed.DATABASE_URL,
    databasePoolMax: parsed.DATABASE_POOL_MAX,
    host: parsed.HOST,
    port: parsed.PORT,
    websiteOrigins,
    cmsSyncToken: cmsSyncToken || undefined,
  };
}
