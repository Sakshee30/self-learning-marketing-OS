# GrowthOS Website API

Separate backend boundary for public website operations. This service owns runtime form rules, form submission acceptance, consent records, attribution capture contracts, and delivery state. It is intentionally separate from the static public website, CMS database, customer SaaS, and platform administration apps.

## Implemented

- `GET /health`
- `GET /v1/forms/:formId/published-schema`
  - public read-only runtime form schema
  - returns only the active published version and safe rendering metadata
  - validates stored schema before returning it
- `PUT /v1/internal/forms/:formId/published-version`
  - authenticated server-to-server CMS/publishing synchronization
  - strict structured form schema validation
  - immutable source-revision identity
  - one published runtime form version per form
  - previous published version archived transactionally
  - idempotent replay for the same approved source revision
  - per-form PostgreSQL advisory lock to serialize concurrent publication
- `POST /v1/forms/:formId/submissions`
  - exact rendered `formVersionId` binding when supplied by the frontend
  - backward-compatible latest-published lookup for older clients
  - runtime validation against the exact structured form version the visitor saw
  - backward compatibility for legacy manually seeded unstructured schemas
  - bounded request validation
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
- retryable delivery worker foundation
  - leases submission outbox events with `FOR UPDATE SKIP LOCKED`
  - forwards through an explicit webhook provider contract
  - sends an idempotency key per event
  - records every delivery attempt
  - uses bounded exponential retry backoff
  - dead-letters work after the configured maximum attempt count

A successful submission `202` means the submission and its outbox event were durably committed. It does **not** mean CRM, email, analytics, advertising, or any other downstream destination completed work.

## Form publication boundary

The CMS owns authoring and editorial workflow. The Website API owns runtime form rules and submissions. The CMS or publishing worker must synchronize an approved, exact form revision through the authenticated internal endpoint rather than writing directly into Website API tables.

`CMS_SYNC_TOKEN` enables that internal endpoint. When it is not configured, the synchronization endpoint fails closed with `503`; public submission and consent APIs continue to operate against the last published runtime version.

The source revision is a SHA-256 digest supplied by the publishing side. Re-sending the same revision is idempotent. Publishing a different revision archives the previous runtime version and creates the next version in one database transaction.

## Consent boundary

This service stores explicit decisions and policy-version references; it does not define legal purposes, regional requirements, retention periods, notice text, or which optional destination requires which grant. Those policy decisions must come from approved privacy/legal configuration. Until such a policy and destination enforcement exist, optional analytics and advertising execution must remain disabled.

Consent records are append-only. A later record for the same `subjectId` can represent changed preferences or withdrawal while preserving history.

## Attribution boundary

Campaign and touchpoint values are validated for shape and size but remain untrusted marketing attribution data. Missing attribution is stored as `{ "status": "unknown" }` rather than being inferred.

## Delivery worker

The delivery worker is a separate process from the Website API. It currently supports one explicitly configured HTTP webhook destination. The destination can represent an approved internal integration bridge, CRM ingress endpoint, or another controlled receiver.

```bash
npm run worker:delivery
```

Required worker configuration is documented in `.env.example`. Delivery success means the configured destination returned an HTTP 2xx response. Failures are recorded and retried with bounded exponential backoff. After the configured maximum attempts, the outbox event is dead-lettered for operator investigation instead of being silently discarded.

The worker does not infer destinations and has no allow-all fallback. Provider-specific CRM/email adapters, operator retry UI, and destination-specific consent enforcement remain separate work.

## Local setup

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

A form can accept submissions only after a published runtime form version exists. Public clients should load `/v1/forms/:formId/published-schema`, render that schema, and send its `formVersionId` back with the submission. New publishing integrations should use the authenticated form-publication endpoint rather than direct database writes.

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

The CMS-side release worker that calls the form-publication endpoint, release manifests and promotion/rollback, approved legal/privacy content, runtime consent-policy evaluation per destination, analytics execution, provider-specific CRM/email adapters, operator retry tooling/UI, production edge controls, and recovery/load qualification remain separate phases.
