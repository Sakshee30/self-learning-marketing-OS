import { FileCheck2, ShieldCheck } from "lucide-react";
import { Panel } from "./Panel";
import { StatusBadge } from "./Status";

export type DecisionReceiptData = {
  receiptId: string;
  goal: string;
  actor: string;
  evidenceCount: number;
  forecast: string;
  policyVerdict: "allow" | "approval_required" | "blocked";
  approvalState: string;
  verificationState: "pending" | "verified" | "failed";
};

export function DecisionReceipt({ receipt }: { receipt: DecisionReceiptData }) {
  const policyTone =
    receipt.policyVerdict === "allow"
      ? "success"
      : receipt.policyVerdict === "blocked"
        ? "danger"
        : "warning";

  return (
    <Panel className="p-4 shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700">
            <FileCheck2 size={17} />
          </span>
          <div>
            <span className="type-overline text-slate-400">DECISION RECEIPT</span>
            <strong className="mt-1 block text-sm">{receipt.receiptId}</strong>
          </div>
        </div>
        <StatusBadge tone={policyTone}>{receipt.policyVerdict.replaceAll("_", " ")}</StatusBadge>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div><dt className="type-caption text-growth-muted">Goal</dt><dd className="m-0 mt-1 text-xs font-semibold">{receipt.goal}</dd></div>
        <div><dt className="type-caption text-growth-muted">Actor</dt><dd className="m-0 mt-1 text-xs font-semibold">{receipt.actor}</dd></div>
        <div><dt className="type-caption text-growth-muted">Evidence</dt><dd className="m-0 mt-1 text-xs font-semibold">{receipt.evidenceCount} linked sources</dd></div>
        <div><dt className="type-caption text-growth-muted">Forecast</dt><dd className="m-0 mt-1 text-xs font-semibold">{receipt.forecast}</dd></div>
        <div><dt className="type-caption text-growth-muted">Approval</dt><dd className="m-0 mt-1 text-xs font-semibold">{receipt.approvalState}</dd></div>
        <div><dt className="type-caption text-growth-muted">Verification</dt><dd className="m-0 mt-1 flex items-center gap-1 text-xs font-semibold"><ShieldCheck size={13} /> {receipt.verificationState}</dd></div>
      </dl>
    </Panel>
  );
}
