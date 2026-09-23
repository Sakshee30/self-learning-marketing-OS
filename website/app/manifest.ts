import type { MetadataRoute } from "next";
import { siteConfig } from "@/src/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7fb",
    theme_color: "#6757e8"
  };
}
