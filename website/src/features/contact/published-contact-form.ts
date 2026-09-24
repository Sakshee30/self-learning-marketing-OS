import {
  contactApiUrl,
  resolveContactApiConfig,
  type ContactApiConfig
} from "@/src/features/contact/contact-api-config";

export type PublishedFormOption = {
  label: string;
  value: string;
};

export type PublishedFormField = {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "checkbox";
  required: boolean;
  options?: PublishedFormOption[];
  consentDecisionKey?: string;
};

export type PublishedContactForm = {
  formId: string;
  formVersionId: string;
  version: number;
  sourceRevision: string | null;
  publishedAt: string;
  schema: {
    name?: string;
    fields: PublishedFormField[];
  };
};

export type PublishedFormLoadResult =
  | { kind: "loaded"; form: PublishedContactForm; config: ContactApiConfig }
  | { kind: "unconfigured" }
  | { kind: "misconfigured" }
  | { kind: "not_found" }
  | { kind: "rejected"; status: number }
  | { kind: "timeout" }
  | { kind: "unavailable" }
  | { kind: "invalid_response" };

const requestTimeoutMs = 8_000;
const allowedFieldTypes = new Set(["text", "email", "textarea", "select", "checkbox"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseOption(value: unknown): PublishedFormOption | null {
  if (!isRecord(value) || typeof value.label !== "string" || typeof value.value !== "string") {
    return null;
  }
  return { label: value.label, value: value.value };
}

function parseField(value: unknown): PublishedFormField | null {
  if (
    !isRecord(value) ||
    typeof value.name !== "string" ||
    typeof value.label !== "string" ||
    typeof value.type !== "string" ||
    !allowedFieldTypes.has(value.type)
  ) {
    return null;
  }

  const options = Array.isArray(value.options)
    ? value.options.map(parseOption).filter((option): option is PublishedFormOption => option !== null)
    : undefined;

  if (value.type === "select" && (!options || options.length === 0)) {
    return null;
  }

  return {
    name: value.name,
    label: value.label,
    type: value.type as PublishedFormField["type"],
    required: value.required === true,
    ...(options && options.length > 0 ? { options } : {}),
    ...(typeof value.consentDecisionKey === "string"
      ? { consentDecisionKey: value.consentDecisionKey }
      : {})
  };
}

function parsePublishedForm(value: unknown): PublishedContactForm | null {
  if (!isRecord(value) || !isRecord(value.schema) || !Array.isArray(value.schema.fields)) {
    return null;
  }

  const fields = value.schema.fields
    .map(parseField)
    .filter((field): field is PublishedFormField => field !== null);

  if (
    fields.length !== value.schema.fields.length ||
    typeof value.formId !== "string" ||
    typeof value.formVersionId !== "string" ||
    typeof value.version !== "number" ||
    !Number.isInteger(value.version) ||
    typeof value.publishedAt !== "string"
  ) {
    return null;
  }

  return {
    formId: value.formId,
    formVersionId: value.formVersionId,
    version: value.version,
    sourceRevision: typeof value.sourceRevision === "string" ? value.sourceRevision : null,
    publishedAt: value.publishedAt,
    schema: {
      ...(typeof value.schema.name === "string" ? { name: value.schema.name } : {}),
      fields
    }
  };
}

export async function loadPublishedContactForm(
  formIdOverride?: string
): Promise<PublishedFormLoadResult> {
  const configuration = resolveContactApiConfig(formIdOverride);
  if (configuration.kind !== "configured") {
    return configuration;
  }

  const endpoint = contactApiUrl(configuration.config, "published-schema");
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      credentials: "omit",
      cache: "no-store",
      headers: { accept: "application/json" },
      signal: controller.signal
    });

    if (response.status === 404) {
      return { kind: "not_found" };
    }
    if (!response.ok) {
      return { kind: "rejected", status: response.status };
    }

    const parsed = parsePublishedForm(await response.json());
    if (!parsed || parsed.formId !== configuration.config.formId) {
      return { kind: "invalid_response" };
    }

    return {
      kind: "loaded",
      form: parsed,
      config: configuration.config
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { kind: "timeout" };
    }
    return { kind: "unavailable" };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
