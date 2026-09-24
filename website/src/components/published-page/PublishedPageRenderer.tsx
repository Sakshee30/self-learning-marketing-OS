import Link from "next/link";
import type { ReactNode } from "react";
import { ContactForm } from "@/src/features/contact/ContactForm";
import type { PublishedPage, PublishedPageBlock } from "@/src/content/published-pages";

function PublicLink({
  href,
  className,
  children
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function HeroBlock({ block }: { block: Extract<PublishedPageBlock, { blockType: "hero" }> }) {
  return (
    <section className="page-hero cms-page-hero">
      <div className="container narrow-container">
        {block.eyebrow ? <span className="eyebrow">{block.eyebrow}</span> : null}
        <h1>{block.heading}</h1>
        {block.body ? <p>{block.body}</p> : null}
        {block.primaryCta ? (
          <div className="cms-block-actions">
            <PublicLink className="button button-primary" href={block.primaryCta.href}>
              {block.primaryCta.label}
              <span aria-hidden="true">↗</span>
            </PublicLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FeatureGridBlock({
  block
}: {
  block: Extract<PublishedPageBlock, { blockType: "featureGrid" }>;
}) {
  return (
    <section className="section cms-feature-section">
      <div className="container">
        {block.heading ? (
          <div className="section-heading centered-heading">
            <h2>{block.heading}</h2>
          </div>
        ) : null}
        <div className="cms-feature-grid">
          {block.items.map((item, index) => (
            <article className="cms-feature-card" key={`${item.title}:${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RichTextBlock({
  block
}: {
  block: Extract<PublishedPageBlock, { blockType: "richText" }>;
}) {
  return (
    <section className="section cms-rich-text-section">
      <div className="container cms-reading-width">
        <p>{block.text}</p>
      </div>
    </section>
  );
}

function CallToActionBlock({
  block
}: {
  block: Extract<PublishedPageBlock, { blockType: "callToAction" }>;
}) {
  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-band">
          <div>
            <h2>{block.heading}</h2>
            {block.body ? <p className="cms-cta-body">{block.body}</p> : null}
          </div>
          <PublicLink className="button button-light" href={block.href}>
            {block.label}
            <span aria-hidden="true">↗</span>
          </PublicLink>
        </div>
      </div>
    </section>
  );
}

function FormBlock({
  block,
  sourcePath
}: {
  block: Extract<PublishedPageBlock, { blockType: "form" }>;
  sourcePath: string;
}) {
  return (
    <section className="section cms-form-section">
      <div className="container narrow-container">
        <div className="contact-card">
          {block.heading ? <h2>{block.heading}</h2> : null}
          <ContactForm
            formId={block.formId}
            sourcePath={sourcePath}
            submitLabel="Submit"
            allowLocalFallback={false}
          />
        </div>
      </div>
    </section>
  );
}

export function PublishedPageRenderer({ page }: { page: PublishedPage }) {
  const sourcePath = `/${page.slug}`;

  return (
    <>
      {page.blocks.map((block, index) => {
        const key = `${block.blockType}:${index}`;
        switch (block.blockType) {
          case "hero":
            return <HeroBlock block={block} key={key} />;
          case "featureGrid":
            return <FeatureGridBlock block={block} key={key} />;
          case "richText":
            return <RichTextBlock block={block} key={key} />;
          case "callToAction":
            return <CallToActionBlock block={block} key={key} />;
          case "form":
            return <FormBlock block={block} key={key} sourcePath={sourcePath} />;
        }
      })}
    </>
  );
}
