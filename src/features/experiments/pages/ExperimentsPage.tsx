import { useMemo, useState } from "react";
import {
  Beaker,
  CheckCircle2,
  FlaskConical,
  Plus,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { Button, FormField, Input, MetricCard, Panel, Select, StatusBadge } from "../../../shared/ui";
import { useZodForm } from "../../../shared/forms/useZodForm";
import { experimentDraftSchema, type ExperimentDraftInput } from "../schemas/experiment.schema";

type PreviewExperiment = ExperimentDraftInput & {
  id: string;
  state: "draft" | "approval_required";
};

const activeExperiments = [
  ["EXP-221", "Pricing proof order", "Qualified conversion", "81%", "+12.1%", "Running"],
  ["EXP-218", "Meta proof concept", "Pipeline", "96%", "+18.4%", "Winner"],
  ["EXP-216", "Onboarding integration nudge", "Activation", "78%", "+6.8%", "Running"],
  ["EXP-209", "Annual discount urgency", "Revenue", "95%", "+0.4%", "No material lift"]
] as const;

const verifiedLearnings = [
  ["Proof-first sequencing", "Verified", "Commercial pages", "+12.1% qualified conversion"],
  ["Outcome-led paid creative", "Verified", "Meta", "+18.4% pipeline contribution"],
  ["Fast first integration", "Verified", "Onboarding", "+34% retention association"],
  ["Urgency discounting", "Rejected", "Pricing", "No material causal lift"]
] as const;

export default function ExperimentsPage() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [drafts, setDrafts] = useState<PreviewExperiment[]>([]);

  const form = useZodForm<ExperimentDraftInput>(experimentDraftSchema, {
    defaultValues: {
      name: "",
      hypothesis: "Moving evidence and proof above feature comparison will increase qualified conversion",
      primaryMetric: "qualified_conversion",
      holdoutPercent: 20,
      durationDays: 14,
      minimumSample: 5000,
      approvalRequired: true
    }
  });

  const holdout = form.watch("holdoutPercent") || 20;
  const duration = form.watch("durationDays") || 14;
  const sample = form.watch("minimumSample") || 5000;

  const estimatedExposure = useMemo(
    () => Math.max(sample, Math.round((sample / Math.max(5, holdout)) * 100)),
    [holdout, sample]
  );

  const submit = form.handleSubmit((values) => {
    setDrafts((current) => [
      {
        ...values,
        id: "EXP-PREVIEW-" + String(current.length + 1).padStart(3, "0"),
        state: values.approvalRequired ? "approval_required" : "draft"
      },
      ...current
    ]);
    setBuilderOpen(false);
    form.reset();
  });

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">CAUSAL LEARNING</span>
          <h1>Experiments</h1>
          <p className="mt-3">
            Convert marketing opinions into causal evidence. GrowthOS records the hypothesis, treatment,
            holdout, primary outcome and verified learning so future agents optimize from what actually caused lift.
          </p>
        </div>
        <Button onClick={() => setBuilderOpen(true)}><Plus size={16} /> Create experiment</Button>
      </header>

      {builderOpen && (
        <Panel className="mb-5 overflow-hidden border-violet-200">
          <div className="flex items-start justify-between gap-4 border-b border-violet-100 bg-violet-50/70 p-5">
            <div>
              <span className="section-kicker">EXPERIMENT DESIGNER</span>
              <h2>Define what must be true before the AI learns from it.</h2>
              <p className="mb-0 text-xs">
                A draft experiment is not a production deployment. Activation remains subject to workspace policy and authoritative backend confirmation.
              </p>
            </div>
            <button type="button" className="icon-button" onClick={() => setBuilderOpen(false)} aria-label="Close experiment builder">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={submit} className="grid gap-6 p-5 xl:grid-cols-[1fr_360px]">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField label="Experiment name" required error={form.formState.errors.name?.message}>
                  {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} placeholder="e.g. Pricing proof hierarchy" {...form.register("name")} />}
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Causal hypothesis" required error={form.formState.errors.hypothesis?.message}>
                  {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...form.register("hypothesis")} />}
                </FormField>
              </div>

              <FormField label="Primary metric">
                {({ inputId }) => (
                  <Select id={inputId} {...form.register("primaryMetric")}>
                    <option value="qualified_conversion">Qualified conversion</option>
                    <option value="pipeline">Pipeline</option>
                    <option value="revenue">Revenue</option>
                    <option value="cac">CAC</option>
                    <option value="activation">Activation</option>
                    <option value="retention">Retention</option>
                  </Select>
                )}
              </FormField>

              <FormField label="Holdout (%)">
                {({ inputId }) => <Input id={inputId} type="number" min={5} max={50} {...form.register("holdoutPercent", { valueAsNumber: true })} />}
              </FormField>

              <FormField label="Duration (days)">
                {({ inputId }) => <Input id={inputId} type="number" min={3} max={90} {...form.register("durationDays", { valueAsNumber: true })} />}
              </FormField>

              <FormField label="Minimum holdout sample">
                {({ inputId }) => <Input id={inputId} type="number" min={100} {...form.register("minimumSample", { valueAsNumber: true })} />}
              </FormField>

              <label className="md:col-span-2 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <input className="mt-1" type="checkbox" {...form.register("approvalRequired")} />
                <span>
                  <strong className="block text-sm text-amber-900">Require approval before production exposure</strong>
                  <span className="mt-1 block text-xs leading-5 text-amber-800">
                    Keep enabled when the test changes customer experience, spend, targeting or outbound communication.
                  </span>
                </span>
              </label>
            </div>

            <aside className="rounded-xl border border-growth-line bg-slate-50/70 p-4">
              <div className="flex items-center gap-2">
                <Beaker className="text-violet-700" size={18} />
                <strong className="text-sm">Experiment readiness</strong>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  ["Holdout", holdout + "%"],
                  ["Duration", duration + " days"],
                  ["Minimum holdout", sample.toLocaleString()],
                  ["Estimated exposure", estimatedExposure.toLocaleString()]
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-growth-line bg-white p-3">
                    <span className="text-xs text-growth-muted">{label}</span>
                    <strong className="text-xs">{value}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-700" size={16} />
                  <StatusBadge tone="success">Learning guardrail</StatusBadge>
                </div>
                <p className="mb-0 mt-2 text-xs text-emerald-900">
                  GrowthOS should not promote a result into reusable memory until the outcome meets the experiment's evidence threshold.
                </p>
              </div>
            </aside>

            <div className="flex justify-end gap-2 border-t border-growth-line pt-5 xl:col-span-2">
              <Button type="button" variant="secondary" onClick={() => setBuilderOpen(false)}>Cancel</Button>
              <Button type="submit"><FlaskConical size={16} /> Save experiment draft</Button>
            </div>
          </form>
        </Panel>
      )}

      {drafts.length > 0 && (
        <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <strong className="text-sm text-violet-900">{drafts[0]?.name} staged as a frontend draft</strong>
          <p className="mb-0 mt-1 text-xs text-violet-800">
            No customer was exposed and no production experience changed. Backend eligibility, allocation and approval are still required.
          </p>
        </div>
      )}

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Running" value="18" detail="+4 this month" icon={<FlaskConical size={18} />} />
        <MetricCard label="Verified wins" value="42" detail="+7 new learnings" />
        <MetricCard label="Incremental lift" value="$284K" detail="+$38K measured" />
        <MetricCard label="No-lift / rejected" value="16" detail="Prevented false learning" />
      </section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <span className="section-kicker">ACTIVE EXPERIMENTS</span>
              <h2>What is being tested</h2>
            </div>
            <StatusBadge tone="accent">Causal measurement</StatusBadge>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>ID</th><th>Experiment</th><th>Metric</th><th>Confidence</th><th>Lift</th><th>State</th></tr></thead>
              <tbody>
                {drafts.map((draft) => (
                  <tr key={draft.id}>
                    <td>{draft.id}</td>
                    <td><strong>{draft.name}</strong></td>
                    <td>{draft.primaryMetric.replaceAll("_", " ")}</td>
                    <td>Not started</td>
                    <td>—</td>
                    <td><StatusBadge tone="warning">{draft.state === "approval_required" ? "Approval required" : "Draft"}</StatusBadge></td>
                  </tr>
                ))}
                {activeExperiments.map(([id, name, metric, confidence, lift, state]) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td><strong>{name}</strong></td>
                    <td>{metric}</td>
                    <td>{confidence}</td>
                    <td>{lift}</td>
                    <td><StatusBadge tone={state === "Winner" ? "success" : state === "No material lift" ? "neutral" : "accent"}>{state}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="text-violet-700" size={20} />
            <div>
              <span className="section-kicker">AI EXPERIMENT BRIEF</span>
              <h2>What to test next</h2>
            </div>
          </div>
          <p>
            The highest-value uncertainty is whether the pricing-page conversion gap comes from proof hierarchy
            rather than offer strength. Testing layout sequence has lower commercial risk than introducing a discount.
          </p>
          <div className="mt-4 grid gap-2">
            {[
              ["Expected information value", "High"],
              ["Operational risk", "Low"],
              ["Estimated time to evidence", "14 days"],
              ["Downstream reuse", "Creative + CRO + paid landing pages"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-growth-line p-3">
                <span className="text-xs text-growth-muted">{label}</span>
                <strong className="text-xs">{value}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <span className="section-kicker">EXPERIMENT MEMORY</span>
            <h2>Verified learning</h2>
          </div>
          <StatusBadge tone="success"><CheckCircle2 size={13} /> Outcome-linked</StatusBadge>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {verifiedLearnings.map(([learning, state, domain, result]) => (
            <article key={learning} className="rounded-xl border border-growth-line p-4">
              <div className="flex items-start justify-between gap-3">
                <strong className="text-sm">{learning}</strong>
                <StatusBadge tone={state === "Verified" ? "success" : "neutral"}>{state}</StatusBadge>
              </div>
              <span className="mt-2 block text-xs text-growth-muted">{domain}</span>
              <span className="mt-1 block text-xs font-semibold text-growth-ink">{result}</span>
            </article>
          ))}
        </div>
      </Panel>
    </>
  );
}
