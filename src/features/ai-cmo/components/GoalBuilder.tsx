import { BrainCircuit, ShieldCheck, Sparkles, X } from "lucide-react";
import { Button, FormField, Input, Panel, Select, StatusBadge } from "../../../shared/ui";
import { useZodForm } from "../../../shared/forms/useZodForm";
import { cmoGoalSchema, type CmoGoalInput } from "../schemas/goal.schema";

export function GoalBuilder({
  onClose,
  onSave
}: {
  onClose: () => void;
  onSave: (goal: CmoGoalInput) => void;
}) {
  const form = useZodForm<CmoGoalInput>(cmoGoalSchema, {
    defaultValues: {
      objective: "Grow qualified pipeline without increasing blended CAC",
      metric: "qualified_pipeline",
      targetValue: "$4.4M qualified pipeline",
      horizonDays: 90,
      maxCac: 420,
      spendCeiling: 180000,
      riskTolerance: "balanced",
      approvalPolicy: "governed"
    }
  });

  const submit = form.handleSubmit(onSave);

  return (
    <Panel className="mb-6 overflow-hidden border-violet-200">
      <div className="flex items-start justify-between gap-4 border-b border-violet-100 bg-violet-50/70 p-5">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 text-white">
            <BrainCircuit size={20} />
          </span>
          <div>
            <span className="section-kicker">AI CMO GOAL COMPILER</span>
            <h2 className="mb-1">Define the outcome, not the channel tactics.</h2>
            <p className="mb-0 max-w-3xl text-sm">
              GrowthOS will research, rank opportunities, simulate strategies and prepare an execution plan.
              Material spend, publishing and customer-impact actions remain governed.
            </p>
          </div>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close goal builder">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={submit} className="grid gap-6 p-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField label="Business objective" required error={form.formState.errors.objective?.message}>
              {({ inputId, errorId }) => (
                <Input id={inputId} aria-describedby={errorId} {...form.register("objective")} />
              )}
            </FormField>
          </div>

          <FormField label="Primary metric">
            {({ inputId }) => (
              <Select id={inputId} {...form.register("metric")}>
                <option value="qualified_pipeline">Qualified pipeline</option>
                <option value="revenue">Revenue</option>
                <option value="profit">Incremental profit</option>
                <option value="cac">Customer acquisition cost</option>
                <option value="retention">Retention</option>
                <option value="activation">Activation</option>
              </Select>
            )}
          </FormField>

          <FormField label="Target" required error={form.formState.errors.targetValue?.message}>
            {({ inputId, errorId }) => (
              <Input id={inputId} aria-describedby={errorId} {...form.register("targetValue")} />
            )}
          </FormField>

          <FormField label="Time horizon (days)">
            {({ inputId }) => (
              <Input id={inputId} type="number" {...form.register("horizonDays", { valueAsNumber: true })} />
            )}
          </FormField>

          <FormField label="Maximum CAC">
            {({ inputId }) => (
              <Input id={inputId} type="number" {...form.register("maxCac", { valueAsNumber: true })} />
            )}
          </FormField>

          <FormField label="Monthly spend ceiling">
            {({ inputId }) => (
              <Input id={inputId} type="number" {...form.register("spendCeiling", { valueAsNumber: true })} />
            )}
          </FormField>

          <FormField label="Risk tolerance">
            {({ inputId }) => (
              <Select id={inputId} {...form.register("riskTolerance")}>
                <option value="conservative">Conservative</option>
                <option value="balanced">Balanced</option>
                <option value="growth">Growth</option>
              </Select>
            )}
          </FormField>

          <FormField label="Approval policy">
            {({ inputId }) => (
              <Select id={inputId} {...form.register("approvalPolicy")}>
                <option value="strict">Strict approval</option>
                <option value="governed">Governed execution</option>
                <option value="preapproved_envelope">Pre-approved envelope</option>
              </Select>
            )}
          </FormField>
        </div>

        <aside className="rounded-xl border border-growth-line bg-slate-50/70 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-600" size={18} />
            <strong className="text-sm">What happens next</strong>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              ["1", "Observe", "Refresh customer, revenue, market and channel evidence."],
              ["2", "Understand", "Update assumptions and identify the binding growth constraint."],
              ["3", "Predict", "Estimate impact, confidence, cost and time-to-result."],
              ["4", "Simulate", "Compare strategies against the Digital Twin."],
              ["5", "Approve", "Route consequential actions to authorized humans."],
              ["6", "Execute & learn", "Measure actual outcome and write verified learning to memory."]
            ].map(([index, title, detail]) => (
              <div key={title} className="grid grid-cols-[28px_1fr] gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-violet-700 shadow-sm">{index}</span>
                <div>
                  <strong className="block text-xs text-growth-ink">{title}</strong>
                  <span className="mt-0.5 block text-xs leading-5 text-growth-muted">{detail}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-700" size={16} />
              <StatusBadge tone="success">Governed by default</StatusBadge>
            </div>
            <p className="mb-0 mt-2 text-xs text-emerald-900">
              Research and drafting can run autonomously. Money, external publishing, new customer communication and irreversible operations remain controlled.
            </p>
          </div>
        </aside>

        <div className="flex flex-wrap justify-end gap-2 border-t border-growth-line pt-5 lg:col-span-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit"><Sparkles size={16} /> Build autonomous plan</Button>
        </div>
      </form>
    </Panel>
  );
}
