import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublishedPageRenderer } from "@/src/components/published-page/PublishedPageRenderer";
import { getSiteOrigin } from "@/src/config/site-origin";
import { findPublishedPage, publishedPages } from "@/src/content/published-pages";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const EMPTY_SNAPSHOT_SENTINEL = "__cms-empty";

export const dynamicParams = false;

export function generateStaticParams() {
  if (publishedPages.length === 0) {
    // Next static export requires at least one generated parameter set for a dynamic
    // route. This reserved value cannot be a valid CMS slug and always renders 404.
    return [{ slug: [EMPTY_SNAPSHOT_SENTINEL] }];
  }

  return publishedPages.map((page) => ({
    slug: page.slug.split("/")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug.length === 1 && slug[0] === EMPTY_SNAPSHOT_SENTINEL) {
    return { robots: { index: false, follow: false } };
  }

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(page.metaDescription ? { description: page.metaDescription } : {})
    }
  };
}

export default async function CmsPublishedPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug.length === 1 && slug[0] === EMPTY_SNAPSHOT_SENTINEL) {
    notFound();
  }

  const page = findPublishedPage(slug.join("/"));
  if (!page) notFound();

  return <PublishedPageRenderer page={page} />;
}
