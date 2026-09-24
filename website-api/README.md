# GrowthOS Website API

Separate backend boundary for public website operations. This service owns runtime form submission acceptance and will later own consent records, delivery state, and approved website integrations. It is intentionally separate from the static public website, customer SaaS, and platform administration apps.

## Implemented in this phase

- `POST /v1/forms/:formId/submissions`
- PostgreSQL-backed form-version resolution
- transactional submission + outbox acceptance
- optional idempotency keys with replay and conflict detection
- bounded request validation and explicit 400/404/409/503 responses
- `GET /health`
- versioned SQL migration runner
- OpenAPI contract

A successful `202` means the submission was durably accepted into PostgreSQL together with an outbox event. It does **not** mean CRM, email, qualification, or any downstream delivery succeeded.

## Local setup

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Before a form can accept submissions, a publishing/CMS process must create exactly one `published` row in `website_form_versions` for that `form_id`. This service does not seed production form definitions or invent a CMS workflow.

## Verification

```bash
npm run check
```

Integration verification requires PostgreSQL:

```bash
DATABASE_URL=postgres://... npm run db:migrate
DATABASE_URL=postgres://... npm run test:integration
```

CI provisions PostgreSQL, applies the migrations, and runs the integration suite.

## Current boundary

This phase does not implement CMS authoring, consent-policy decisions, CRM/email delivery workers, analytics, or legal content. Those remain separate follow-on capabilities.
