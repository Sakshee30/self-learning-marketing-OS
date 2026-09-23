import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ShieldAlert,
  XCircle
} from "lucide-react";
import {
  operationLifecycleLabel,
  type OperationLifecycle
} from "../mutations/lifecycle";

const configuration: Record<
  OperationLifecycle,
  { icon: typeof CheckCircle2; className: string; detail: string }
> = {
  idle: {
    icon: Clock3,
    className: "border-slate-200 bg-slate-50 text-slate-700",
    detail: "No operation is currently in progress."
  },
  validating: {
    icon: LoaderCircle,
    className: "border-violet-200 bg-violet-50 text-violet-800",
    detail: "Inputs, scope and authority are being validated."
  },
  submitting: {
    icon: LoaderCircle,
    className: "border-amber-200 bg-amber-50 text-amber-900",
    detail: "The request was submitted. Completion is not assumed until authoritative confirmation arrives."
  },
  confirmed_success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    detail: "The authoritative source confirmed the requested operation."
  },
  confirmed_rejection: {
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-900",
    detail: "The authoritative source rejected the operation. Correct the issue before retrying."
  },
  conflict: {
    icon: ShieldAlert,
    className: "border-red-200 bg-red-50 text-red-900",
    detail: "The resource changed or the operation conflicts with current authoritative state."
  },
  outcome_unknown: {
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50 text-amber-950",
    detail: "The client lacks confirmation. Reconcile the operation identity before attempting the action again."
  }
};

export function ExecutionStatus({
  lifecycle,
  operationId,
  requestId,
  message
}: {
  lifecycle: OperationLifecycle;
  operationId?: string | undefined;
  requestId?: string | undefined;
  message?: string | undefined;
}) {
  const config = configuration[lifecycle];
  const Icon = config.icon;
  const spinning = lifecycle === "validating" || lifecycle === "submitting";

  return (
    <section
      className={`rounded-xl border p-4 ${config.className}`}
      role={lifecycle === "confirmed_rejection" || lifecycle === "conflict" || lifecycle === "outcome_unknown" ? "alert" : "status"}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={spinning ? "mt-0.5 animate-spin" : "mt-0.5"} size={18} />
        <div className="min-w-0">
          <strong className="block text-sm">{operationLifecycleLabel(lifecycle)}</strong>
          <p className="mb-0 mt-1 text-xs leading-5">{message ?? config.detail}</p>
          {(operationId || requestId) && (
            <dl className="mt-3 grid gap-1 text-xs sm:grid-cols-2">
              {operationId && <div><dt className="font-semibold">Operation</dt><dd className="m-0 break-all">{operationId}</dd></div>}
              {requestId && <div><dt className="font-semibold">Request</dt><dd className="m-0 break-all">{requestId}</dd></div>}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
