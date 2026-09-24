# GrowthOS Website API Implementation Coverage Ledger

Updated: 24 September 2026

This ledger covers the independently deployable public Website API in `website-api/`. It does not claim that CMS/Marketing Studio, delivery workers, CRM/email providers, consent management, analytics, or infrastructure deployment are complete.

## Implemented scope

- NestJS application using the Fastify adapter.
- `GET /health` service health endpoint.
- `POST /v1/forms/:formId/submissions` durable acceptance endpoint.
- Bounded request body size and server-side request-shape validation.
- Published form-version lookup from PostgreSQL.
- Transactional insertion of the submission and `website.submission.accepted.v1` outbox event.
- Optional idempotency keys with deterministic request fingerprints, replay behavior, and conflict detection.
- Explicit invalid-input, unpublished-form, idempotency-conflict, and persistence-unavailable responses.
- Versioned SQL migration runner guarded by a PostgreSQL advisory lock.
- OpenAPI description of the implemented public contract.
- Unit tests for validation/idempotency/fingerprinting.
- PostgreSQL integration tests for submission + outbox atomic acceptance, replay, and conflict behavior.
- CI PostgreSQL service that applies migrations before running integration tests.

## Acceptance semantics

A `202` response means the Website API committed the submission record and its outbox event in the same database transaction. It does not mean CRM, email, webhook, qualification, opportunity creation, or any other downstream operation succeeded.

If PostgreSQL cannot durably accept the operation, the API returns an explicit unavailable response rather than manufacturing success.

## Preserved boundaries

- The static website remains under `website/` and does not gain database access.
- The authenticated customer application remains under the repository root `src/`.
- Platform control remains under `frontend/platform-admin/`.
- No production form definitions are seeded. A CMS/publishing process must create a published form version.
- No legal or consent policy is invented in this phase.

## Not implemented or not verified yet

- CMS/Marketing Studio and form-authoring workflow.
- Form-specific schema/rule publication from the CMS into Website API-owned runtime contracts.
- Consent records, withdrawal, retention, and destination enforcement.
- Delivery worker and queue processing for outbox events.
- CRM, email, and webhook provider adapters.
- Operator delivery-history and retry UI.
- Spam/challenge provider integration and adaptive abuse controls.
- Rate limiting at the edge/API gateway.
- Production secrets, TLS, WAF, CDN, and network policies.
- Production backup/restore, queue recovery, and disaster-recovery exercises.
- Load/performance tests.
- Standalone dependency lockfile if package installation cannot generate one in the implementation environment.

## Next implementation order

1. Confirm Website API CI is green, including PostgreSQL migration and integration tests.
2. Implement consent + attribution contracts without inventing legal policy.
3. Implement CMS/Marketing Studio with versioned pages/forms/media and publishing permissions.
4. Implement delivery worker + provider adapters with idempotent retry handling.
5. Add operator-visible delivery status/retry controls and operational alerting.
6. Add production infrastructure, edge controls, recovery tests, and load qualification when deployment requirements are established.
