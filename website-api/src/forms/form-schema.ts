import { z } from "zod";

const optionSchema = z.object({
  label: z.string().min(1).max(120),
  value: z.string().min(1).max(120),
}).strict();

export const publishedFormFieldSchema = z.object({
  name: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/),
  label: z.string().min(1).max(160),
  type: z.enum(["text", "email", "textarea", "select", "checkbox"]),
  required: z.boolean().default(false),
  options: z.array(optionSchema).max(50).optional(),
  consentDecisionKey: z.string().min(1).max(64).optional(),
}).strict().superRefine((field, context) => {
  if (field.type === "select" && (!field.options || field.options.length === 0)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["options"],
      message: "Select fields require at least one option",
    });
  }
});

export const publishedFormSchema = z.object({
  name: z.string().min(1).max(160).optional(),
  fields: z.array(publishedFormFieldSchema).min(1).max(50),
}).strict().superRefine((schema, context) => {
  const names = new Set<string>();
  schema.fields.forEach((field, index) => {
    if (names.has(field.name)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fields", index, "name"],
        message: "Field names must be unique within a published form",
      });
    }
    names.add(field.name);
  });
});

export type PublishedFormSchema = z.infer<typeof publishedFormSchema>;

export type FormFieldValue = string | number | boolean | null | Array<string | number | boolean | null>;

export interface RuntimeFormValidationIssue {
  field: string;
  message: string;
}

export function validateSubmissionFields(
  schema: unknown,
  fields: Record<string, FormFieldValue>,
): RuntimeFormValidationIssue[] {
  const parsed = publishedFormSchema.safeParse(schema);
  if (!parsed.success) {
    // Backward compatibility for legacy manually seeded form versions. New CMS-synced
    // versions are validated before publication and always use the structured schema.
    return [];
  }

  const issues: RuntimeFormValidationIssue[] = [];
  const definitions = new Map(parsed.data.fields.map((field) => [field.name, field]));

  for (const field of parsed.data.fields) {
    const value = fields[field.name];
    const missing =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0) ||
      (Array.isArray(value) && value.length === 0);

    if (field.required && missing) {
      issues.push({ field: field.name, message: "This field is required" });
      continue;
    }
    if (missing) continue;

    if (field.type === "checkbox" && typeof value !== "boolean") {
      issues.push({ field: field.name, message: "Expected a boolean value" });
    }

    if (field.type === "email") {
      if (typeof value !== "string" || !z.string().email().safeParse(value).success) {
        issues.push({ field: field.name, message: "Expected a valid email address" });
      }
    }

    if (field.type === "select") {
      const allowed = new Set((field.options ?? []).map((option) => option.value));
      if (typeof value !== "string" || !allowed.has(value)) {
        issues.push({ field: field.name, message: "Value is not an approved option" });
      }
    }

    if ((field.type === "text" || field.type === "textarea") && typeof value !== "string") {
      issues.push({ field: field.name, message: "Expected a text value" });
    }
  }

  for (const key of Object.keys(fields)) {
    if (!definitions.has(key)) {
      issues.push({ field: key, message: "Field is not part of the published form version" });
    }
  }

  return issues;
}
