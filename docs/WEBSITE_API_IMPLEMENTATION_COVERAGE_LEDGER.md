# GrowthOS Website API Implementation Coverage Ledger

Updated: 24 September 2026

This ledger covers the independently deployable public Website API in `website-api/`. It does not claim that CMS/Marketing Studio, delivery workers, CRM/email providers, approved legal/privacy content, analytics execution, or infrastructure deployment are complete.

## Implemented scope

- NestJS application using the Fastify adapter.
- `GET /health` service health endpoint.
- `POST /v1/forms/:formId/submissions` durable acceptance endpoint.
- Bounded request body size and server-side request-shape validation.
- Published form-version lookup from PostgreSQL.
- Transactional insertion of the submission and `website.submission.accepted.v1` outbox event.
- Optional idempotency keys with deterministic request fingerprints, replay behavior, and conflict detection.
- Explicit invalid-input, unpublished-form, idempotency-conflict, invalid-consent-reference, and persistence-unavailable responses.
- Append-only `POST /v1/consent` records with opaque subject IDs, policy-version references, explicit granted/denied decisions, and `website.consent.recorded.v1` outbox events.
- Submission attribution contract for first touch, last touch, page revision, and experiment variant.
- Explicit `{ "status": "unknown" }` storage when no attribution evidence is supplied.
- Versioned marketing event dictionary with owner, trigger, allowed fields, policy-resolved consent requirement, and deduplication rule.
- Versioned SQL migration runner guarded by a PostgreSQL advisory lock.
- OpenAPI description of the implemented public contracts.
- Unit tests for validation, idempotency, fingerprinting, consent, attribution, and event-dictionary completeness.
- PostgreSQL integration tests for submission + outbox atomic acceptance, replay/conflict behavior, consent history, and consent outbox creation.
- CI PostgreSQL service that applies migrations before running integration tests.
- CI dependency-audit gate for high/critical production dependency findings.

## Acceptance semantics

A `202` response from the submission endpoint means the Website API committed the submission record and its outbox event in the same database transaction. A `202` from the consent endpoint means the preference record and its outbox event were committed together. Neither response means CRM, email, webhook, analytics, advertising, qualification, opportunity creation, or another downstream operation succeeded.

If PostgreSQL cannot durably accept the operation, the API returns an explicit unavailable response rather than manufacturing success.

## Consent and attribution boundaries

- Consent records preserve history; changed preferences or withdrawal create a new record rather than overwriting prior evidence.
- `policyVersion` and decision keys are references to policy configuration. This code does not invent legal purposes, retention periods, notices, or regional rules.
- Optional destination execution is not implemented yet. Until approved policy evaluation and destination enforcement exist, optional analytics and advertising execution must remain disabled.
- Attribution values are bounded and structured but remain untrusted marketing data, not identity or authorization evidence.
- Missing attribution remains explicitly unknown rather than being inferred.

## Preserved application boundaries

- The static website remains under `website/` and does not gain database access.
- The authenticated customer application remains under the repository root `src/`.
- Platform control remains under `frontend/platform-admin/`.
- No production form definitions are seeded. A CMS/publishing process must create a published form version.
- No approved legal/privacy copy is invented in this phase.

## Verification evidence

Platform CI run `35986229389` on commit `4a6b431532dfe276712dd49d13aacca75f00fb85` established the Website API baseline before the consent/attribution batch:

- PostgreSQL service initialization: passed.
- Migration `001_create_submission_outbox.sql`: passed.
- PostgreSQL integration tests: passed.
- Website API typecheck, unit tests, and build: passed.
- Public website job: passed.
- Customer/control job: passed.

The initial Website API run `35986040767` failed because Vitest walked up to the repository-root Vite config. Commit `4a6b431532dfe276712dd49d13aacca75f00fb85` added an explicit Website API Vitest configuration; the next run passed. This was a test-runner boundary defect, not a suppressed test.

The implementation environment could not generate a standalone `website-api/package-lock.json` because local npm package resolution timed out. CI can install dependencies, but the lockfile remains an explicit reproducibility gap until generated and reviewed.

The successful baseline CI install reported four moderate-severity npm audit findings. They are not represented as fixed. The current API check is being extended to fail on high/critical production dependency findings while the moderate findings remain review work.

## Not implemented or not verified yet

- CMS/Marketing Studio and form-authoring workflow.
- Form-specific schema/rule publication from the CMS into Website API-owned runtime contracts.
- Approved privacy/legal notices, processing purposes, retention rules, regional behavior, and destination-to-consent policy mapping.
- Public consent-preference UI and secure preference-retrieval session model.
- Analytics destination execution or event ingestion pipeline.
- Delivery worker and queue processing for outbox events.
- CRM, email, and webhook provider adapters.
- Operator delivery-history and retry UI.
- Spam/challenge provider integration and adaptive abuse controls.
- Rate limiting at the edge/API gateway.
- Production secrets, TLS, WAF, CDN, and network policies.
- Production backup/restore, queue recovery, and disaster-recovery exercises.
- Load/performance tests.
- Standalone Website API dependency lockfile.

## Next implementation order

1. Confirm the consent/attribution migration, integration tests, typecheck, build, and high/critical dependency audit are green in CI.
2. Implement CMS/Marketing Studio with versioned pages/forms/media and publishing permissions.
3. Publish form-specific runtime schemas/rules from the CMS into Website API-owned contracts.
4. Implement approved destination-specific consent enforcement once policy configuration is supplied.
5. Implement delivery worker + provider adapters with idempotent retry handling.
6. Add operator-visible delivery status/retry controls and operational alerting.
7. Add production infrastructure, edge controls, recovery tests, and load qualification when deployment requirements are established.
