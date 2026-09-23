import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  CircleDollarSign,
  Pause,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { agents, approvals, kpis } from "../data";
import { AgentCard, Badge, Button, KpiCard, PageHeader, RiskBadge } from "../components/Ui";

export default function CommandCenter() {
  return (
    <>
      <PageHeader
        eyebrow="AI COMMAND CENTER"
        title="Good evening. Your growth system is learning."
        description="One operating view for what changed, what the AI decided, what it is doing next, and where your approval is required."
        actions={
          <>
            <Button variant="secondary"><Pause size={16} /> Pause autonomy</Button>
            <Button><Sparkles size={16} /> Set a growth goal</Button>
          </>
        }
      />

      <section className="kpi-grid">
        {kpis.map((item) => <KpiCard key={item.label} item={item} />)}
      </section>

      <section className="hero-grid">
        <article className="panel goal-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">PRIMARY BUSINESS GOAL</span>
              <h2>Grow qualified pipeline without increasing blended CAC</h2>
            </div>
            <Badge tone="success">On track</Badge>
          </div>

          <div className="goal-progress">
            <div className="progress-header">
              <span>$3.2M influenced pipeline</span>
              <strong>72% of $4.4M target</strong>
            </div>
            <div className="progress-track"><span style={{ width: "72%" }} /></div>
          </div>

          <div className="loop-row">
            {[
              ["Goal", "Target", "Defined", Target],
              ["Decide", "Strategy", "Active", BrainCircuit],
              ["Execute", "42 actions", "Running", Play],
              ["Measure", "Revenue", "Live", CircleDollarSign],
              ["Learn", "7 signals", "Learning", TrendingUp],
              ["Correct", "4 approvals", "Waiting", BadgeCheck]
            ].map(([step, detail, status, Icon], index) => {
              const StepIcon = Icon as typeof Target;
              return (
                <div className="loop-item" key={String(step)}>
                  <div className="loop-icon"><StepIcon size={17} /></div>
                  <span>{step as string}</span>
                  <strong>{detail as string}</strong>
                  <small>{status as string}</small>
                  {index < 5 && <ArrowRight className="loop-arrow" size={14} />}
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel ai-brief">
          <div className="panel-head compact">
            <div>
              <span className="section-kicker">AI CMO BRIEF</span>
              <h2>Three things matter now</h2>
            </div>
            <div className="ai-orb"><Sparkles size={18} /></div>
          </div>
          <div className="brief-item">
            <span className="brief-number">01</span>
            <div>
              <strong>Protect efficient demand</strong>
              <p>Search intent is improving while Meta prospecting is saturating. Reallocate carefully.</p>
            </div>
          </div>
          <div className="brief-item">
            <span className="brief-number">02</span>
            <div>
              <strong>Capture organic buying intent</strong>
              <p>14 pages can win answer-engine visibility with evidence-led copy changes.</p>
            </div>
          </div>
          <div className="brief-item">
            <span className="brief-number">03</span>
            <div>
              <strong>Intervene before expansion risk</strong>
              <p>27 high-value accounts show declining engagement but still have strong product fit.</p>
            </div>
          </div>
          <button className="text-link">Open full reasoning <ArrowRight size={14} /></button>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel approvals-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">HUMAN APPROVALS</span>
              <h2>Decisions waiting for you</h2>
            </div>
            <Badge tone="warning">4 pending</Badge>
          </div>
          <div className="approval-list compact-list">
            {approvals.slice(0, 3).map((item) => (
              <div className="approval-row" key={item.id}>
                <div className="approval-main">
                  <div className="approval-title-line">
                    <strong>{item.title}</strong>
                    <RiskBadge risk={item.risk} />
                  </div>
                  <p>{item.description}</p>
                  <div className="approval-meta">
                    <span>{item.agent}</span><span>•</span><span>{item.impact}</span><span>•</span><span>{item.requestedAt}</span>
                  </div>
                </div>
                <button className="circle-next"><ArrowRight size={17} /></button>
              </div>
            ))}
          </div>
        </article>

        <article className="panel outcomes-panel">
          <div className="panel-head compact">
            <div>
              <span className="section-kicker">AUTONOMOUS ACTIONS</span>
              <h2>What the system changed</h2>
            </div>
            <Badge tone="success"><Zap size={13} /> 42 this week</Badge>
          </div>
          <div className="timeline">
            <div className="timeline-item">
              <span className="timeline-dot success" />
              <div><strong>Excluded 1,841 low-quality search queries</strong><p>Saved $3,420 estimated monthly waste.</p><small>Paid Growth Agent · 18 min ago</small></div>
            </div>
            <div className="timeline-item">
              <span className="timeline-dot accent" />
              <div><strong>Created 6 new creative hypotheses</strong><p>Based on message-level conversion patterns.</p><small>Creative Intelligence · 34 min ago</small></div>
            </div>
            <div className="timeline-item">
              <span className="timeline-dot neutral" />
              <div><strong>Re-scored 12,409 customer profiles</strong><p>New purchase and engagement signals incorporated.</p><small>Customer Intelligence · 51 min ago</small></div>
            </div>
          </div>
        </article>
      </section>

      <section>
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">AI WORKFORCE</span>
            <h2>Your agents</h2>
          </div>
          <button className="text-link">Manage agents <ArrowRight size={14} /></button>
        </div>
        <div className="agent-grid">
          {agents.slice(0, 3).map((agent) => <AgentCard key={agent.name} agent={agent} />)}
        </div>
      </section>
    </>
  );
}
