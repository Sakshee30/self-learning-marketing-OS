export type ContactApiConfig = {
  apiBaseUrl: URL;
  formId: string;
};

export type ContactApiConfigurationResult =
  | { kind: "configured"; config: ContactApiConfig }
  | { kind: "unconfigured" }
  | { kind: "misconfigured" };

export function resolveContactApiConfig(
  formIdOverride?: string
): ContactApiConfigurationResult {
  const rawApiBaseUrl = process.env.NEXT_PUBLIC_MARKETING_API_BASE_URL?.trim();
  const configuredFormId = process.env.NEXT_PUBLIC_CONTACT_FORM_ID?.trim();
  const formId = formIdOverride?.trim() || configuredFormId;

  if (!rawApiBaseUrl && !formId) {
    return { kind: "unconfigured" };
  }

  if (!rawApiBaseUrl || !formId) {
    return { kind: "misconfigured" };
  }

  let apiBaseUrl: URL;
  try {
    apiBaseUrl = new URL(rawApiBaseUrl.endsWith("/") ? rawApiBaseUrl : `${rawApiBaseUrl}/`);
  } catch {
    return { kind: "misconfigured" };
  }

  if (apiBaseUrl.protocol !== "https:" && apiBaseUrl.protocol !== "http:") {
    return { kind: "misconfigured" };
  }

  return {
    kind: "configured",
    config: {
      apiBaseUrl,
      formId
    }
  };
}

export function contactApiUrl(config: ContactApiConfig, suffix: string): URL {
  return new URL(
    `/v1/forms/${encodeURIComponent(config.formId)}/${suffix.replace(/^\/+/, "")}`,
    config.apiBaseUrl
  );
}
