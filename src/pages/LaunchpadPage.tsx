import { CheckCircle2, Circle, Database, Globe2, ShieldCheck, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, PageHeader } from "../components/Ui";

const connections = [
  ["Website & product analytics", "Connected", "Events, sessions, conversions and product usage"],
  ["CRM & pipeline", "Connected", "Leads, accounts, opportunities and revenue outcomes"],
  ["Google Ads", "Connected", "Campaigns, spend, clicks and conversion signals"],
  ["Meta Ads", "Connected", "Campaigns, creatives, audiences and spend"],
  ["Email & lifecycle", "Ready", "Journeys, engagement, suppression and revenue"],
  ["WhatsApp", "Ready", "Lead conversations, templates and lifecycle actions"]
];

const autonomyRules = [
  ["Research & analysis", "Autonomous", "AI can observe, analyze and recommend without approval."],
  ["Draft content & campaigns", "Autonomous", "AI can create drafts but cannot publish externally."],
  ["Budget or bid changes", "Approval required", "Any material spend change must be approved."],
  ["External publishing", "Approval required", "Publishing ads, pages, social or lifecycle messages requires approval."],
  ["Customer contact", "Approval required", "New outbound customer communication is always governed."],
  ["Irreversible actions", "Blocked", "Deletion, destructive data actions and permanent policy changes are blocked."]
];

export default function LaunchpadPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE LAUNCHPAD"
        title="Connect the business once. Let the AI learn the rest."
        description="This is the production setup surface for the autonomous marketing corporation: connect evidence, define the growth objective, set economic boundaries and decide what the AI may do without human approval."
        actions={<Button onClick={() => navigate("/ai-cmo")}><Sparkles size={16} /> Generate autonomous plan</Button>}
      />

      <section className="module-metrics">
        {[
          ["Setup readiness", "82%", "9 of 11 checks complete"],
          ["Connected systems", "8", "6 live · 2 ready"],
          ["Data confidence", "94%", "Revenue linked"],
          ["Approval coverage", "100%", "Material actions gated"]
        ].map(([label, value, meta]) => (
          <article className="panel metric-card" key={label}>
            <span>{label}</span><strong>{value}</strong><small>{meta}</small>
          </article>
        ))}
      </section>

      <section className="settings-layout">
        <article className="panel settings-card">
          <div className="settings-title"><Target size={19} /><div><h2>1. Growth objective</h2><p>Tell the AI what business outcome it owns.</p></div></div>
          <label>Primary objective<input defaultValue="Grow qualified pipeline while protecting contribution margin" /></label>
          <div className="form-grid">
            <label>Target<input defaultValue="$5M qualified pipeline" /></label>
            <label>Time horizon<select defaultValue="90"><option value="30">30 days</option><option value="90">90 days</option><option value="180">180 days</option></select></label>
            <label>Maximum CAC<input defaultValue="$420" /></label>
            <label>Monthly spend ceiling<input defaultValue="$180,000" /></label>
          </div>
        </article>

        <article className="panel settings-card">
          <div className="settings-title"><Globe2 size={19} /><div><h2>2. Business world model</h2><p>Commercial facts the AI must treat as boundaries.</p></div></div>
          {[
            ["Gross margin", "72%"],
            ["Primary market", "US & India B2B SaaS"],
            ["Sales cycle", "34 days"],
            ["Premium positioning", "Protected"],
            ["Priority segment", "Mid-market teams"]
          ].map(([label, value]) => <div className="setting-row" key={label}><div><strong>{label}</strong><span>Used in planning and simulation</span></div><Badge tone="accent">{value}</Badge></div>)}
        </article>
      </section>

      <article className="panel table-panel">
        <div className="panel-head"><div><span className="section-kicker">EVIDENCE FABRIC</span><h2>3. Connect the operating systems</h2></div><Button variant="secondary" onClick={() => navigate("/data")}><Database size={16} /> Add integration</Button></div>
        <div className="table-wrap borderless"><table>
          <thead><tr><th>System</th><th>Status</th><th>What the AI learns</th><th>Readiness</th></tr></thead>
          <tbody>{connections.map(([name, status, description], index) => <tr key={name}><td><strong>{name}</strong></td><td><Badge tone={status === "Connected" ? "success" : "warning"}>{status}</Badge></td><td>{description}</td><td>{index < 4 ? <CheckCircle2 size={16} /> : <Circle size={16} />}</td></tr>)}</tbody>
        </table></div>
      </article>

      <article className="panel table-panel">
        <div className="panel-head"><div><span className="section-kicker">AUTONOMY GOVERNOR</span><h2>4. Human approval boundaries</h2></div><Badge tone="success"><ShieldCheck size={13} /> Governed</Badge></div>
        <div className="table-wrap borderless"><table>
          <thead><tr><th>Action class</th><th>Mode</th><th>Policy</th></tr></thead>
          <tbody>{autonomyRules.map(([action, mode, policy]) => <tr key={action}><td><strong>{action}</strong></td><td><Badge tone={mode === "Autonomous" ? "success" : mode === "Blocked" ? "danger" : "warning"}>{mode}</Badge></td><td>{policy}</td></tr>)}</tbody>
        </table></div>
      </article>
    </>
  );
}
