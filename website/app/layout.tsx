import type { Metadata } from "next";
import { SiteFooter } from "@/src/components/SiteFooter";
import { SiteHeader } from "@/src/components/SiteHeader";
import { siteConfig } from "@/src/content/site";
import "@/src/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "GrowthOS — Self-Learning Marketing OS",
    template: "%s | GrowthOS"
  },
  description: siteConfig.description,
  applicationName: "GrowthOS",
  category: "technology",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    siteName: "GrowthOS",
    title: "GrowthOS — Self-Learning Marketing OS",
    description: siteConfig.description
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthOS — Self-Learning Marketing OS",
    description: siteConfig.description
  }
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
