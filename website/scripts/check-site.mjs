import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const websiteRoot = resolve(import.meta.dirname, "..");
const routesPath = resolve(websiteRoot, "config/site-routes.json");
const snapshotPath = resolve(websiteRoot, "config/published-site.json");
const pagesSnapshotPath = resolve(websiteRoot, "config/published-pages.json");
const routes = JSON.parse(readFileSync(routesPath, "utf8"));
const publishedSite = JSON.parse(readFileSync(snapshotPath, "utf8"));
const publishedPages = JSON.parse(readFileSync(pagesSnapshotPath, "utf8"));

const errors = [];
const seenKeys = new Set();
const seenPaths = new Set();

function isSafeDestination(value) {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function validatePublishedLink(link, path) {
  if (!link || typeof link !== "object") {
    errors.push(`${path} must be an object.`);
    return;
  }
  if (typeof link.label !== "string" || link.label.trim().length === 0) {
    errors.push(`${path}.label must be a non-empty string.`);
  }
  if (!isSafeDestination(link.href)) {
    errors.push(`${path}.href must be site-relative or HTTPS.`);
  }
}

if (!publishedSite || typeof publishedSite !== "object" || publishedSite.schemaVersion !== 1) {
  errors.push("config/published-site.json must use schemaVersion 1.");
} else {
  if (!publishedSite.brand || typeof publishedSite.brand !== "object") {
    errors.push("Published site snapshot must contain brand configuration.");
  } else {
    for (const field of ["name", "descriptor", "description"]) {
      if (
        typeof publishedSite.brand[field] !== "string" ||
        publishedSite.brand[field].trim().length === 0
      ) {
        errors.push(`Published site brand.${field} must be a non-empty string.`);
      }
    }
  }

  if (!Array.isArray(publishedSite.navigation)) {
    errors.push("Published site navigation must be an array.");
  } else {
    publishedSite.navigation.forEach((link, index) =>
      validatePublishedLink(link, `navigation[${index}]`)
    );
  }

  validatePublishedLink(publishedSite.primaryCta, "primaryCta");

  if (
    !publishedSite.footer ||
    typeof publishedSite.footer !== "object" ||
    !Array.isArray(publishedSite.footer.groups) ||
    publishedSite.footer.groups.length === 0
  ) {
    errors.push("Published site footer must contain at least one group.");
  } else {
    publishedSite.footer.groups.forEach((group, groupIndex) => {
      if (!group || typeof group !== "object") {
        errors.push(`footer.groups[${groupIndex}] must be an object.`);
        return;
      }
      if (typeof group.title !== "string" || group.title.trim().length === 0) {
        errors.push(`footer.groups[${groupIndex}].title must be non-empty.`);
      }
      if (!Array.isArray(group.links) || group.links.length === 0) {
        errors.push(`footer.groups[${groupIndex}].links must be non-empty.`);
      } else {
        group.links.forEach((link, linkIndex) =>
          validatePublishedLink(link, `footer.groups[${groupIndex}].links[${linkIndex}]`)
        );
      }
    });
  }
}

if (!Array.isArray(routes) || routes.length === 0) {
  errors.push("config/site-routes.json must contain at least one public route.");
}

for (const route of routes) {
  if (!route || typeof route !== "object") {
    errors.push("Every route entry must be an object.");
    continue;
  }

  for (const field of ["key", "path", "title", "description", "indexable"]) {
    if (!(field in route)) {
      errors.push(`Route entry is missing required field "${field}".`);
    }
  }

  if (typeof route.key !== "string" || route.key.length === 0) {
    errors.push("Every route needs a non-empty string key.");
  } else if (seenKeys.has(route.key)) {
    errors.push(`Duplicate route key: ${route.key}`);
  } else {
    seenKeys.add(route.key);
  }

  if (typeof route.path !== "string" || !route.path.startsWith("/")) {
    errors.push(`Route "${route.key ?? "unknown"}" must use an absolute site path.`);
    continue;
  }

  if (seenPaths.has(route.path)) {
    errors.push(`Duplicate route path: ${route.path}`);
  } else {
    seenPaths.add(route.path);
  }

  const pagePath =
    route.path === "/"
      ? resolve(websiteRoot, "app/page.tsx")
      : resolve(websiteRoot, "app", route.path.slice(1), "page.tsx");

  if (!existsSync(pagePath)) {
    errors.push(`Route "${route.path}" has no page implementation at ${pagePath}.`);
  }

  if (typeof route.title !== "string" || route.title.trim().length < 2) {
    errors.push(`Route "${route.path}" needs a meaningful title.`);
  }

  if (typeof route.description !== "string" || route.description.trim().length < 40) {
    errors.push(`Route "${route.path}" needs a descriptive summary of at least 40 characters.`);
  }

  if (typeof route.indexable !== "boolean") {
    errors.push(`Route "${route.path}" must declare indexable as a boolean.`);
  }
}


const allowedPageBlocks = new Set(["hero", "featureGrid", "richText", "callToAction", "form"]);
const seenCmsPaths = new Set();

if (!publishedPages || typeof publishedPages !== "object" || publishedPages.schemaVersion !== 1) {
  errors.push("config/published-pages.json must use schemaVersion 1.");
} else if (!Array.isArray(publishedPages.pages)) {
  errors.push("config/published-pages.json must contain a pages array.");
} else {
  for (const [pageIndex, page] of publishedPages.pages.entries()) {
    const path = `pages[${pageIndex}]`;
    if (!page || typeof page !== "object") {
      errors.push(`${path} must be an object.`);
      continue;
    }

    if (
      typeof page.slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(page.slug)
    ) {
      errors.push(`${path}.slug must use lowercase kebab-case path segments.`);
      continue;
    }

    const routePath = `/${page.slug}`;
    if (seenPaths.has(routePath)) {
      errors.push(`CMS page route "${routePath}" conflicts with a reserved public route.`);
    }
    if (seenCmsPaths.has(routePath)) {
      errors.push(`CMS page route "${routePath}" is duplicated.`);
    }
    seenCmsPaths.add(routePath);

    if (typeof page.title !== "string" || page.title.trim().length < 2) {
      errors.push(`${path}.title must be meaningful.`);
    }
    if (typeof page.indexable !== "boolean") {
      errors.push(`${path}.indexable must be a boolean.`);
    }
    if (!Array.isArray(page.blocks)) {
      errors.push(`${path}.blocks must be an array.`);
      continue;
    }

    page.blocks.forEach((block, blockIndex) => {
      const blockPath = `${path}.blocks[${blockIndex}]`;
      if (!block || typeof block !== "object" || !allowedPageBlocks.has(block.blockType)) {
        errors.push(`${blockPath} uses an unsupported block type.`);
        return;
      }

      if (block.blockType === "hero" && (typeof block.heading !== "string" || !block.heading.trim())) {
        errors.push(`${blockPath}.heading is required.`);
      }

      if (block.blockType === "featureGrid" && (!Array.isArray(block.items) || block.items.length === 0)) {
        errors.push(`${blockPath}.items must be non-empty.`);
      }

      if (block.blockType === "richText" && (typeof block.text !== "string" || !block.text.trim())) {
        errors.push(`${blockPath}.text must be non-empty.`);
      }

      if (block.blockType === "callToAction") {
        if (typeof block.heading !== "string" || !block.heading.trim()) {
          errors.push(`${blockPath}.heading is required.`);
        }
        if (typeof block.label !== "string" || !block.label.trim()) {
          errors.push(`${blockPath}.label is required.`);
        }
        if (!isSafeDestination(block.href)) {
          errors.push(`${blockPath}.href must be site-relative or HTTPS.`);
        }
      }

      if (
        block.blockType === "form" &&
        (typeof block.formId !== "string" || !/^[a-z0-9][a-z0-9_-]{1,63}$/.test(block.formId))
      ) {
        errors.push(`${blockPath}.formId is invalid.`);
      }
    });
  }
}

for (const requiredFile of [
  "app/not-found.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "app/manifest.ts",
  "src/content/routes.ts",
  "src/content/published-site.ts",
  "src/content/published-pages.ts",
  "src/components/published-page/PublishedPageRenderer.tsx",
  "src/seo/metadata.ts",
  "config/published-site.json",
  "config/published-pages.json",
  "app/[...slug]/page.tsx"
]) {
  if (!existsSync(resolve(websiteRoot, requiredFile))) {
    errors.push(`Missing required public-site file: ${requiredFile}`);
  }
}

if (errors.length > 0) {
  console.error("Public website architecture check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Public website architecture check passed for ${routes.length} core routes, ${publishedPages.pages?.length ?? 0} CMS pages, and the published site snapshot.`
);
