# GrowthOS Public Website Implementation Coverage Ledger

Updated: 24 September 2026

This ledger covers the independently deployable public marketing website in `website/`. It does not describe the authenticated customer SaaS or the privileged platform-control application, and it does not claim that the separate CMS, Website API, workers, infrastructure, or production security controls already exist.

## Inspected scope

The current pass inspected and changed:

- `website/app/` public routes and shared layout.
- `website/src/components/` reusable public presentation components.
- `website/src/content/` product and navigation content.
- `website/src/features/contact/` request-access submission boundary.
- `website/src/config/` build-time website configuration.
- `website/src/seo/` metadata composition.
- `website/config/site-routes.json` canonical public route registry.
- `website/scripts/check-site.mjs` release-structure validation.
- `website/package.json`, `website/next.config.ts`, and `website/tsconfig.json`.
- Frontend CI configuration that verifies the website as an independent build.

The customer workspace under `src/` and platform control under `frontend/platform-admin/` were inspected only enough to preserve their deployment boundaries; they were not refactored as part of this website pass.

## Implemented public website capabilities

| Area | Current implementation | Evidence boundary |
| --- | --- | --- |
| Deployment boundary | Independent Next.js application in `website/` | Does not import customer-app internals |
| Rendering model | Static export through `output: "export"` | Dynamic operations must use separate services |
| Core routes | Home, Product, How it works, Trust & control, Request access, 404 | Only routes supported by current product content are published |
| Route ownership | Canonical registry in `config/site-routes.json` | Duplicate paths/keys are rejected by architecture check |
| Navigation | Header/footer derive route paths from the canonical registry | Reduces route drift |
| SEO metadata | Route descriptions, canonical URL support, robots metadata and social metadata | Absolute canonical URL requires `NEXT_PUBLIC_SITE_URL` |
| Search discovery | Static `robots.txt`, `sitemap.xml`, and web manifest metadata routes | Sitemap entries are emitted only when the public origin is configured |
| Design system | Central CSS variables, responsive layouts, focus styles and reduced-motion handling | Browser/assistive-technology qualification is not yet complete |
| Product claims | Product language derives from the repository product contract | No invented customers, certifications, revenue results or guaranteed outcomes |
| Contact UI | Required fields, duplicate-submit protection, pending/success/error states | Browser state is not treated as downstream CRM/email delivery proof |
| Contact transport | Feature-owned submission adapter with 12-second deadline and typed outcomes | Separate Website API still required for durable acceptance |
| Failure honesty | Unconfigured, misconfigured, rejected, timeout and unavailable states remain distinct | No hardcoded/fake success fallback |
| Verification | `npm run architecture:check`, TypeScript check, static production build in website CI | Successful CI/build evidence must be read from an actual workflow run |

## Public visitor flow currently implemented

```text
Visitor
  ↓
Static public page
  ↓
Product / operating-model / trust information
  ↓
Request access form
  ↓
Client-side required-field checks
  ↓
Configured Website API submission endpoint
  ↓
Confirmed HTTP acceptance OR an explicit failure/unknown state
```

The browser does not claim CRM delivery, email delivery, qualification, opportunity creation, or customer conversion.

## Deliberately separate future systems

The architecture specification requires these to remain separate deployment/ownership boundaries instead of being hidden inside the public website:

- CMS and Marketing Studio.
- Preview service.
- Website API.
- Lead/submission database and transactional outbox.
- Delivery workers and queue.
- CRM/email/webhook adapters.
- Media quarantine and derivative processing.
- Versioned publishing/releases.
- Infrastructure, CDN, WAF, TLS, secrets and operational monitoring.

Those systems are not represented by browser mocks or fake success handlers in this public website.

## Not implemented or not verified

The following remain incomplete or unverified for the public website:

- Payload CMS and PostgreSQL content model.
- Draft/review/approval/scheduling/rollback publishing workflow.
- Blog, resources, authors, categories, tags and editorial refresh workflows.
- Marketing Studio page builder and approved block schemas.
- Media quarantine, malware scanning, rights tracking and derivative generation.
- Durable form acceptance, database transaction and outbox.
- CRM/email/webhook delivery workers, retries and operator-visible delivery history.
- Consent preference management, consent versioning and withdrawal handling.
- Analytics event dictionary, attribution, server-side outcome confirmation and experiments.
- Search, localization and locale-specific routing.
- Authoritative pricing catalog and checkout integration.
- Approved privacy, terms, accessibility and other legal content.
- Production CSP/security headers at the hosting layer.
- Production CDN/WAF/TLS configuration.
- Browser accessibility testing with assistive technology.
- Playwright end-to-end tests.
- Real-user Core Web Vitals and representative performance/load testing.
- Penetration/security qualification.
- Backup/restore and release rollback/takedown exercises.
- Dependency lockfile for the standalone website.

## Quality assessment

A reliable aggregate quality score is intentionally withheld at this stage.

The structure, route ownership, contact failure semantics and build boundaries can be inspected statically, but the attached engineering standard requires actual verification evidence before an aggregate score is treated as meaningful. A successful TypeScript compile or static build would still not establish accessibility, security, privacy, publishing recovery, or backend durability.

## Next implementation order

1. Obtain a green public-website CI build with recorded evidence.
2. Add approved legal/privacy content before publishing consent-dependent tracking.
3. Implement the separate Website API with durable submission + outbox acceptance.
4. Add consent and attribution contracts.
5. Implement CMS/Marketing Studio and versioned publishing as a separate application boundary.
6. Add browser E2E/accessibility checks and representative performance budgets.
7. Add infrastructure/recovery controls only when deployment requirements are established.
