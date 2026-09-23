import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  detail,
  icon
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-growth-line bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-growth-muted">{label}</span>
        {icon ? <span className="text-violet-600">{icon}</span> : null}
      </div>
      <strong className="mt-2 block text-2xl tracking-tight text-growth-ink">{value}</strong>
      {detail ? <span className="mt-1 block text-xs text-growth-muted">{detail}</span> : null}
    </article>
  );
}
