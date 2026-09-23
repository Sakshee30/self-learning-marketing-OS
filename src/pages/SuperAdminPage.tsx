import { Building2, CircleDollarSign, CloudCog, ShieldCheck, Users, Waypoints } from "lucide-react";
import { Badge, Button, PageHeader } from "../components/Ui";

const tenants = [
  ["Northstar Labs", "Enterprise", "48", "$8,400", "Healthy"],
  ["Acme Commerce", "Growth", "17", "$3,200", "Healthy"],
  ["Vertex Learning", "Growth", "25", "$4,650", "Review"],
  ["Atlas Mobility", "Enterprise", "72", "$12,900", "Healthy"]
];

export default function SuperAdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="SAAS CONTROL PLANE"
        title="Super Admin"
        description="Platform-wide tenant operations, usage, commercial controls, feature policy, security posture and service health."
        actions={<Button variant="secondary"><CloudCog size={16} /> Platform settings</Button>}
      />

      <section className="super-kpis">
        {[
          ["Active workspaces", "184", "+12 this month", Building2],
          ["Monthly recurring revenue", "$412K", "+9.6%", CircleDollarSign],
          ["Active users", "3,842", "+18.2%", Users],
          ["Agent actions / day", "1.48M", "99.94% verified", Waypoints]
        ].map(([label, value, meta, Icon]) => {
          const MetricIcon = Icon as typeof Building2;
          return (
            <article className="panel super-kpi" key={String(label)}>
              <span className="metric-icon"><MetricIcon size={19} /></span>
              <span>{label as string}</span><strong>{value as string}</strong><small>{meta as string}</small>
            </article>
          );
        })}
      </section>

      <section className="content-grid">
        <article className="panel platform-health">
          <div className="panel-head"><div><span className="section-kicker">PLATFORM HEALTH</span><h2>Production services</h2></div><Badge tone="success">All systems operational</Badge></div>
          {[
            ["Identity & RBAC", "99.99%", "Healthy"],
            ["Agent orchestration", "99.97%", "Healthy"],
            ["Event ingestion", "99.95%", "Healthy"],
            ["Attribution engine", "99.91%", "Healthy"],
            ["Approval service", "100%", "Healthy"],
            ["Model gateway", "99.89%", "Healthy"]
          ].map(([service, uptime, status]) => (
            <div className="service-row" key={service}><div><span className="service-dot" /><strong>{service}</strong></div><span>{uptime}</span><Badge tone="success">{status}</Badge></div>
          ))}
        </article>

        <article className="panel security-overview">
          <div className="panel-head compact"><div><span className="section-kicker">SECURITY</span><h2>Control posture</h2></div><ShieldCheck size={21} /></div>
          <div className="security-score"><strong>96</strong><span>/100</span><p>Platform security score</p></div>
          {[
            ["MFA coverage", "98%"],
            ["SSO workspaces", "74%"],
            ["High-risk alerts", "0 open"],
            ["Secrets exposure", "0 detected"]
          ].map(([label, value]) => <div className="guardrail-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </article>
      </section>

      <article className="panel table-panel">
        <div className="panel-head"><div><span className="section-kicker">TENANTS</span><h2>Workspace operations</h2></div><Button variant="secondary">Export usage</Button></div>
        <div className="table-wrap borderless">
          <table>
            <thead><tr><th>Workspace</th><th>Plan</th><th>Seats</th><th>MRR</th><th>Health</th></tr></thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant[0]}><td><strong>{tenant[0]}</strong></td><td>{tenant[1]}</td><td>{tenant[2]}</td><td>{tenant[3]}</td><td><Badge tone={tenant[4] === "Healthy" ? "success" : "warning"}>{tenant[4]}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
