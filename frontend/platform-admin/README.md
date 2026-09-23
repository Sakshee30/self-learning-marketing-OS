# GrowthOS Platform Control

This directory is a separate privileged frontend composition for platform operators.

It is intentionally not routed through the customer SaaS application. The control application owns platform desired-state presentation, tenant placement visibility, service health, security posture, change governance and operational evidence.

It must use a separate deployment identity, CSP/session audience and operator authentication when the backend identity/control services are connected.

Local development:

```bash
npm run dev:control
```

Production build:

```bash
npm run build:control
```

The current controls stage reviewed change intents only. Browser UI does not directly mutate Terraform state, shell infrastructure, display plaintext secrets, or claim a production change completed without control-api acknowledgement.
