import rawSnapshot from "@/config/published-site.json";

export type PublishedSiteLink = {
  label: string;
  href: string;
};

export type PublishedSiteSnapshot = {
  schemaVersion: 1;
  brand: {
    name: string;
    descriptor: string;
    description: string;
  };
  navigation: PublishedSiteLink[];
  primaryCta: PublishedSiteLink;
  footer: {
    groups: Array<{
      title: string;
      links: PublishedSiteLink[];
    }>;
    copyrightText: string;
    governanceText?: string;
  };
};

function assertNonEmptyString(value: unknown, path: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid published site snapshot: ${path} must be a non-empty string.`);
  }
}

function assertDestination(value: unknown, path: string): asserts value is string {
  assertNonEmptyString(value, path);
  if (value.startsWith("/") && !value.startsWith("//")) return;

  try {
    const url = new URL(value);
    if (url.protocol === "https:") return;
  } catch {
    // Report one stable validation error below.
  }

  throw new Error(
    `Invalid published site snapshot: ${path} must be site-relative or use HTTPS.`
  );
}

function assertLink(value: unknown, path: string): asserts value is PublishedSiteLink {
  if (!value || typeof value !== "object") {
    throw new Error(`Invalid published site snapshot: ${path} must be an object.`);
  }
  const link = value as Record<string, unknown>;
  assertNonEmptyString(link.label, `${path}.label`);
  assertDestination(link.href, `${path}.href`);
}

function parsePublishedSiteSnapshot(value: unknown): PublishedSiteSnapshot {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid published site snapshot: root must be an object.");
  }

  const snapshot = value as Record<string, unknown>;
  if (snapshot.schemaVersion !== 1) {
    throw new Error("Invalid published site snapshot: unsupported schemaVersion.");
  }

  if (!snapshot.brand || typeof snapshot.brand !== "object") {
    throw new Error("Invalid published site snapshot: brand must be an object.");
  }
  const brand = snapshot.brand as Record<string, unknown>;
  assertNonEmptyString(brand.name, "brand.name");
  assertNonEmptyString(brand.descriptor, "brand.descriptor");
  assertNonEmptyString(brand.description, "brand.description");

  if (!Array.isArray(snapshot.navigation)) {
    throw new Error("Invalid published site snapshot: navigation must be an array.");
  }
  snapshot.navigation.forEach((item, index) => assertLink(item, `navigation[${index}]`));

  assertLink(snapshot.primaryCta, "primaryCta");

  if (!snapshot.footer || typeof snapshot.footer !== "object") {
    throw new Error("Invalid published site snapshot: footer must be an object.");
  }
  const footer = snapshot.footer as Record<string, unknown>;
  if (!Array.isArray(footer.groups) || footer.groups.length === 0) {
    throw new Error("Invalid published site snapshot: footer.groups must be a non-empty array.");
  }

  footer.groups.forEach((value, groupIndex) => {
    if (!value || typeof value !== "object") {
      throw new Error(
        `Invalid published site snapshot: footer.groups[${groupIndex}] must be an object.`
      );
    }
    const group = value as Record<string, unknown>;
    assertNonEmptyString(group.title, `footer.groups[${groupIndex}].title`);
    if (!Array.isArray(group.links) || group.links.length === 0) {
      throw new Error(
        `Invalid published site snapshot: footer.groups[${groupIndex}].links must be non-empty.`
      );
    }
    group.links.forEach((item, linkIndex) =>
      assertLink(item, `footer.groups[${groupIndex}].links[${linkIndex}]`)
    );
  });

  assertNonEmptyString(footer.copyrightText, "footer.copyrightText");
  if (footer.governanceText !== undefined) {
    assertNonEmptyString(footer.governanceText, "footer.governanceText");
  }

  return snapshot as unknown as PublishedSiteSnapshot;
}

export const publishedSite = parsePublishedSiteSnapshot(rawSnapshot);
