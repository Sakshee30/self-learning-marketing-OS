import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  Database,
  FileText,
  Lightbulb,
  Link2,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Badge, Button, PageHeader } from "../components/Ui";

type ModuleConfig = {
  eyebrow: string;
  title: string;
  description: string;
  primary: string;
  metricA: [string, string, string];
  metricB: [string, string, string];
  metricC: [string, string, string];
  insightTitle: string;
  insightText: string;
  rows: string[][];
};

const modules: Record<string, ModuleConfig> = {
  "/world-model": {
    eyebrow: "BUSINESS INTELLIGENCE",
    title: "Business World Model",
    description: "A continuously updated model of your business, customers, market, economics, products, channels, constraints and growth levers.",
    primary: "Refresh business model",
    metricA: ["Model confidence", "92%", "+3.2%"],
    metricB: ["Connected signals", "148", "+12"],
    metricC: ["Active assumptions", "31", "6 challenged"],
    insightTitle: "Your highest-leverage constraint is activation, not traffic",
    insightText: "Demand is sufficient for the current target. Improving visitor-to-qualified-lead conversion has 2.4× the modeled profit impact of adding paid traffic.",
    rows: [["Demand model", "Fresh", "94%", "2m ago"], ["Customer economics", "Fresh", "91%", "18m ago"], ["Competitive landscape", "Learning", "86%", "1h ago"], ["Capacity constraints", "Fresh", "93%", "24m ago"]]
  },
  "/opportunities": {
    eyebrow: "AI OPPORTUNITY ENGINE",
    title: "Growth Opportunities",
    description: "The system ranks opportunities by expected incremental profit, confidence, effort, risk, reversibility and time-to-impact.",
    primary: "Find new opportunities",
    metricA: ["Open opportunity value", "$486K", "+$74K"],
    metricB: ["High-confidence", "12", "+3"],
    metricC: ["In execution", "7", "4 automated"],
    insightTitle: "Recover non-brand search demand now",
    insightText: "A conversion-quality shift created headroom to scale three intent clusters while remaining inside the CAC guardrail.",
    rows: [["Search intent expansion", "$62K", "88%", "Approval"], ["GEO landing-page cluster", "$47K", "84%", "Drafting"], ["Lifecycle expansion", "$39K", "91%", "Running"], ["Pricing-page CRO", "$31K", "79%", "Experiment"]]
  },
  "/revenue": {
    eyebrow: "REVENUE INTELLIGENCE",
    title: "Money & Measurement",
    description: "Unify acquisition cost, pipeline, revenue, margin, LTV, attribution and incrementality so marketing optimizes for business outcomes, not vanity metrics.",
    primary: "Open measurement plan",
    metricA: ["Tracked revenue", "$2.46M", "94% confidence"],
    metricB: ["Incremental revenue", "$1.12M", "+14.2%"],
    metricC: ["Blended CAC", "$184", "-8.4%"],
    insightTitle: "Paid social is assisting more revenue than last-click shows",
    insightText: "Journey stitching and holdout evidence indicate Meta creates upstream demand that later converts through search and direct traffic.",
    rows: [["Google Ads", "$482K", "4.9×", "High"], ["Meta", "$318K", "3.6×", "High"], ["Organic", "$404K", "9.8×", "Medium"], ["Lifecycle", "$219K", "12.1×", "High"]]
  },
  "/customers": {
    eyebrow: "CUSTOMER INTELLIGENCE",
    title: "Customers & Audiences",
    description: "A first-party customer graph with identity resolution, enrichment, lifecycle state, intent, predicted value and activation-ready audiences.",
    primary: "Build audience",
    metricA: ["Unified profiles", "184K", "+6.4K"],
    metricB: ["Identity match rate", "91.8%", "+1.7%"],
    metricC: ["High intent now", "8,421", "+11%"],
    insightTitle: "A new high-value segment is emerging",
    insightText: "Teams with 20–50 employees that use analytics integrations have 1.8× LTV and 23% faster sales cycles.",
    rows: [["High-intent buyers", "8,421", "93%", "Synced"], ["Expansion-ready", "2,104", "88%", "Synced"], ["Churn risk", "841", "90%", "Active"], ["Anonymous warm visitors", "14,482", "76%", "Learning"]]
  },
  "/market": {
    eyebrow: "MARKET INTELLIGENCE",
    title: "Market & Competitor Intelligence",
    description: "Track category demand, competitor moves, offers, creative patterns, positioning, pricing, content gaps and emerging customer language.",
    primary: "Add competitor",
    metricA: ["Competitors tracked", "24", "+2"],
    metricB: ["Market signals / week", "1,482", "+18%"],
    metricC: ["Strategic changes", "7", "3 urgent"],
    insightTitle: "Competitors are converging on automation; proof is the whitespace",
    insightText: "Category messaging increasingly claims AI automation. Fewer competitors demonstrate verified revenue impact, reversibility and human governance.",
    rows: [["Category pricing shift", "High", "6 companies", "Today"], ["New AI positioning", "Medium", "9 companies", "2h ago"], ["Search share change", "Medium", "+4.2 pts", "Today"], ["Offer pattern", "Low", "Annual discounting", "Yesterday"]]
  },
  "/campaigns": {
    eyebrow: "CROSS-CHANNEL EXECUTION",
    title: "Campaigns",
    description: "Plan, launch and optimize coordinated paid, owned and lifecycle campaigns from one goal, budget and measurement contract.",
    primary: "Create campaign",
    metricA: ["Active campaigns", "38", "12 AI-managed"],
    metricB: ["Spend this month", "$248K", "71% pacing"],
    metricC: ["Pipeline influenced", "$1.9M", "+16.4%"],
    insightTitle: "Budget can move toward higher-quality demand",
    insightText: "Three paid programs have statistically stable quality differences. A guarded reallocation is ready for approval.",
    rows: [["Q4 Pipeline Engine", "$82K", "5.2×", "Healthy"], ["Enterprise ABM", "$46K", "7.1×", "Healthy"], ["Creator Launch", "$28K", "3.4×", "Learning"], ["Retargeting Always-on", "$31K", "6.4×", "Healthy"]]
  },
  "/creative": {
    eyebrow: "CREATIVE INTELLIGENCE",
    title: "Creative Studio",
    description: "Turn audience truth and performance evidence into concepts, copy, variants, design briefs and governed production workflows.",
    primary: "Generate concept",
    metricA: ["Active variants", "126", "+18"],
    metricB: ["Winning messages", "14", "+3"],
    metricC: ["Fatigued assets", "7", "-4"],
    insightTitle: "Outcome proof is outperforming feature-led creative",
    insightText: "Messages that quantify saved time and revenue efficiency are converting 31% better among high-intent operations buyers.",
    rows: [["Revenue proof v4", "Winner", "+31%", "Scale"], ["Before/after workflow", "Winner", "+24%", "Scale"], ["AI team replacement", "Learning", "+8%", "Test"], ["Feature montage", "Fatigued", "-19%", "Pause"]]
  },
  "/organic": {
    eyebrow: "SEARCH + ANSWER ENGINE OPTIMIZATION",
    title: "SEO & GEO",
    description: "Technical SEO, content intelligence, answer-engine visibility, entity coverage, internal linking and conversion-aware organic growth.",
    primary: "Create content plan",
    metricA: ["Organic pipeline", "$404K", "+13.1%"],
    metricB: ["Answer visibility", "38%", "+6.4 pts"],
    metricC: ["Priority issues", "17", "-11"],
    insightTitle: "Commercial comparison pages have the fastest path to answer visibility",
    insightText: "The model found 14 high-intent queries where your authority is sufficient but page structure lacks direct evidence-led answers.",
    rows: [["Technical health", "94", "+3", "Healthy"], ["Entity coverage", "82%", "+5%", "Improving"], ["Commercial pages", "31", "14 opportunities", "Action"], ["Content decay", "8 pages", "-4", "Improving"]]
  },
  "/social": {
    eyebrow: "SOCIAL OPERATING SYSTEM",
    title: "Social & Creator Growth",
    description: "Plan, create, approve, publish and learn across brand social, executive channels and creator programs with one evidence loop.",
    primary: "Plan social cycle",
    metricA: ["Qualified engagement", "18.4K", "+22%"],
    metricB: ["Creator revenue", "$84K", "+18%"],
    metricC: ["Content velocity", "42/wk", "+7"],
    insightTitle: "Customer-operator content is creating the strongest buying intent",
    insightText: "Posts built around operational pain points are generating 2.1× more qualified site visits than product-announcement content.",
    rows: [["LinkedIn", "12.1K", "+26%", "Strong"], ["YouTube", "4.2K", "+18%", "Strong"], ["Instagram", "1.8K", "+11%", "Learning"], ["Creators", "$84K", "+18%", "Strong"]]
  },
  "/lifecycle": {
    eyebrow: "CUSTOMER LIFECYCLE",
    title: "Lifecycle & CRM",
    description: "Behavior-aware journeys that move leads and customers from first intent to activation, expansion, advocacy and recovery.",
    primary: "Create journey",
    metricA: ["Lifecycle revenue", "$219K", "+17%"],
    metricB: ["Activation rate", "42.8%", "+4.1 pts"],
    metricC: ["At-risk accounts", "841", "-9%"],
    insightTitle: "Activation friction is concentrated in one integration step",
    insightText: "Accounts that connect a first data source within 24 hours retain 34% better. The AI has drafted an intervention journey.",
    rows: [["New lead nurture", "Active", "24.8%", "$52K"], ["Trial activation", "Active", "42.8%", "$71K"], ["Expansion", "Active", "18.1%", "$63K"], ["Churn rescue", "Review", "11.2%", "$33K"]]
  },
  "/experiences": {
    eyebrow: "EXPERIENCE OPTIMIZATION",
    title: "Website & CRO",
    description: "Detect friction, generate hypotheses, personalize experiences and improve conversion while preserving brand and deployment safety.",
    primary: "Create experience",
    metricA: ["Qualified CVR", "6.42%", "+0.8 pts"],
    metricB: ["Experiences live", "12", "+3"],
    metricC: ["Revenue lift", "$128K", "+19%"],
    insightTitle: "Pricing-page intent is leaking before plan comparison",
    insightText: "Mobile visitors repeatedly open feature details before seeing the plan comparison. A reordered layout is ready for experiment.",
    rows: [["Homepage proof", "Live", "+8.4%", "95%"], ["Pricing hierarchy", "Draft", "+12.1%", "81%"], ["Enterprise CTA", "Live", "+6.8%", "92%"], ["Exit recovery", "Learning", "+3.2%", "76%"]]
  },
  "/experiments": {
    eyebrow: "CAUSAL LEARNING",
    title: "Experiments",
    description: "Run controlled tests across ads, pages, lifecycle and offers; record what caused lift and feed verified learning back into the operating memory.",
    primary: "Create experiment",
    metricA: ["Running", "18", "+4"],
    metricB: ["Verified wins", "42", "+7"],
    metricC: ["Incremental lift", "$284K", "+$38K"],
    insightTitle: "Message sequencing, not discounting, drove the last major win",
    insightText: "The latest holdout shows urgency messaging had little causal value. Proof-first sequencing explains most of the measured lift.",
    rows: [["Pricing proof order", "Running", "81%", "+12.1%"], ["Meta proof concept", "Winner", "96%", "+18.4%"], ["Onboarding nudge", "Running", "78%", "+6.8%"], ["Discount test", "No lift", "95%", "+0.4%"]]
  },
  "/agents": {
    eyebrow: "AI WORKFORCE",
    title: "Agents",
    description: "Specialist agents share goals and memory while remaining constrained by domain permissions, tool access, policies and approval thresholds.",
    primary: "Configure agent",
    metricA: ["Active agents", "14", "6 executing"],
    metricB: ["Verified actions", "184", "+42 this week"],
    metricC: ["Success rate", "96.2%", "+1.4%"],
    insightTitle: "Your agents are coordinating around the pipeline goal",
    insightText: "Paid, Organic, Lifecycle and Creative agents are sharing the same audience and revenue evidence instead of optimizing isolated channel metrics.",
    rows: [["AI CMO", "Running", "Approval required", "28"], ["Paid Growth Agent", "Running", "Approval required", "47"], ["Organic Growth Agent", "Learning", "Draft", "19"], ["Revenue Analyst", "Waiting", "Observe", "15"]]
  },
  "/memory": {
    eyebrow: "ORGANIZATIONAL MEMORY",
    title: "Memory & Decisions",
    description: "A durable record of goals, assumptions, experiments, decisions, outcomes, customer truths and lessons that keeps the system from repeating mistakes.",
    primary: "Add decision",
    metricA: ["Verified learnings", "382", "+24"],
    metricB: ["Decision receipts", "1,248", "+61"],
    metricC: ["Reusable patterns", "74", "+8"],
    insightTitle: "The system remembers why a previous scaling attempt failed",
    insightText: "A similar budget expansion in July increased lead volume but reduced sales-qualified rate. The current recommendation includes the learned quality guardrail.",
    rows: [["Budget scaling guardrail", "Verified", "Paid media", "Today"], ["Proof-first creative", "Verified", "Creative", "Yesterday"], ["Fast integration activation", "Verified", "Lifecycle", "3d ago"], ["Annual-discount sensitivity", "Challenged", "Pricing", "5d ago"]]
  },
  "/digital-twin": {
    eyebrow: "SIMULATION",
    title: "Growth Digital Twin",
    description: "Test strategies against a modeled version of your business before committing budget, customer experience or operational capacity.",
    primary: "Run simulation",
    metricA: ["Scenarios modeled", "28", "+6"],
    metricB: ["Forecast accuracy", "87%", "+2.1%"],
    metricC: ["Risk avoided", "$118K", "+$21K"],
    insightTitle: "A 20% paid budget increase is less efficient than a conversion intervention",
    insightText: "The digital twin predicts that improving qualified conversion by 0.6 points produces comparable pipeline with 41% less incremental spend.",
    rows: [["Scale paid 20%", "+$71K", "$42K", "Medium"], ["Improve CVR 0.6pt", "+$69K", "$25K", "Low"], ["Expand lifecycle", "+$48K", "$11K", "Low"], ["Pricing change", "+$92K", "$34K", "High"]]
  },
  "/data": {
    eyebrow: "DATA FABRIC",
    title: "Data & Integrations",
    description: "Connect first-party events, ad platforms, CRM, commerce, product, support and warehouse data with identity, quality and lineage controls.",
    primary: "Connect source",
    metricA: ["Connected sources", "27", "+3"],
    metricB: ["Events / day", "8.4M", "+9%"],
    metricC: ["Data trust score", "94%", "+2 pts"],
    insightTitle: "CRM opportunity stages are the only material data-quality risk",
    insightText: "Seven percent of recently closed opportunities are missing source-normalized campaign identifiers, reducing revenue attribution confidence.",
    rows: [["Website events", "Healthy", "99.98%", "Real time"], ["Google Ads", "Healthy", "99.9%", "3m"], ["Meta", "Healthy", "99.8%", "5m"], ["CRM", "Warning", "93%", "2m"]]
  },
  "/governance": {
    eyebrow: "TRUST & CONTROL",
    title: "Governance",
    description: "Central policy for autonomy, data access, brand safety, model use, approvals, audit, retention, consent, incident response and kill switches.",
    primary: "Edit policies",
    metricA: ["Policy coverage", "98%", "+2%"],
    metricB: ["Open exceptions", "3", "-4"],
    metricC: ["Audit completeness", "100%", "Verified"],
    insightTitle: "All material execution paths are currently gated",
    insightText: "Budget, external publishing, customer contact, production changes and irreversible actions require either explicit approval or a pre-approved policy envelope.",
    rows: [["Budget policy", "Enforced", "12 rules", "0 exceptions"], ["Customer contact", "Enforced", "9 rules", "1 exception"], ["Model use", "Enforced", "14 rules", "0 exceptions"], ["Data retention", "Review", "8 rules", "2 exceptions"]]
  },
  "/billing": {
    eyebrow: "SUBSCRIPTION & USAGE",
    title: "Billing & Usage",
    description: "Plan, seats, metered AI operations, data usage, invoices and commercial guardrails for the workspace.",
    primary: "Manage subscription",
    metricA: ["Current plan", "Enterprise", "Annual"],
    metricB: ["Monthly usage", "$6,842", "81% forecast"],
    metricC: ["Seats", "48 / 60", "12 available"],
    insightTitle: "AI usage remains inside the monthly budget envelope",
    insightText: "Current model and agent consumption is forecast to finish 8% below the workspace budget due to routing and caching efficiencies.",
    rows: [["Agent execution", "4.2M actions", "$2,410", "62%"], ["Model tokens", "1.8B", "$2,104", "71%"], ["Event volume", "248M", "$1,128", "84%"], ["Storage", "4.8 TB", "$1,200", "88%"]]
  }
};

