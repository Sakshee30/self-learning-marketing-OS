import type { ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Clock3,
  ShieldAlert
} from "lucide-react";
import type { Agent, Kpi } from "../types";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  onClick,
  disabled,
  type = "button"
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button className={"button " + variant} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
}) {
  return <span className={"badge " + tone}>{children}</span>;
}

export function KpiCard({ item }: { item: Kpi }) {
  return (
    <article className="kpi-card">
      <div className="kpi-label">{item.label}</div>
      <div className="kpi-main">
        <strong>{item.value}</strong>
        <span className={"delta " + item.direction}>
          {item.direction === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {item.delta}
        </span>
      </div>
      <div className="muted">{item.hint}</div>
    </article>
  );
}

export function AgentCard({ agent }: { agent: Agent }) {
  const icon =
    agent.status === "Running" ? (
      <CheckCircle2 size={16} />
    ) : agent.status === "Learning" ? (
      <Circle size={16} />
    ) : (
      <Clock3 size={16} />
    );
  return (
    <article className="agent-card">
      <div className="agent-card-top">
        <div>
          <strong>{agent.name}</strong>
          <p>{agent.domain}</p>
        </div>
        <Badge tone={agent.status === "Running" ? "success" : agent.status === "Learning" ? "accent" : "neutral"}>
          <span className="badge-icon">{icon}</span>
          {agent.status}
        </Badge>
      </div>
      <div className="agent-stats">
        <div><span>Autonomy</span><strong>{agent.autonomy}</strong></div>
        <div><span>Actions / 7d</span><strong>{agent.actions}</strong></div>
        <div><span>Outcome</span><strong>{agent.outcome}</strong></div>
      </div>
    </article>
  );
}

export function RiskBadge({ risk }: { risk: "Low" | "Medium" | "High" }) {
  return (
    <span className={"risk " + risk.toLowerCase()}>
      <ShieldAlert size={13} />
      {risk} risk
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <Circle size={28} />
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
