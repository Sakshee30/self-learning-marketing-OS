import Link from "next/link";
import { footerConfig, footerGroups, siteConfig } from "@/src/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
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
          <p>{siteConfig.description}</p>
        </div>

        {footerGroups.map((group) => (
          <div className="footer-links" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((link) => (
              <Link href={link.href} key={`${group.title}:${link.href}`}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {footerConfig.copyrightText}</p>
        {footerConfig.governanceText ? <p>{footerConfig.governanceText}</p> : null}
      </div>
    </footer>
  );
}
