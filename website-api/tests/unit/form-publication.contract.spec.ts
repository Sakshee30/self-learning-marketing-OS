import { describe, expect, it } from "vitest";
import { isAuthorizedCmsSync, publishFormVersionBodySchema } from "../../src/forms/form-publication.contract";

describe("CMS form synchronization contract", () => {
  it("accepts only the configured bearer token", () => {
    const token = "this-is-a-long-enough-cms-sync-token";
    expect(isAuthorizedCmsSync(`Bearer ${token}`, token)).toBe(true);
    expect(isAuthorizedCmsSync("Bearer wrong-token", token)).toBe(false);
    expect(isAuthorizedCmsSync(undefined, token)).toBe(false);
    expect(isAuthorizedCmsSync(`Bearer ${token}`, undefined)).toBe(false);
  });

  it("rejects duplicate field names and invalid select definitions", () => {
    const result = publishFormVersionBodySchema.safeParse({
      sourceRevision: "a".repeat(64),
      schema: {
        fields: [
          { name: "email", label: "Email", type: "email", required: true },
          { name: "email", label: "Again", type: "select", required: false },
        ],
      },
    });
    expect(result.success).toBe(false);
  });
});
