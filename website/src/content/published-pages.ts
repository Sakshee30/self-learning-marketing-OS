import rawSnapshot from "@/config/published-pages.json";

export type PublishedPageLink = {
  label: string;
  href: string;
};

export type PublishedPageBlock =
  | {
      blockType: "hero";
      eyebrow?: string;
      heading: string;
      body?: string;
      primaryCta?: PublishedPageLink;
    }
  | {
      blockType: "featureGrid";
      heading?: string;
      items: Array<{ title: string; description: string }>;
    }
  | {
      blockType: "richText";
      text: string;
    }
  | {
      blockType: "callToAction";
      heading: string;
      body?: string;
      label: string;
      href: string;
    }
  | {
      blockType: "form";
      formId: string;
      heading?: string;
    };

export type PublishedPage = {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  indexable: boolean;
  blocks: PublishedPageBlock[];
};

type PublishedPagesSnapshot = {
  schemaVersion: 1;
  pages: PublishedPage[];
};

function record(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid published pages snapshot: ${path} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function string(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid published pages snapshot: ${path} must be a non-empty string.`);
  }
  return value.trim();
}

function optionalString(value: unknown, path: string): string | undefined {
  if (value === undefined) return undefined;
  return string(value, path);
}

function destination(value: unknown, path: string): string {
  const href = string(value, path);
  if (href.startsWith("/") && !href.startsWith("//")) return href;

  try {
    const url = new URL(href);
    if (url.protocol === "https:") return url.toString();
  } catch {
    // Report one stable validation error below.
  }

  throw new Error(
    `Invalid published pages snapshot: ${path} must be site-relative or use HTTPS.`
  );
}

function parseBlock(value: unknown, path: string): PublishedPageBlock {
  const block = record(value, path);
  const blockType = string(block.blockType, `${path}.blockType`);

  if (blockType === "hero") {
    let primaryCta: PublishedPageLink | undefined;
    if (block.primaryCta !== undefined) {
      const cta = record(block.primaryCta, `${path}.primaryCta`);
      primaryCta = {
        label: string(cta.label, `${path}.primaryCta.label`),
        href: destination(cta.href, `${path}.primaryCta.href`)
      };
    }
    return {
      blockType,
      heading: string(block.heading, `${path}.heading`),
      ...(optionalString(block.eyebrow, `${path}.eyebrow`)
        ? { eyebrow: optionalString(block.eyebrow, `${path}.eyebrow`) }
        : {}),
      ...(optionalString(block.body, `${path}.body`)
        ? { body: optionalString(block.body, `${path}.body`) }
        : {}),
      ...(primaryCta ? { primaryCta } : {})
    };
  }

  if (blockType === "featureGrid") {
    if (!Array.isArray(block.items) || block.items.length === 0) {
      throw new Error(`Invalid published pages snapshot: ${path}.items must be non-empty.`);
    }
    return {
      blockType,
      ...(optionalString(block.heading, `${path}.heading`)
        ? { heading: optionalString(block.heading, `${path}.heading`) }
        : {}),
      items: block.items.map((value, index) => {
        const item = record(value, `${path}.items[${index}]`);
        return {
          title: string(item.title, `${path}.items[${index}].title`),
          description: string(item.description, `${path}.items[${index}].description`)
        };
      })
    };
  }

  if (blockType === "richText") {
    return {
      blockType,
      text: string(block.text, `${path}.text`)
    };
  }

  if (blockType === "callToAction") {
    return {
      blockType,
      heading: string(block.heading, `${path}.heading`),
      ...(optionalString(block.body, `${path}.body`)
        ? { body: optionalString(block.body, `${path}.body`) }
        : {}),
      label: string(block.label, `${path}.label`),
      href: destination(block.href, `${path}.href`)
    };
  }

  if (blockType === "form") {
    const formId = string(block.formId, `${path}.formId`);
    if (!/^[a-z0-9][a-z0-9_-]{1,63}$/.test(formId)) {
      throw new Error(`Invalid published pages snapshot: ${path}.formId is invalid.`);
    }
    return {
      blockType,
      formId,
      ...(optionalString(block.heading, `${path}.heading`)
        ? { heading: optionalString(block.heading, `${path}.heading`) }
        : {})
    };
  }

  throw new Error(`Invalid published pages snapshot: unsupported block type "${blockType}".`);
}

function parseSnapshot(value: unknown): PublishedPagesSnapshot {
  const snapshot = record(value, "root");
  if (snapshot.schemaVersion !== 1) {
    throw new Error("Invalid published pages snapshot: unsupported schemaVersion.");
  }
  if (!Array.isArray(snapshot.pages)) {
    throw new Error("Invalid published pages snapshot: pages must be an array.");
  }

  const seen = new Set<string>();
  const pages = snapshot.pages.map((value, pageIndex) => {
    const page = record(value, `pages[${pageIndex}]`);
    const slug = string(page.slug, `pages[${pageIndex}].slug`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(slug)) {
      throw new Error(`Invalid published pages snapshot: pages[${pageIndex}].slug is invalid.`);
    }
    if (seen.has(slug)) {
      throw new Error(`Invalid published pages snapshot: duplicate slug "${slug}".`);
    }
    seen.add(slug);

    if (!Array.isArray(page.blocks)) {
      throw new Error(
        `Invalid published pages snapshot: pages[${pageIndex}].blocks must be an array.`
      );
    }

    return {
      slug,
      title: string(page.title, `pages[${pageIndex}].title`),
      ...(optionalString(page.metaTitle, `pages[${pageIndex}].metaTitle`)
        ? { metaTitle: optionalString(page.metaTitle, `pages[${pageIndex}].metaTitle`) }
        : {}),
      ...(optionalString(page.metaDescription, `pages[${pageIndex}].metaDescription`)
        ? {
            metaDescription: optionalString(
              page.metaDescription,
              `pages[${pageIndex}].metaDescription`
            )
          }
        : {}),
      ...(page.canonicalPath !== undefined
        ? {
            canonicalPath: destination(
              page.canonicalPath,
              `pages[${pageIndex}].canonicalPath`
            )
          }
        : {}),
      indexable: page.indexable !== false,
      blocks: page.blocks.map((block, blockIndex) =>
        parseBlock(block, `pages[${pageIndex}].blocks[${blockIndex}]`)
      )
    } satisfies PublishedPage;
  });

  return { schemaVersion: 1, pages };
}

export const publishedPages = parseSnapshot(rawSnapshot).pages;

export function findPublishedPage(slug: string): PublishedPage | undefined {
  return publishedPages.find((page) => page.slug === slug);
}
