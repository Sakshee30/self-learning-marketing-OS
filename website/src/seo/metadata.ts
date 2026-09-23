import type { Metadata } from "next";
import { getSiteOrigin } from "@/src/config/site-origin";
import { routeByKey, type PublicRouteKey } from "@/src/content/routes";
import { siteConfig } from "@/src/content/site";

export function metadataFor(routeKey: PublicRouteKey): Metadata {
  const route = routeByKey[routeKey];
  const siteOrigin = getSiteOrigin();
  const canonicalUrl = siteOrigin ? new URL(route.path, siteOrigin).toString() : undefined;

  return {
    title: routeKey === "home" ? { absolute: route.title } : route.title,
    description: route.description,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots: {
      index: route.indexable,
      follow: route.indexable
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: route.title,
      description: route.description,
      url: canonicalUrl
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description
    }
  };
}
