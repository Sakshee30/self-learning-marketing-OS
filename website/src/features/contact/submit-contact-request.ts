import {
  contactApiUrl,
  resolveContactApiConfig
} from "@/src/features/contact/contact-api-config";

export type ContactFieldValue =
  | string
  | number
  | boolean
  | null
  | Array<string | number | boolean | null>;

export type ContactRequestFields = Record<string, ContactFieldValue>;

export type ContactValidationIssue = {
  field: string;
  message: string;
};

export type ContactSubmissionResult =
  | { kind: "accepted" }
  | { kind: "unconfigured" }
  | { kind: "misconfigured" }
  | { kind: "rejected"; status: number; issues?: ContactValidationIssue[] }
  | { kind: "timeout" }
  | { kind: "unavailable" };

const requestTimeoutMs = 12_000;

function parseValidationIssues(value: unknown): ContactValidationIssue[] | undefined {
  if (!value || typeof value !== "object") return undefined;
  const issues = (value as { issues?: unknown }).issues;
  if (!Array.isArray(issues)) return undefined;

  const parsed = issues
    .filter(
      (issue): issue is { field: string; message: string } =>
        Boolean(issue) &&
        typeof issue === "object" &&
        typeof (issue as { field?: unknown }).field === "string" &&
        typeof (issue as { message?: unknown }).message === "string"
    )
    .map((issue) => ({ field: issue.field, message: issue.message }));

  return parsed.length > 0 ? parsed : undefined;
}

export async function submitContactRequest(
  fields: ContactRequestFields,
  formVersionId?: string
): Promise<ContactSubmissionResult> {
  const configuration = resolveContactApiConfig();

  if (configuration.kind !== "configured") {
    return { kind: configuration.kind };
  }

  const endpoint = contactApiUrl(configuration.config, "submissions");
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "omit",
      cache: "no-store",
      headers: {
        accept: "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        ...(formVersionId ? { formVersionId } : {}),
        fields,
        source: {
          path: "/contact"
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      let issues: ContactValidationIssue[] | undefined;
      if (response.status === 400) {
        try {
          issues = parseValidationIssues(await response.json());
        } catch {
          issues = undefined;
        }
      }
      return {
        kind: "rejected",
        status: response.status,
        ...(issues ? { issues } : {})
      };
    }

    return { kind: "accepted" };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { kind: "timeout" };
    }

    return { kind: "unavailable" };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
