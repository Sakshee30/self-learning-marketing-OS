import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";

export function LoadingState({ label = "Loading workspace…" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-growth-muted" role="status">
      <LoaderCircle className="animate-spin" size={18} />
      <span>{label}</span>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-growth-line bg-white p-8 text-center">
      <Inbox className="mx-auto mb-3 text-slate-400" size={24} />
      <strong className="block text-sm text-growth-ink">{title}</strong>
      <p className="mx-auto mt-2 max-w-lg text-xs text-growth-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "The page could not be rendered safely.",
  onRetry
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto my-10 max-w-2xl rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm" role="alert">
      <AlertTriangle className="mx-auto mb-3 text-growth-danger" size={26} />
      <strong className="block text-sm text-growth-ink">{title}</strong>
      <p className="mt-2 text-xs text-growth-muted">{description}</p>
      {onRetry && <Button className="mt-4" variant="secondary" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
