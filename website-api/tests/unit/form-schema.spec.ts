import { describe, expect, it } from "vitest";
import { validateSubmissionFields } from "../../src/forms/form-schema";

const schema = {
  fields: [
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "teamSize",
      label: "Team size",
      type: "select",
      required: true,
      options: [
        { label: "1-10", value: "1-10" },
        { label: "11-50", value: "11-50" },
      ],
    },
    { name: "updates", label: "Updates", type: "checkbox", required: false },
  ],
};

describe("published form runtime validation", () => {
  it("accepts fields that satisfy the published form", () => {
    expect(validateSubmissionFields(schema, {
      email: "ada@example.test",
      teamSize: "1-10",
      updates: true,
    })).toEqual([]);
  });

  it("returns actionable issues for missing, invalid, and unknown fields", () => {
    expect(validateSubmissionFields(schema, {
      email: "not-an-email",
      teamSize: "not-listed",
      extra: "unexpected",
    })).toEqual([
      { field: "email", message: "Expected a valid email address" },
      { field: "teamSize", message: "Value is not an approved option" },
      { field: "extra", message: "Field is not part of the published form version" },
    ]);
  });

  it("preserves compatibility with legacy unstructured form versions", () => {
    expect(validateSubmissionFields({}, { anything: "still accepted" })).toEqual([]);
  });
});
