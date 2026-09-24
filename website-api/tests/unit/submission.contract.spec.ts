import { describe, expect, it } from "vitest";
import {
  createRequestFingerprint,
  parseIdempotencyKey,
  submissionBodySchema,
} from "../../src/submissions/submission.contract";

describe("submission contract", () => {
  it("accepts the existing public contact payload shape", () => {
    const result = submissionBodySchema.safeParse({
      fields: { name: "Ada", email: "ada@example.test", goal: "Automate campaign operations" },
      source: { path: "/contact" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects nested executable-style field objects", () => {
    const result = submissionBodySchema.safeParse({
      fields: { payload: { script: "alert(1)" } },
      source: { path: "/contact" },
    });
    expect(result.success).toBe(false);
  });

  it("normalizes and validates idempotency keys", () => {
    expect(parseIdempotencyKey("  request-1234  ")).toBe("request-1234");
    expect(() => parseIdempotencyKey("short")).toThrow(/8-128/);
  });

  it("creates the same fingerprint regardless of object key order", () => {
    const first = submissionBodySchema.parse({ fields: { b: "2", a: "1" }, source: { path: "/contact" } });
    const second = submissionBodySchema.parse({ source: { path: "/contact" }, fields: { a: "1", b: "2" } });
    expect(createRequestFingerprint(first)).toBe(createRequestFingerprint(second));
  });
});
