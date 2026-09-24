import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteOrigin } from "@/src/config/site-origin";
import { findPublishedPage, publishedPages } from "@/src/content/published-pages";
import { PublishedPageRenderer } from "@/src/components/published-page/PublishedPageRenderer";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPages.map((page) => ({
    slug: page.slug.split("/")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = findPublishedPage(slug.join("/"));
  if (!page) return {};

  const siteOrigin = getSiteOrigin();
  const canonicalPath = page.canonicalPath ?? `/${page.slug}`;
  const canonical = siteOrigin ? new URL(canonicalPath, siteOrigin).toString() : undefined;
  const title = page.metaTitle ?? page.title;

  return {
    title,
    ...(page.metaDescription ? { description: page.metaDescription } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: {
      index: page.indexable,
      follow: page.indexable
    },
    openGraph: {
      title,
      ...(page.metaDescription ? { description: page.metaDescription } : {}),
      ...(canonical ? { url: canonical } : {}),
      type: "website"
    }
  };
}

export default async function CmsPublishedPage({ params }: PageProps) {
  const { slug } = await params;
  const page = findPublishedPage(slug.join("/"));
  if (!page) notFound();

  return <PublishedPageRenderer page={page} />;
}
