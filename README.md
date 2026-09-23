# Self-Learning Marketing OS

AI-native autonomous growth operating system for planning, executing, measuring, learning, and continuously improving marketing with human approval for consequential actions.

## Frontend-first implementation

This repository starts with a production-oriented React + TypeScript frontend. The UI is deliberately API-ready so the backend can be attached without redesigning the application.

### Core operating loop

**Goal → Decide → Execute → Measure → Learn → Correct**

### Main product areas

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

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Demo roles

The frontend includes a role switcher so permission-aware experiences can be reviewed before backend identity is connected:

- Super Admin
- Workspace Owner
- Workspace Admin
- Marketing Manager
- Analyst
- Approver
- Viewer

## Production posture

The current milestone is frontend-only. Actions are represented by typed mock services and approval-aware UI states; no production marketing changes are executed from the browser until backend policy, authentication, audit, and execution services are connected.
