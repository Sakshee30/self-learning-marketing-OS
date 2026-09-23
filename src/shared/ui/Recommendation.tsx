import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "./Status";

export function Recommendation({
  title,
  rationale,
  confidence,
  impact,
  children
}: {
  title: string;
  rationale: string;
  confidence: number;
  impact: string;
  children?: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-600 text-white">
            <Sparkles size={17} />
          </span>
          <div>
            <span className="type-overline text-violet-500">RECOMMENDATION</span>
            <strong className="mt-1 block text-sm text-violet-950">{title}</strong>
          </div>
        </div>
        <StatusBadge tone="success">{confidence}% confidence</StatusBadge>
      </div>
      <p className="mb-0 mt-3 text-xs leading-5 text-violet-900">{rationale}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <strong className="metric-number text-sm text-emerald-700">{impact}</strong>
        {children}
      </div>
    </article>
  );
}
