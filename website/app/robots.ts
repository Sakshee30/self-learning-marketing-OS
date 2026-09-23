import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/src/config/site-origin";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = getSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: siteOrigin ? new URL("/sitemap.xml", siteOrigin).toString() : undefined
  };
}
