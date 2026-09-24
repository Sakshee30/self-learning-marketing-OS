# GrowthOS Public Website Implementation Coverage Ledger

Updated: 24 September 2026

This ledger tracks the public marketing boundary and its directly supporting website services. The authenticated customer SaaS and privileged platform-control application remain outside this scope. The repository now contains separate `website/`, `website-api/`, and `cms-studio/` boundaries; production infrastructure and complete provider integrations are still separate work.

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
- `website-api/src/forms/`, migrations, submission runtime validation, and authenticated CMS synchronization boundary.
- `website-api/src/delivery/` retryable delivery worker and delivery-attempt persistence.
- `cms-studio/src/publishing/`, `src/jobs/`, and Website API publication adapter used by durable Payload jobs.

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
| Contact transport | Feature-owned submission adapter with 12-second deadline and typed outcomes | Website API now provides durable submission acceptance when configured |
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

## Separate supporting systems

The architecture specification requires these to remain separate deployment/ownership boundaries instead of being hidden inside the public website:

- CMS and Marketing Studio: controlled content/form foundation exists in `cms-studio/`; published form changes now enqueue durable Payload jobs for Website API synchronization, while coordinated release manifests remain incomplete.
- Preview service: not yet implemented.
- Website API: foundation exists in `website-api/` with authenticated form-version publication, runtime form-rule validation, durable submissions, consent records, attribution contracts, and transactional outbox.
- Delivery processing: retryable webhook worker foundation exists; provider-specific CRM/email adapters and operator tooling remain incomplete.
- CRM/email/webhook adapters: generic webhook delivery exists; named provider adapters remain future work.
- Media quarantine and derivative processing.
- Versioned publishing/releases.
- Infrastructure, CDN, WAF, TLS, secrets and operational monitoring.

Those systems are not represented by browser mocks or fake success handlers in this public website.

## Not implemented or not verified

The following remain incomplete or unverified for the public website:

- Complete Payload CMS content model beyond the current controlled page/form/media foundation.
- Coordinated release manifests, static release build/promotion, rollback, and emergency takedown beyond current document-level draft/review/approval/scheduling.
- Blog, resources, authors, categories, tags and editorial refresh workflows.
- Complete Marketing Studio block library and editor tooling beyond the current controlled Hero/Feature Grid/Rich Text/CTA/Form foundation.
- Media quarantine, malware scanning, rights tracking and derivative generation.
- Provider-specific CRM/email delivery adapters and operator-visible retry/history UI.
- Runtime consent-policy evaluation and destination-specific enforcement beyond stored consent history.
- Analytics execution, server-side business outcome confirmation and experiments; the versioned event dictionary and attribution contracts now exist.
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

## Verification snapshot

Platform CI run `35992627950` for commit `8d2c2f53d686274fd4fbee3ea60b70c5459f2b8f` completed successfully on 24 September 2026. The customer/control, public website, Website API, and CMS Studio jobs all passed their configured checks. This verifies the repository's current automated gates; it does not substitute for browser accessibility, penetration, load, recovery, or production-environment qualification.

## Quality assessment

A reliable aggregate quality score is intentionally withheld at this stage.

The structure, route ownership, contact failure semantics and build boundaries can be inspected statically, but the attached engineering standard requires actual verification evidence before an aggregate score is treated as meaningful. A successful TypeScript compile or static build would still not establish accessibility, security, privacy, publishing recovery, or backend durability.

## Next implementation order

1. Implement coordinated release manifests that pin approved page, form, media and configuration revisions before promotion.
2. Add the release build/promotion/verification path with rollback and emergency takedown semantics.
3. Add approved legal/privacy content before publishing consent-dependent tracking.
4. Add provider-specific CRM/email adapters plus authorized delivery-operations tooling.
5. Add runtime consent-policy enforcement for optional destinations.
6. Add browser E2E/accessibility checks and representative performance budgets.
7. Add infrastructure/recovery controls only when deployment requirements are established.
