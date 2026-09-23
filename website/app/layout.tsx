import type { Metadata } from "next";
import { SiteFooter } from "@/src/components/SiteFooter";
import { SiteHeader } from "@/src/components/SiteHeader";
import { getSiteOrigin } from "@/src/config/site-origin";
import { routeByKey } from "@/src/content/routes";
import { siteConfig } from "@/src/content/site";
import "@/src/styles/globals.css";

const siteOrigin = getSiteOrigin();

export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: siteOrigin } : {}),
  title: {
    default: routeByKey.home.title,
    template: "%s | GrowthOS"
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "technology"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
