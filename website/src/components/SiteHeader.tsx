import Link from "next/link";
import { siteConfig } from "@/src/content/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={`${siteConfig.name} home`}>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-copy">
            <strong>{siteConfig.name}</strong>
            <small>{siteConfig.descriptor}</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="button button-primary button-small" href={siteConfig.primaryCta.href}>
            {siteConfig.primaryCta.label}
            <span aria-hidden="true">↗</span>
          </Link>

          <details className="mobile-nav">
            <summary aria-label="Open navigation">
              <span />
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              {siteConfig.navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link className="button button-primary" href={siteConfig.primaryCta.href}>
                {siteConfig.primaryCta.label}
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
