import { Download, Filter, ShieldCheck } from "lucide-react";
import { Badge, Button, PageHeader } from "../components/Ui";

const events = [
  ["21:36", "AI CMO", "Decision", "Recommended reallocating paid-search budget", "Approval requested", "High"],
  ["21:28", "Revenue Analyst", "Verification", "Validated CRM revenue against campaign identifiers", "Verified", "Low"],
  ["21:14", "Sakshee", "Approval", "Approved GEO landing-page draft package", "Approved", "Medium"],
  ["20:58", "Lifecycle Agent", "Draft", "Created churn-rescue journey for high-value accounts", "Draft only", "Medium"],
  ["20:31", "Policy Engine", "Guardrail", "Blocked publish because legal claim required review", "Blocked safely", "High"],
  ["19:42", "Creative Intelligence", "Learning", "Recorded proof-first creative as a verified pattern", "Memory updated", "Low"]
];

export default function AuditPage() {
  return (
    <>
      <PageHeader
        eyebrow="TRUST, EVIDENCE & ACCOUNTABILITY"
        title="Audit & Decision Receipts"
        description="Every AI observation, recommendation, approval, execution, policy decision and measured outcome is traceable before the backend is connected. The frontend contract is designed around immutable decision receipts."
        actions={<><Button variant="secondary"><Filter size={16} /> Filter</Button><Button variant="secondary"><Download size={16} /> Export</Button></>}
      />

      <section className="module-metrics">
        {[
          ["Auditable actions", "1,248", "+61 this week"],
          ["Policy checks", "4,892", "100% recorded"],
          ["Blocked safely", "18", "No bypasses"],
          ["Receipt coverage", "100%", "Goal → outcome"]
        ].map(([label, value, meta]) => <article className="panel metric-card" key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>)}
      </section>

      <article className="panel table-panel">
        <div className="panel-head"><div><span className="section-kicker">IMMUTABLE ACTIVITY STREAM</span><h2>Workspace audit log</h2></div><Badge tone="success"><ShieldCheck size={13} /> Complete</Badge></div>
        <div className="table-wrap borderless"><table>
          <thead><tr><th>Time</th><th>Actor</th><th>Type</th><th>Action</th><th>Result</th><th>Risk</th></tr></thead>
          <tbody>{events.map(([time, actor, type, action, result, risk]) => <tr key={time + actor}><td>{time}</td><td><strong>{actor}</strong></td><td>{type}</td><td>{action}</td><td><Badge tone={result.includes("Blocked") ? "warning" : result.includes("Approved") || result.includes("Verified") || result.includes("updated") ? "success" : "accent"}>{result}</Badge></td><td><Badge tone={risk === "High" ? "danger" : risk === "Medium" ? "warning" : "neutral"}>{risk}</Badge></td></tr>)}</tbody>
        </table></div>
      </article>

      <section className="content-grid">
        <article className="panel security-overview">
          <div className="panel-head compact"><div><span className="section-kicker">DECISION RECEIPT</span><h2>APR-1042</h2></div><ShieldCheck size={21} /></div>
          {[
            ["Goal", "Increase qualified pipeline without exceeding CAC $420"],
            ["Evidence", "14 connected signals + 3 prior experiments"],
            ["Forecast", "+$62K incremental revenue"],
            ["Policy", "Budget change requires human approval"],
            ["Current state", "Pending approval"]
          ].map(([label, value]) => <div className="guardrail-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </article>
        <article className="panel security-overview">
          <div className="panel-head compact"><div><span className="section-kicker">WHY THIS MATTERS</span><h2>Backend contract</h2></div></div>
          <p>Each future execution API will return a receipt identifier, policy verdict, approval state, evidence references, actor identity, timestamps and outcome-verification state. That prevents hidden autonomous actions.</p>
          <div className="guardrail-row"><span>Execution without receipt</span><strong>Blocked</strong></div>
          <div className="guardrail-row"><span>Material action without approval</span><strong>Blocked</strong></div>
          <div className="guardrail-row"><span>Outcome without evidence</span><strong>Unverified</strong></div>
        </article>
      </section>
    </>
  );
}
