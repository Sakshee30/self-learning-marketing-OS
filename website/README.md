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
├── app/                    # public routes and route metadata
├── src/
│   ├── components/         # reusable public-site components
│   ├── content/            # approved product and navigation content
│   └── styles/             # design tokens and public-site styles
├── next.config.ts
├── package.json
└── tsconfig.json
```

Page files compose sections. Product wording lives in `src/content` where possible. Reusable visual and interaction behavior lives in `src/components`. The website does not import customer-product internals.

## Development

```bash
cd website
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run build
```

The current configuration uses `output: "export"`. Production deployment can serve the generated `out/` directory from object storage/CDN infrastructure.

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
