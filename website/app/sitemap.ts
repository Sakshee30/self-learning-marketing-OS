import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/src/config/site-origin";
import { publicRoutes } from "@/src/content/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteOrigin = getSiteOrigin();

  if (!siteOrigin) {
    return [];
  }

  return publicRoutes
    .filter((route) => route.indexable)
    .map((route) => ({
      url: new URL(route.path, siteOrigin).toString(),
      changeFrequency: route.key === "home" ? "weekly" : "monthly",
      priority: route.key === "home" ? 1 : 0.7
    }));
}
