import { useState } from "react";
import { Bot, CheckCircle2, GitBranch, Pause, Play, Plus, ShieldCheck, Zap } from "lucide-react";
import { Badge, Button, PageHeader } from "../components/Ui";

const flows = [
  { name: "Paid media waste guard", trigger: "Every 30 min", steps: 8, impact: "$18.4K protected", status: "Active", approval: "Budget changes" },
  { name: "High-intent lead acceleration", trigger: "New qualified lead", steps: 12, impact: "+21% SQL rate", status: "Active", approval: "External message" },
  { name: "Creative fatigue response", trigger: "Frequency > 3.5", steps: 7, impact: "+14% CTR", status: "Active", approval: "Campaign pause" },
  { name: "Churn rescue orchestration", trigger: "Risk score > 0.72", steps: 10, impact: "$43K ARR", status: "Draft", approval: "Offer > 10%" }
];

export default function AutomationsPage() {
  const [running, setRunning] = useState(true);
  return (
    <>
      <PageHeader
        eyebrow="AUTONOMOUS OPERATIONS"
        title="Automation & Agent Workflows"
        description="Turn growth strategy into governed, observable workflows. AI can branch, call specialist agents, wait for data, request approval and verify outcomes."
        actions={<Button><Plus size={16} /> New automation</Button>}
      />

      <div className="automation-banner">
        <div className="automation-banner-icon"><Zap size={22} /></div>
        <div><strong>Autonomy control</strong><p>Production execution is {running ? "enabled within policy guardrails" : "paused across all workflows"}.</p></div>
        <button className={"toggle " + (running ? "on" : "")} onClick={() => setRunning((value) => !value)} aria-label="Toggle autonomy">
          <span />
        </button>
      </div>

      <div className="workflow-overview">
        <article className="panel workflow-canvas">
          <div className="panel-head">
            <div><span className="section-kicker">LIVE WORKFLOW</span><h2>Revenue opportunity recovery</h2></div>
            <Badge tone="success"><Play size={12} /> Running</Badge>
          </div>
          <div className="flow">
            <div className="flow-node"><span className="flow-icon"><Zap size={16} /></span><strong>Signal</strong><small>Pipeline drops 8%</small></div>
            <span className="flow-connector" />
            <div className="flow-node"><span className="flow-icon"><Bot size={16} /></span><strong>AI diagnosis</strong><small>Find root cause</small></div>
            <span className="flow-connector" />
            <div className="flow-node"><span className="flow-icon"><GitBranch size={16} /></span><strong>Decision</strong><small>Select response</small></div>
            <span className="flow-connector" />
            <div className="flow-node highlighted"><span className="flow-icon"><ShieldCheck size={16} /></span><strong>Approval</strong><small>If material</small></div>
            <span className="flow-connector" />
            <div className="flow-node"><span className="flow-icon"><CheckCircle2 size={16} /></span><strong>Verify</strong><small>Measure lift</small></div>
          </div>
          <div className="flow-log">
            <span className="pulse-dot" />
            <div><strong>Latest run is waiting for approval</strong><p>Paid Growth Agent proposes a $6,500 weekly budget reallocation.</p></div>
            <button className="text-link">View run</button>
          </div>
        </article>

        <article className="panel guardrail-panel">
          <span className="section-kicker">EXECUTION POLICY</span>
          <h2>Guardrails</h2>
          {[
            ["Spend", "≤ $2,000/day without approval"],
            ["Messaging", "Brand-safe claims only"],
            ["Customer contact", "Consent required"],
            ["Production changes", "Rollback required"],
            ["High-risk actions", "Always human-approved"]
          ].map(([label, value]) => (
            <div className="guardrail-row" key={label}><span>{label}</span><strong>{value}</strong></div>
          ))}
          <Button variant="secondary"><ShieldCheck size={16} /> Open policy center</Button>
        </article>
      </div>

      <section>
        <div className="section-heading-row"><div><span className="section-kicker">WORKFLOW LIBRARY</span><h2>Active automations</h2></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Automation</th><th>Trigger</th><th>Steps</th><th>Human gate</th><th>Outcome</th><th>Status</th></tr></thead>
            <tbody>
              {flows.map((flow) => (
                <tr key={flow.name}>
                  <td><strong>{flow.name}</strong></td><td>{flow.trigger}</td><td>{flow.steps}</td><td>{flow.approval}</td><td>{flow.impact}</td>
                  <td><Badge tone={flow.status === "Active" ? "success" : "neutral"}>{flow.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
