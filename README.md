# Self-Learning Marketing OS

AI-native autonomous growth operating system for planning, executing, measuring, learning, and continuously improving marketing with human approval for consequential actions.

## Application boundaries

The repository now keeps the principal delivery surfaces separate:

- Root `src/` — authenticated customer SaaS frontend.
- `frontend/platform-admin/` — privileged platform control frontend.
- `website/` — independently deployable public marketing website.
- `website-api/` — public runtime API for durable website submissions and future website-owned operations.

The public website does not connect directly to PostgreSQL, CRM, email, or customer-app internals. Dynamic public operations cross the Website API boundary.

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

## Website API development

```bash
cd website-api
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

The API does not seed a fake published form. A CMS/publishing process must create the published form version before public submissions are accepted.

## Production posture

The customer product remains frontend-first. The public website is a static publishing boundary, while the Website API now has a real PostgreSQL transaction boundary for durable submission + outbox acceptance. CMS authoring, consent policy, delivery workers, external provider execution, production infrastructure, and complete security/accessibility qualification remain separate implementation phases and are not represented as completed.
