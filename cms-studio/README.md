# GrowthOS CMS & Marketing Studio

This is the independently deployable content-management boundary for the public GrowthOS website. It uses Payload CMS with PostgreSQL and is intentionally separate from the authenticated customer SaaS, platform control app, static public website, and Website API.

## Implemented foundation

- Authenticated Studio users with explicit marketing roles.
- Pages as versioned CMS records rather than source files.
- Editorial statuses from idea through refresh.
- Page content briefs for audience, visitor problem, intent, promise, evidence, CTA, owner, review date, conversion event, and approval requirements.
- Controlled visual blocks: Hero, Feature Grid, Rich Text, CTA, and Form.
- Versioned forms with a bounded field builder and optional consent-policy key references.
- Media records with required alt text and rights-review metadata.
- Drafts, autosave, scheduled publishing, and version history.
- Publish guard requiring an authorized publisher role and an approved/scheduled editorial state.
- SEO fields for title, description, canonical path, and indexability.
- Versioned Site Navigation and Site Footer globals with draft, autosave, scheduling, and publisher-only publish transitions.
- A validated public-site snapshot exporter that freezes published navigation/footer content for the static website build.
- PostgreSQL adapter with required secret/database configuration.
- Focused role-policy tests.
- Durable form-runtime publication bridge:
  - publishing a changed CMS form queues a Payload job in the `form-publication` queue
  - queue payload contains a normalized runtime schema and SHA-256 revision digest
  - a separate worker calls the Website API authenticated internal form-publication endpoint
  - Website API delivery failures remain retryable jobs instead of blocking the editor request
  - repeated delivery of the same revision is safe because the Website API contract is idempotent

The controlled block model deliberately does not allow marketers to insert arbitrary HTML or executable JavaScript.

## Publishing boundary

Payload draft/version functionality is the editorial storage layer. Publishing a document in this Studio is not yet the complete public release process. Form publication uses a durable job bridge to synchronize runtime form rules. Navigation/footer publication can now be frozen into the public website snapshot with `npm run snapshot:site`. A later coordinated release workflow must still pin approved page/media/form revisions into one release manifest, run the static build and checks, promote it, verify delivery, and preserve rollback/takedown behavior.

## Development

Use Node 24.15 or newer.

```bash
cp .env.example .env
npm install
npm run dev
```

Then open the Payload admin URL exposed by the local Next.js app.

Run the form-publication worker as a separate process when Website API synchronization is configured:

```bash
npm run worker:form-publication
```

For a one-shot local/operational drain:

```bash
npm run worker:form-publication:once
```

After publishing Site Navigation or Site Footer, export the current published global revisions into the website release workspace:

```bash
npm run snapshot:site
```

The default target is `../website/config/published-site.json`. Set `PUBLIC_SITE_SNAPSHOT_PATH` when the release workspace uses a different layout. This command reads published revisions only; newer drafts are not exported.

## Verification

```bash
npm run check
```

The check generates the Payload import map, runs TypeScript, unit tests, a Payload/Next production build, and a high/critical production dependency audit.

## Not yet implemented

- Coordinated multi-page release manifests and promotion.
- Separate private preview service and scoped preview sessions.
- Static public-site rendering from approved CMS page records; navigation/footer snapshot rendering is implemented.
- Coordinated snapshot/release promotion, rollback, and emergency takedown workflows.
- Blog posts, authors, categories, tags, comments, and editorial calendar/Kanban views.
- Announcement and broader brand-setting globals beyond the current navigation/footer brand fields.
- Redirect management and broader SEO workspace operations.
- Media quarantine, malware scanning, derivatives, S3/object storage, usage tracking, and automatic rights-expiry enforcement.
- Lead operations, delivery history/retry controls, reporting, and audit dashboards.
- Localization.
- Production database migration/recovery procedures.
