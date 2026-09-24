import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/src/config/site-origin";
import { publishedPages } from "@/src/content/published-pages";
import { publicRoutes } from "@/src/content/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteOrigin = getSiteOrigin();

  if (!siteOrigin) {
    return [];
  }

  const coreRoutes: MetadataRoute.Sitemap = publicRoutes
    .filter((route) => route.indexable)
    .map((route) => ({
      url: new URL(route.path, siteOrigin).toString(),
      changeFrequency: route.key === "home" ? "weekly" : "monthly",
      priority: route.key === "home" ? 1 : 0.7
    }));

  const cmsRoutes: MetadataRoute.Sitemap = publishedPages
    .filter((page) => page.indexable)
    .map((page) => ({
      url: new URL(`/${page.slug}`, siteOrigin).toString(),
      changeFrequency: "monthly",
      priority: 0.6
    }));

  return [...coreRoutes, ...cmsRoutes];
}
