# GrowthOS Autonomous Marketing Product Frontend Contract

## Purpose

This document binds the customer-facing GrowthOS product blueprint to the adopted SaaS frontend architecture standard.

GrowthOS is a Self-Learning Marketing OS / Autonomous Marketing Corporation. The human defines the business outcome and operating constraints. The platform observes evidence, understands the business, predicts outcomes, decides among strategies, simulates consequential changes, requests human approval when policy requires it, executes approved work through connected systems, measures verified outcomes, learns and corrects.

The canonical operating loop is:

**Goal → Observe → Understand → Predict → Decide → Simulate → Approve → Execute → Measure → Learn → Correct → Repeat**

Frontend screens must never present a forecast, accepted job, staged draft or timed-out mutation as confirmed execution.

## Customer journey

1. Sign up, sign in or accept invitation.
2. Resolve organization and workspace membership.
3. Resume or complete workspace onboarding.
4. Connect business evidence sources.
5. Define commercial facts and constraints.
6. Define the primary growth goal.
7. Configure AI autonomy and human approval boundaries.
8. Initialize and continuously update the Business World Model.
9. Enter the AI Command Center.
10. Let the AI CMO rank opportunities and strategies.
11. Simulate material strategies in the Growth Digital Twin.
12. Request human approval when policy requires it.
13. Execute through specialist agents and connected systems.
14. Measure verified revenue, profit and customer outcomes.
15. Write evidence-backed learning to memory.
16. Correct the World Model, strategy and next execution cycle.

## Product surfaces

### Start and command
- Workspace Launchpad
- AI Command Center
- AI CMO

### Understand and decide
- Business World Model
- Growth Opportunities
- Customers & Audiences
- Market Intelligence
- Revenue Intelligence

### Execute
- Campaigns
- Creative Studio
- SEO / GEO / AEO
- Social & Creator Growth
- Lifecycle / CRM
- Website Experience & CRO
- Automations
- AI Agents

### Learn
- Experiments
- Marketing Memory
- Decision Memory
- Growth Digital Twin

### Govern and operate
- Human Approval Center
- Governance
- Audit & Decision Receipts
- Data & Integrations
- Team & Roles
- Billing & Usage
- Workspace Settings

The privileged platform control application is a separate application composition. It is not a customer workspace route.

## Autonomy policy

The frontend communicates four distinct execution postures.

### Autonomous
- Research and evidence collection
- Opportunity detection
- Market analysis
- Customer analysis
- Forecasting
- Strategy drafting
- Campaign drafting
- Creative drafting
- Simulation when it creates no external side effect

### Human approval required
- Material budget changes
- Bid or spend changes
- External publishing
- New customer communication
- Production-impacting changes
- Actions outside a configured pre-approved envelope

### Blocked or highly governed
- Destructive data operations
- Irreversible actions
- Policy bypass
- Execution without an authorized identity or required decision receipt

### Backend authority

The frontend may explain policy and hide or disable unavailable actions. Backend authorization and policy evaluation remain authoritative.

## AI execution lifecycle

All autonomous work converges on a shared lifecycle:

1. queued
2. researching
3. reasoning
4. planning
5. simulating
6. waiting_for_approval
7. approved
8. executing
9. verifying
10. completed
11. learning

Failure, cancellation, rejection, conflict and unknown-outcome states remain distinct.

## Decision receipt contract

Every consequential execution is expected to produce a durable receipt linking:

- goal
- actor
- AI agent
- proposed action
- evidence references
- forecast
- confidence
- policy verdict
- risk classification
- approval identity and state
- execution identity
- timestamps
- external/provider confirmation
- actual outcome
- verification state
- learning written back to memory

A frontend success presentation must not be shown merely because a button was clicked or a network request was accepted.

## Frontend architectural rules

### Routing
Each customer route owns or declares:
- stable route ID
- canonical path
- page title
- breadcrumb
- authentication requirement
- workspace requirement
- capability
- permission
- unsaved-work policy
- lazy implementation where material
- loading and error behavior

Navigation derives from canonical route metadata rather than duplicating the route catalog.

### State
- TanStack Query owns remote/server state.
- Zustand owns small browser-only workflow and workspace state.
- React Hook Form owns form state.
- Zod owns runtime input validation and typed frontend contracts.
- Remote entities are not duplicated into global browser stores.

### Networking
UI component → feature hook → TanStack Query → feature API → shared typed client → backend API.

Product pages do not call provider SDKs directly.

### Forms and writes
Meaningful mutations distinguish:
- idle
- validating
- submitting
- confirmed success
- confirmed rejection
- conflict
- outcome unknown

Critical writes will use operation identity and backend idempotency. Optimistic presentation is limited to reversible low-risk interactions.

### Workspace isolation
No old workspace data may be displayed as if it belongs to the newly selected workspace. Reads, subscriptions and mutations must remain scoped to the authenticated session, organization and workspace.

### Accessibility
WCAG 2.2 AA is the product target. Complete workflows require keyboard access, visible focus, labels, associated errors, reflow, contrast, meaningful route focus, screen-reader announcements and non-drag alternatives where drag-and-drop exists.

## Typography

Typography is semantic rather than page-specific.

- Display: exceptional hero/marketing moments only.
- Page title: primary page heading.
- Section title: major product grouping.
- Body: ordinary explanatory product text.
- Caption: metadata and secondary context.
- Overline: short categorical labels only.
- Metric numbers use tabular lining numerals.
- Long explanatory copy should remain within a readable measure.
- Very small text must not be used to hide important policy, risk, status or error information.

Product features consume design-system typography tokens/classes rather than creating arbitrary font sizes.

## Performance and release posture

- Feature-heavy pages stay lazy-loaded.
- Charts, editors, large tables, AI visualizations and other heavy dependencies should not enter the initial route unless needed.
- Customer shell failures are isolated from noncritical widgets.
- Existing working routes migrate incrementally; code is not duplicated merely to match a target folder diagram.
- Frontend completion is supported by CI/typecheck/build evidence, not by screenshots or folders alone.

## Current frontend-first boundary

The present product is frontend-first. Preview data and simulated UI states exist to finalize product workflows and typed backend contracts. They must be labeled honestly.

The backend phase will replace preview adapters with authoritative identity, tenancy, persistence, integrations, model execution, approvals, receipts and external execution while preserving these frontend contracts.
