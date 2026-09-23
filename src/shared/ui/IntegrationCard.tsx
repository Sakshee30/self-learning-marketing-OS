import { Database } from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "./Status";

export type IntegrationCardProps = {
  name: string;
  category: string;
  description: string;
  status: string;
  statusTone: "neutral" | "success" | "warning" | "danger" | "accent";
  freshness: string;
  confidence: string;
  scopes: readonly string[];
  action?: ReactNode | undefined;
};

export function IntegrationCard({
  name,
  category,
  description,
  status,
  statusTone,
  freshness,
  confidence,
  scopes,
  action
}: IntegrationCardProps) {
  return (
    <article className="rounded-xl border border-growth-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-violet-700">
            <Database size={19} />
          </span>
          <div>
            <strong className="block text-sm text-growth-ink">{name}</strong>
            <span className="type-caption mt-0.5 block text-growth-muted">{category}</span>
          </div>
        </div>
        <StatusBadge tone={statusTone}>{status}</StatusBadge>
      </div>

      <p className="mb-0 mt-3 text-xs leading-5 text-growth-muted">{description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="type-caption text-growth-muted">Freshness</dt>
          <dd className="m-0 mt-1 text-xs font-semibold text-growth-ink">{freshness}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="type-caption text-growth-muted">Confidence</dt>
          <dd className="m-0 mt-1 text-xs font-semibold text-growth-ink">{confidence}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Authorized scopes">
        {scopes.map((scope) => (
          <span key={scope} className="rounded-md bg-slate-100 px-2 py-1 type-caption text-slate-600">
            {scope}
          </span>
        ))}
      </div>

      {action ? <div className="mt-4 flex justify-end">{action}</div> : null}
    </article>
  );
}
