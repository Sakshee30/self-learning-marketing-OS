# GrowthOS Website API

Separate backend boundary for public website operations. This service owns runtime form submission acceptance, consent records, attribution capture contracts, and will later own delivery state and approved website integrations. It is intentionally separate from the static public website, customer SaaS, and platform administration apps.

## Implemented

- `GET /health`
- `POST /v1/forms/:formId/submissions`
  - published form-version lookup
  - bounded validation
  - optional idempotency
  - optional reference to a durable consent record
  - validated first/last-touch attribution data
  - explicit `unknown` attribution when no evidence was supplied
  - submission + outbox event in one PostgreSQL transaction
- `POST /v1/consent`
  - append-only consent history
  - opaque subject identifier created by the service when absent
  - explicit policy version
  - explicit granted/denied decisions keyed by policy-managed capability names
  - consent record + outbox event in one PostgreSQL transaction
- versioned SQL migrations
- versioned marketing event dictionary under `contracts/marketing-events.v1.json`
- OpenAPI contract
- unit and PostgreSQL integration tests

A successful `202` means the relevant record and its outbox event were durably committed. It does **not** mean CRM, email, analytics, advertising, or any other downstream destination completed work.

## Consent boundary

This service stores explicit decisions and policy-version references; it does not define legal purposes, regional requirements, retention periods, notice text, or which optional destination requires which grant. Those policy decisions must come from approved privacy/legal configuration. Until such a policy and destination enforcement exist, optional analytics and advertising execution must remain disabled.

Consent records are append-only. A later record for the same `subjectId` can represent changed preferences or withdrawal while preserving history.

## Attribution boundary

Campaign and touchpoint values are validated for shape and size but remain untrusted marketing attribution data. Missing attribution is stored as `{ "status": "unknown" }` rather than being inferred.

## Local setup

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Before a form can accept submissions, a publishing/CMS process must create exactly one `published` row in `website_form_versions` for that `form_id`. This service does not seed production form definitions.

## Verification

```bash
npm run check
```

Integration verification requires PostgreSQL:

```bash
DATABASE_URL=postgres://... npm run db:migrate
DATABASE_URL=postgres://... npm run test:integration
```

CI provisions PostgreSQL, applies migrations, and runs the integration suite.

## Not yet implemented

CMS authoring, approved legal/privacy content, runtime consent-policy evaluation per destination, analytics execution, CRM/email/webhook delivery workers, operator retry tooling, production edge controls, and recovery/load qualification remain separate phases.
