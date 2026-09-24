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
- PostgreSQL adapter with required secret/database configuration.
- Focused role-policy tests.

The controlled block model deliberately does not allow marketers to insert arbitrary HTML or executable JavaScript.

## Publishing boundary

Payload draft/version functionality is the editorial storage layer. Publishing a document in this Studio is not yet the complete public release process. A later publishing worker must freeze approved revisions and dependencies into a release manifest, build the static website release, run release checks, promote it, verify delivery, and preserve rollback/takedown behavior.

## Development

Use Node 24.15 or newer.

```bash
cp .env.example .env
npm install
npm run dev
```

Then open the Payload admin URL exposed by the local Next.js app.

## Verification

```bash
npm run check
```

The check generates the Payload import map, runs TypeScript, unit tests, a Payload/Next production build, and a high/critical production dependency audit.

## Not yet implemented

- Coordinated multi-page release manifests and promotion.
- Separate private preview service and scoped preview sessions.
- Static public-site rendering from approved CMS records.
- Rollback and emergency takedown workflows.
- Blog posts, authors, categories, tags, comments, and editorial calendar/Kanban views.
- Navigation/footer/announcement globals and brand settings.
- Redirect management and broader SEO workspace operations.
- Media quarantine, malware scanning, derivatives, S3/object storage, usage tracking, and automatic rights-expiry enforcement.
- Form-runtime publication bridge into the Website API.
- Lead operations, delivery history/retry controls, reporting, and audit dashboards.
- Localization.
- Production database migration/recovery procedures.
