# Self-Learning Marketing OS

AI-native autonomous growth operating system for planning, executing, measuring, learning, and continuously improving marketing with human approval for consequential actions.

## Application boundaries

The repository keeps the principal delivery surfaces separate:

- Root `src/` — authenticated customer SaaS frontend.
- `frontend/platform-admin/` — privileged platform control frontend.
- `website/` — independently deployable public marketing website.
- `cms-studio/` — authenticated CMS and Marketing Studio for governed public content.
- `website-api/` — public runtime API for durable website submissions, consent records, attribution capture, and future website-owned operations.

The public website does not connect directly to PostgreSQL, CRM, email, or customer-app internals. Dynamic public operations cross the Website API boundary. Editorial content is authored through the CMS boundary and will be promoted to the public site through a later release pipeline rather than making ordinary visitors depend on the CMS database.

## Core operating loop

**Goal → Observe → Understand → Predict → Decide → Simulate → Approve → Execute → Measure → Learn → Correct → Repeat**

## Main product areas

- AI Command Center / AI CMO
- Business World Model
- Growth Opportunities
- Revenue Intelligence
- Customers & Audiences
- Market Intelligence
- Campaigns
- Creative Studio
- SEO / GEO / Organic
- Social
- Lifecycle
- Experience / CRO
- Experiments
- AI Agents
- Human Approvals
- Memory & Decisions
- Digital Twin
- Data & Integrations
- Governance
- Workspace Administration
- Team / Roles / Permissions
- Billing
- SaaS Super Admin

## Customer frontend development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Public website development

```bash
cd website
npm install
npm run dev
```

## CMS & Marketing Studio development

Use Node 24.15 or newer.

```bash
cd cms-studio
cp .env.example .env
npm install
npm run dev
```

## Website API development

```bash
cd website-api
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

The Website API does not seed fake production forms. The CMS/publishing bridge that exports approved form versions into the Website API runtime contract is a separate implementation phase.

## Production posture

The customer product remains frontend-first. The public website is a static publishing boundary. The Website API has PostgreSQL transaction boundaries for durable submission/outbox and consent/outbox acceptance, with explicit attribution contracts. CMS Studio now has a governed content-authoring foundation with controlled blocks, roles, versioned drafts, form definitions, media rights metadata, and publish guards.

Coordinated public releases, preview isolation, media scanning/object storage, the CMS-to-Website-API form publication bridge, delivery workers, external provider execution, production infrastructure, and complete security/accessibility/recovery qualification remain separate implementation phases and are not represented as completed.
