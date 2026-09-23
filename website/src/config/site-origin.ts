export function getSiteOrigin(): URL | null {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredOrigin) {
    return null;
  }

  let origin: URL;

  try {
    origin = new URL(configuredOrigin);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute http or https URL.");
  }

  if (origin.protocol !== "https:" && origin.protocol !== "http:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http or https.");
  }

  origin.pathname = "/";
  origin.search = "";
  origin.hash = "";

  return origin;
}
