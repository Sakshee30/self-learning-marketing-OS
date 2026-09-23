export type ContactRequestFields = {
  name: string;
  email: string;
  company: string;
  goal: string;
};

export type ContactSubmissionResult =
  | { kind: "accepted" }
  | { kind: "unconfigured" }
  | { kind: "misconfigured" }
  | { kind: "rejected"; status: number }
  | { kind: "timeout" }
  | { kind: "unavailable" };

const requestTimeoutMs = 12_000;

function resolveSubmissionEndpoint(): URL | "unconfigured" | "misconfigured" {
  const apiBaseUrl = process.env.NEXT_PUBLIC_MARKETING_API_BASE_URL?.trim();
  const formId = process.env.NEXT_PUBLIC_CONTACT_FORM_ID?.trim();

  if (!apiBaseUrl && !formId) {
    return "unconfigured";
  }

  if (!apiBaseUrl || !formId) {
    return "misconfigured";
  }

  let endpoint: URL;

  try {
    endpoint = new URL(
      `/v1/forms/${encodeURIComponent(formId)}/submissions`,
      apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`
    );
  } catch {
    return "misconfigured";
  }

  if (endpoint.protocol !== "https:" && endpoint.protocol !== "http:") {
    return "misconfigured";
  }

  return endpoint;
}

export async function submitContactRequest(
  fields: ContactRequestFields
): Promise<ContactSubmissionResult> {
  const endpoint = resolveSubmissionEndpoint();

  if (endpoint === "unconfigured" || endpoint === "misconfigured") {
    return { kind: endpoint };
  }

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
        fields,
        source: {
          path: "/contact"
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      return {
        kind: "rejected",
        status: response.status
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