export default function ModulePage({ path }: { path: string }) {
  const module = modules[path] ?? modules["/opportunities"];

  return (
    <>
      <PageHeader
        eyebrow={module.eyebrow}
        title={module.title}
        description={module.description}
        actions={<><Button variant="secondary">View history</Button><Button><Plus size={16} /> {module.primary}</Button></>}
      />

      <section className="module-metrics">
        {[module.metricA, module.metricB, module.metricC].map(([label, value, meta]) => (
          <article className="panel metric-card" key={label}>
            <span>{label}</span><strong>{value}</strong><small>{meta}</small>
          </article>
        ))}
        <article className="panel metric-card accent-card">
          <span>AI status</span><strong>Learning</strong><small>Next model refresh in 18m</small>
        </article>
      </section>

      <section className="module-grid">
        <article className="panel insight-panel">
          <div className="insight-icon"><Sparkles size={20} /></div>
          <div>
            <span className="section-kicker">AI RECOMMENDATION</span>
            <h2>{module.insightTitle}</h2>
            <p>{module.insightText}</p>
            <div className="confidence-row"><Badge tone="success">87% confidence</Badge><span>Based on 14 connected signals</span></div>
          </div>
          <button className="circle-next"><ArrowRight size={17} /></button>
        </article>

        <article className="panel learning-card">
          <span className="section-kicker">LEARNING LOOP</span>
          <h2>What changed this week</h2>
          <div className="learning-stat"><TrendingUp size={18} /><div><strong>+18%</strong><span>Signal quality</span></div></div>
          <div className="learning-stat"><Lightbulb size={18} /><div><strong>7</strong><span>New verified learnings</span></div></div>
          <div className="learning-stat"><CheckCircle2 size={18} /><div><strong>31</strong><span>Decisions verified</span></div></div>
        </article>
      </section>

      <section className="module-grid">
        <article className="panel table-panel wide">
          <div className="panel-head"><div><span className="section-kicker">OPERATING VIEW</span><h2>Current priorities</h2></div><Badge tone="accent">Live</Badge></div>
          <div className="table-wrap borderless">
            <table>
              <thead><tr><th>Name</th><th>Value / state</th><th>Signal</th><th>Action</th></tr></thead>
              <tbody>
                {module.rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => <td key={index}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel connected-card">
          <span className="section-kicker">CONNECTED SYSTEM</span>
          <h2>Evidence sources</h2>
          {[
            [Database, "First-party data", "Fresh"],
            [Link2, "Channel integrations", "Connected"],
            [FileText, "Knowledge & policies", "Indexed"],
            [CircleDollarSign, "Revenue outcomes", "Verified"]
          ].map(([Icon, label, status]) => {
            const SourceIcon = Icon as typeof Database;
            return <div className="source-row" key={String(label)}><span className="source-icon"><SourceIcon size={16} /></span><div><strong>{label as string}</strong><small>{status as string}</small></div><ShieldCheck size={16} /></div>;
          })}
          <Button variant="secondary">View data lineage</Button>
        </article>
      </section>
    </>
  );
}
