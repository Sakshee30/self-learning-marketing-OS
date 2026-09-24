import { describe, expect, it } from "vitest";
import { normalizeAttribution } from "../../src/attribution/attribution.contract";
import { consentBodySchema } from "../../src/consent/consent.contract";

describe("consent and attribution contracts", () => {
  it("preserves unknown attribution instead of manufacturing a source", () => {
    expect(normalizeAttribution(undefined)).toEqual({ status: "unknown" });
    expect(normalizeAttribution({})).toEqual({ status: "unknown" });
  });

  it("marks validated attribution as known without treating it as trusted identity", () => {
    expect(
      normalizeAttribution({
        firstTouch: { utmSource: "search", landingPath: "/product" },
        pageRevision: "release-42",
      }),
    ).toEqual({
      status: "known",
      firstTouch: { utmSource: "search", landingPath: "/product" },
      pageRevision: "release-42",
    });
  });

  it("requires an explicit policy version and at least one decision", () => {
    expect(
      consentBodySchema.safeParse({
        policyVersion: "privacy-2026-09",
        decisions: { analytics: "denied" },
        source: { path: "/" },
      }).success,
    ).toBe(true);

    expect(
      consentBodySchema.safeParse({ policyVersion: "privacy-2026-09", decisions: {} }).success,
    ).toBe(false);
  });
});
