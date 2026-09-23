import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default("/api/v1"),
  VITE_APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  VITE_RELEASE_SHA: z.string().optional()
});

const parsed = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  VITE_RELEASE_SHA: import.meta.env.VITE_RELEASE_SHA
});

export const env = {
  apiBaseUrl: parsed.VITE_API_BASE_URL.replace(/\/$/, ""),
  appEnv: parsed.VITE_APP_ENV,
  releaseSha: parsed.VITE_RELEASE_SHA
} as const;
