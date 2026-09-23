import { BellRing, Globe2, KeyRound, Save, SlidersHorizontal } from "lucide-react";
import { Badge, Button, PageHeader } from "../components/Ui";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE"
        title="Workspace Settings"
        description="Control identity, environment defaults, notifications and workspace-wide operating preferences. Security-critical enforcement will live on the backend."
        actions={<Button><Save size={16} /> Save settings</Button>}
      />

      <div className="settings-layout">
        <article className="panel settings-card">
          <div className="settings-title"><Globe2 size={18} /><div><h2>Workspace profile</h2><p>Name, region, currency and reporting timezone.</p></div></div>
          <label>Workspace name<input defaultValue="Northstar Labs" /></label>
          <div className="form-grid">
            <label>Primary region<select defaultValue="ap-south-1"><option value="ap-south-1">India — Mumbai</option><option value="us-east-1">United States — Virginia</option><option value="eu-west-1">Europe — Ireland</option></select></label>
            <label>Currency<select defaultValue="USD"><option>USD</option><option>INR</option><option>EUR</option><option>GBP</option></select></label>
          </div>
        </article>

        <article className="panel settings-card">
          <div className="settings-title"><SlidersHorizontal size={18} /><div><h2>Autonomy defaults</h2><p>Default posture for newly created agents and workflows.</p></div></div>
          <div className="setting-row"><div><strong>Draft automatically</strong><span>Agents may prepare content, plans and changes.</span></div><span className="mini-switch on"><i /></span></div>
          <div className="setting-row"><div><strong>Require approval for external actions</strong><span>Publishing, spend and customer contact remain gated.</span></div><span className="mini-switch on"><i /></span></div>
          <div className="setting-row"><div><strong>Require rollback support</strong><span>Production actions need a reversible execution plan.</span></div><span className="mini-switch on"><i /></span></div>
        </article>

        <article className="panel settings-card">
          <div className="settings-title"><BellRing size={18} /><div><h2>Notifications</h2><p>Where operational and approval alerts should appear.</p></div></div>
          <div className="setting-row"><div><strong>Approval requests</strong><span>In-app and email</span></div><Badge tone="success">Enabled</Badge></div>
          <div className="setting-row"><div><strong>Material KPI changes</strong><span>In-app digest</span></div><Badge tone="success">Enabled</Badge></div>
          <div className="setting-row"><div><strong>Agent incidents</strong><span>Immediate escalation</span></div><Badge tone="warning">Critical only</Badge></div>
        </article>

        <article className="panel settings-card">
          <div className="settings-title"><KeyRound size={18} /><div><h2>Identity & access</h2><p>SSO, MFA and session policy preview for the backend identity service.</p></div></div>
          <div className="setting-row"><div><strong>Multi-factor authentication</strong><span>Required for owners, admins and approvers.</span></div><Badge tone="success">Required</Badge></div>
          <div className="setting-row"><div><strong>Single sign-on</strong><span>SAML / OIDC enterprise configuration.</span></div><Badge tone="neutral">Configure</Badge></div>
          <div className="setting-row"><div><strong>Session timeout</strong><span>12 hours, re-auth for sensitive actions.</span></div><Badge tone="accent">Policy</Badge></div>
        </article>
      </div>
    </>
  );
}
