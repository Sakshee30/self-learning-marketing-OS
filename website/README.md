# GrowthOS marketing website

This folder is the public marketing website for GrowthOS. It is intentionally separated from the authenticated customer application in the repository root and the privileged platform-admin frontend.

## Why this is separate

The public website and the SaaS product have different jobs and different failure boundaries:

- `website/` explains the product, its operating model, governance, and trust posture.
- the repository-root Vite application is the authenticated customer workspace.
- `frontend/platform-admin/` is the privileged control-plane application.

The marketing website is built as a static Next.js export so already-published pages can remain readable without the customer application or marketing API being online.

## Structure

```text
website/
├── app/                    # public routes and metadata routes
├── config/
│   └── site-routes.json    # canonical public route/SEO registry
├── scripts/
│   └── check-site.mjs      # route and release-structure validation
├── src/
│   ├── components/         # reusable public-site components
│   ├── config/             # environment/configuration boundaries
│   ├── content/            # approved product/navigation content
│   ├── seo/                # metadata composition
│   └── styles/             # design tokens and public-site styles
├── next.config.ts
├── package.json
└── tsconfig.json
```

Page files compose sections. Public route paths, titles, descriptions and indexability live in `config/site-routes.json`; navigation and SEO metadata derive from that registry. Reusable visual and interaction behavior lives in `src/components`. The website does not import customer-product internals.

## Development

```bash
cd website
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verification

```bash
npm run architecture:check
npm run typecheck
npm run build
```

Or run all three release checks with:

```bash
npm run check
```

The current configuration uses `output: "export"`. Production deployment can serve the generated `out/` directory from object storage/CDN infrastructure.

## Public origin and SEO

Set the canonical public origin at build time:

```bash
NEXT_PUBLIC_SITE_URL=https://www.your-domain.example
```

When the origin is configured, page metadata includes canonical URLs and the static build emits sitemap references using that origin. An invalid configured origin fails the build rather than silently publishing malformed canonical URLs. When no origin is configured, the build stays valid but deliberately omits absolute canonical and sitemap URLs.

## Contact form integration

The contact form deliberately refuses to pretend a submission succeeded when no backend is configured.

Set these variables at build time when the Website API is available:

```bash
NEXT_PUBLIC_MARKETING_API_BASE_URL=https://marketing-api.example.com
NEXT_PUBLIC_CONTACT_FORM_ID=<published-form-id>
```

The form sends to:

```text
POST /v1/forms/{formId}/submissions
```

The API must provide durable acceptance, validation, consent policy, abuse protection, and asynchronous downstream delivery before this workflow is considered production-ready.


## CMS-managed request-access form

When `NEXT_PUBLIC_MARKETING_API_BASE_URL` and `NEXT_PUBLIC_CONTACT_FORM_ID` are configured, the contact page loads the currently published runtime schema from the Website API and renders supported text, email, textarea, select, and checkbox fields. The frontend sends the exact rendered `formVersionId` back with the submission so the backend validates the same version the visitor saw.

If the Website API is not configured, local/static builds retain the existing preview form but do not report a successful submission. If the API is configured but the published schema cannot be loaded, the page fails visibly with a retry action instead of silently rendering stale field definitions.


## Published global-content snapshot

The header, navigation, primary CTA, footer groups, and footer governance copy now come from `config/published-site.json`. The file is a frozen release input, not a runtime CMS request.

Marketing Studio exposes versioned Site Navigation and Site Footer globals. In a release workspace, `cms-studio/npm run snapshot:site` exports only their published revisions into this snapshot. Newer CMS drafts therefore cannot change an already-built public release.

`npm run architecture:check` validates the snapshot schema and rejects empty or unsafe link destinations before the static build.
