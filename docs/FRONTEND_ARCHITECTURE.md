# GrowthOS frontend architecture

## Product boundary

The customer-facing SaaS is the primary application. Platform Super Admin is a separate control-plane boundary and must not be treated as a customer workspace role in backend authorization.

The operating loop is:

Goal → Observe → Understand → Predict → Decide → Simulate → Approve → Execute → Measure → Learn → Correct → Repeat.

## Approved stack

- React + TypeScript + Vite
- React Router for application routing
- TanStack Query for server state
- Zustand for local application/workspace state
- React Hook Form + Zod for forms and runtime validation
- Tailwind CSS + Radix primitives for the shared design system
- Feature-owned business logic and typed API contracts

## State ownership

Server state belongs in TanStack Query. API records must not be copied into Zustand.

Zustand is reserved for local product state such as the active organization/workspace, navigation UI, command palette state, user UI preferences, and temporary workflow state.

Forms use React Hook Form and Zod. Domain schemas live with the feature that owns them, while cross-cutting SaaS contracts live under shared.

## Feature contract

Each material feature should converge on this structure:

```
features/<feature>/
  api/
  components/
  hooks/
  pages/
  schemas/
  store/       # only when feature-local client state is genuinely needed
  types/
  tests/
```

A React page must not call fetch directly. The path is:

Component → feature hook → TanStack Query → feature API → shared API client → /api/v1.

## Multi-tenant context

Every protected backend request must ultimately resolve:

User → Organization → Workspace → Membership Role → Permission → Plan → Entitlement → Usage limit.

The browser sends organization/workspace context for routing convenience. The backend must independently authorize those identifiers and must never trust client-side permission gates as security enforcement.

## AI execution

AI is a first-class workflow, not a chat widget. Shared execution states are:

queued → researching → reasoning → planning → simulating → waiting_for_approval → approved → executing → verifying → completed → learning.

Material actions must carry an approval reference where policy requires it and an immutable decision receipt after execution.

## Governance contract

A consequential action should be traceable through:

Goal → Evidence → Forecast → Policy verdict → Approval → Execution → Outcome → Verification → Learning.

Frontend types already reserve approval and decision-receipt references so backend governance can be added without redesigning campaign and agent workflows.

## Compatibility rule

Existing pages and CSS remain valid while modules are migrated incrementally. Do not delete working product surfaces merely to satisfy a folder structure. New and materially rewritten code should use the approved feature/shared boundaries.

## Implementation order

1. Foundation
2. Authentication
3. Organization and workspace tenancy
4. SaaS onboarding
5. Integrations
6. AI CMO and Command Center
7. Business World Model
8. Approvals
9. Individual marketing modules
10. Billing and entitlements
11. Production hardening
