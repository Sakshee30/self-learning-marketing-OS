# GrowthOS Frontend Implementation Coverage Ledger

Updated: 24 September 2026

This ledger records the customer-frontend scope inspected and changed during the frontend-first implementation. It is not a claim that backend, infrastructure, security qualification, load testing, disaster recovery, or external-provider execution is complete.

## Product contract

GrowthOS implements the customer journey and autonomous operating loop:

Goal → Observe → Understand → Predict → Decide → Simulate → Approve → Execute → Measure → Learn → Correct → Repeat.

Human authority remains explicit for material spend, bids, external publishing, new customer communication, production-impacting changes and irreversible/destructive operations.

## Inspected and actively maintained customer surfaces

| Surface | Canonical implementation | Current frontend state | Backend dependency |
| --- | --- | --- | --- |
| Authentication | `src/features/auth/`, `src/pages/AuthPage.tsx` | Sign-in, sign-up, reset and preview session boundary | Authoritative identity, MFA, SSO, token/session lifecycle |
| Workspace bootstrap | `src/app/bootstrap/`, `src/features/workspace/` | Explicit workspace readiness and scoped query lifecycle | Membership and entitlement bootstrap |
| Onboarding | `src/features/onboarding/` | Resumable session-scoped preview drafts | Durable onboarding completion and eligibility |
| Launchpad | `src/pages/LaunchpadPage.tsx` | Business objective, readiness, autonomy and integration entry points | Authoritative setup state |
| AI Command Center | `src/pages/CommandCenter.tsx` | KPIs, recommendations, approval and agent entry points | Live server/query data |
| AI CMO | `src/features/ai-cmo/` | Goal builder, evidence, strategy ranking and governed simulation handoff | Model execution, policy, durable decision records |
| Business World Model | `src/features/world-model/` | Dedicated editable product surface | Durable model facts, assumptions and evidence |
| Opportunities | `src/features/opportunities/` | Ranked opportunities and honest research-preview state | Research execution and authoritative ranking |
| Revenue Intelligence | `src/features/revenue/` | Dedicated revenue/attribution surface | Revenue, attribution and incrementality services |
| Customers & Audiences | `src/features/customers/` | Dedicated first-party customer intelligence surface | Identity graph, enrichment and activation APIs |
| Market Intelligence | `src/features/market/` | Dedicated competitor/category intelligence surface | Market evidence ingestion and research jobs |
| Campaigns | `src/features/campaigns/` | Builder, simulation, approval posture and protected drafts | Campaign persistence, provider activation and receipts |
| Creative Studio | `src/features/creative/` | Dedicated concept/variant workflow surface | Asset persistence, generation and publish providers |
| SEO / GEO | `src/features/organic/` | Dedicated organic/answer-engine workspace | Crawl/search/content services |
| Social & Creator | `src/features/social/` | Dedicated social operating surface | Social publishing/listening providers |
| Lifecycle / CRM | `src/features/lifecycle/` | Dedicated lifecycle workspace | CRM, email, messaging and journey execution |
| Website / CRO | `src/features/experiences/` | Dedicated experience/CRO workspace | Deployment and experimentation providers |
| Experiments | `src/features/experiments/` | Experiment creation/causal-learning surface | Assignment, exposure and outcome services |
| Automations | `src/features/automations/` | Governed automation/agent workflow surface | Durable orchestration and job execution |
| AI Agents | `src/features/agents/` | Roster/capability/health surface | Model/tool execution and run history |
| Human Approval Center | `src/features/approvals/` | Evidence review plus explicit approval-intent lifecycle | Authoritative approval command and reconciliation |
| Marketing Memory | `src/features/memory/` | Dedicated decision/learning surface | Durable memory and evidence store |
| Growth Digital Twin | `src/features/digital-twin/` | Scenario controls, evidence-weighted simulation and approval handoff | Forecast service and versioned simulations |
| Data & Integrations | `src/features/integrations/` | Connection/setup surface | OAuth, webhooks, sync and provider health |
| Governance | `src/features/governance/` | Policy/autonomy surface | Authoritative policy engine and revocation |
| Audit & Decision Receipts | `src/features/audit/` | Receipt/evidence preview with confirmed-vs-preview distinction | Durable immutable audit/receipt service |
| Team & Roles | `src/features/team/` | Tenant-scoped roles/team surface | Authoritative membership/RBAC |
| Billing & Usage | `src/features/billing/` | Plan/usage surface | Billing provider and usage ledger |
| Workspace Settings | `src/features/settings/` | Workspace configuration surface | Durable settings and sensitive re-auth |
| Platform Control | `frontend/platform-admin/` | Separate build/trust boundary | Control API and operational evidence |

## Cross-feature governed execution

Canonical frontend composition:

`src/compositions/governed-execution/`

Current flow:

AI CMO proposal
→ Digital Twin simulation
→ Human Approval Center
→ approval intent
→ Audit receipt preview

The frontend deliberately stops before claiming authoritative execution. A simulation, staged intent, accepted request, unknown outcome and completed operation are separate states.

## Frontend architecture controls implemented

- React + TypeScript + Vite customer SPA.
- Separate platform-control Vite composition.
- TanStack Query server-state boundary.
- Zustand for small browser-only state.
- React Hook Form + Zod for feature-owned form validation.
- Owned Tailwind/Radix-based design system.
- Semantic typography tokens and numeric typography.
- Canonical route registry and navigation projection.
- Route title/focus/screen-reader lifecycle.
- Session, organization, workspace and scope-generation query isolation.
- Transport cancellation and request deadlines.
- Structured problem-details errors.
- Operation IDs and idempotency-ready mutation contracts.
- Explicit mutation states: validating, submitting, confirmed success/rejection, conflict and unknown outcome.
- Dirty-work protection for route changes, workspace switches, sign-out and tab close.
- Resumable onboarding preview drafts.
- Lazy customer feature routes.
- Customer/platform-control architecture checks.
- Customer and control production bundle budget checks.

## Compatibility paths

Legacy customer page entry files for approvals, audit, automations, settings and team now re-export the canonical feature implementation. This keeps import compatibility without maintaining duplicate business/UI implementations.

`src/pages/SuperAdminPage.tsx` is now only a non-privileged compatibility notice. The real platform-control implementation lives under `frontend/platform-admin/`.

## Not verified / not complete

The following remain outside current frontend-only evidence:

- Authoritative backend authentication and authorization.
- Durable tenant data and drafts.
- Real OAuth/provider integrations.
- Real AI/model execution.
- Durable approvals, execution and decision receipts.
- Realtime server subscriptions at production scale.
- Browser accessibility testing with assistive technology.
- Playwright end-to-end tests.
- Field Core Web Vitals.
- Penetration/security qualification.
- 700,000-user / 50,000-RPS capacity qualification.
- Disaster-recovery and restore evidence.
- GitHub Pages repository-level enablement.

These items must not be inferred from screenshots, preview data, successful TypeScript compilation or production frontend builds.
