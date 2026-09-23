import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  BarChart3,
  CheckCircle2,
  Megaphone,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  X
} from "lucide-react";
import { Button, FormField, Input, MetricCard, Panel, Select, StatusBadge } from "../../../shared/ui";
import { useZodForm } from "../../../shared/forms/useZodForm";
import {
  createCampaignInputSchema,
  type CreateCampaignInput
} from "../schemas/campaign.schema";

const existingCampaigns = [
  ["Q4 Pipeline Engine", "Google · Meta · Lifecycle", "$82K", "5.2×", "Healthy"],
  ["Enterprise ABM", "LinkedIn · Email · CRM", "$46K", "7.1×", "Healthy"],
  ["Creator Launch", "YouTube · LinkedIn", "$28K", "3.4×", "Learning"],
  ["Retargeting Always-on", "Meta · Google", "$31K", "6.4×", "Healthy"]
] as const;

const availableChannels = ["Google Ads", "Meta Ads", "LinkedIn", "Email", "WhatsApp", "SEO/GEO"] as const;

type PreviewCampaign = CreateCampaignInput & {
  id: string;
  state: "draft" | "approval_required";
};

export default function CampaignsPage() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [previewDrafts, setPreviewDrafts] = useState<PreviewCampaign[]>([]);

  const form = useZodForm<CreateCampaignInput>(createCampaignInputSchema, {
    defaultValues: {
      name: "",
      objective: "Generate qualified pipeline from high-intent mid-market buyers",
      channels: ["Google Ads", "Meta Ads"],
      budget: 50000,
      currency: "USD",
      requiresHumanApproval: true
    }
  });

  const budget = form.watch("budget") || 0;
  const channels = form.watch("channels") || [];

  const simulation = useMemo(() => {
    const modeledRevenue = Math.round(budget * 5.2);
    const conservative = Math.round(modeledRevenue * 0.72);
    const upside = Math.round(modeledRevenue * 1.28);
    return { modeledRevenue, conservative, upside };
  }, [budget]);

  function toggleChannel(channel: string) {
    const current = form.getValues("channels");
    const next = current.includes(channel)
      ? current.filter((item) => item !== channel)
      : [...current, channel];
    form.setValue("channels", next, { shouldDirty: true, shouldValidate: true });
  }

  const submit = form.handleSubmit((values) => {
    setPreviewDrafts((current) => [
      {
        ...values,
        id: "PREVIEW-" + String(current.length + 1).padStart(3, "0"),
        state: values.requiresHumanApproval ? "approval_required" : "draft"
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
          <span className="section-kicker">CROSS-CHANNEL EXECUTION</span>
          <h1>Campaigns</h1>
          <p className="mt-3">
            Plan coordinated paid, owned and lifecycle campaigns from one objective, audience, budget,
            creative brief and measurement contract. AI can prepare work; publishing and material spend remain governed.
          </p>
        </div>
        <Button onClick={() => setBuilderOpen(true)}><Plus size={16} /> Create campaign</Button>
      </header>

      {builderOpen && (
        <Panel className="mb-5 overflow-hidden border-violet-200">
          <div className="flex items-start justify-between gap-4 border-b border-violet-100 bg-violet-50/70 p-5">
            <div>
              <span className="section-kicker">CAMPAIGN COMPILER</span>
              <h2>Create one campaign contract across channels</h2>
              <p className="mb-0 text-xs">
                The frontend prepares the campaign intent and simulation. It does not claim external publication until backend/provider confirmation exists.
              </p>
            </div>
            <button type="button" className="icon-button" onClick={() => setBuilderOpen(false)} aria-label="Close campaign builder">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={submit} className="grid gap-6 p-5 xl:grid-cols-[1fr_420px]">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField label="Campaign name" required error={form.formState.errors.name?.message}>
                  {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} placeholder="e.g. Q1 Pipeline Acceleration" {...form.register("name")} />}
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Business objective" required error={form.formState.errors.objective?.message}>
                  {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...form.register("objective")} />}
                </FormField>
              </div>

              <FormField label="Budget">
                {({ inputId }) => <Input id={inputId} type="number" {...form.register("budget", { valueAsNumber: true })} />}
              </FormField>

              <FormField label="Currency">
                {({ inputId }) => (
                  <Select id={inputId} {...form.register("currency")}>
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </Select>
                )}
              </FormField>

              <div className="md:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Channels</span>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {availableChannels.map((channel) => {
                    const selected = channels.includes(channel);
                    return (
                      <button
                        key={channel}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleChannel(channel)}
                        className={[
                          "flex min-h-11 items-center justify-between rounded-lg border px-3 text-left text-xs font-semibold",
                          selected ? "border-violet-300 bg-violet-50 text-violet-900" : "border-growth-line bg-white text-slate-700"
                        ].join(" ")}
                      >
                        {channel}
                        {selected ? <CheckCircle2 size={16} /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="md:col-span-2 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <input className="mt-1" type="checkbox" {...form.register("requiresHumanApproval")} />
                <span>
                  <strong className="block text-sm text-amber-900">Require human approval before activation</strong>
                  <span className="mt-1 block text-xs leading-5 text-amber-800">
                    Recommended for spend, external publishing, audience activation and customer communication.
                  </span>
                </span>
              </label>
            </div>

            <aside className="rounded-xl border border-growth-line bg-slate-50/70 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-violet-700" size={18} />
                <strong className="text-sm">Digital Twin preview</strong>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  ["Conservative", simulation.conservative, "Lower-bound modeled revenue"],
                  ["Expected", simulation.modeledRevenue, "Current evidence-weighted forecast"],
                  ["Upside", simulation.upside, "High-response scenario"]
                ].map(([label, value, detail], index) => (
                  <div key={String(label)} className={["rounded-xl border p-3", index === 1 ? "border-violet-200 bg-violet-50" : "border-growth-line bg-white"].join(" ")}>
                    <span className="text-xs text-growth-muted">{label as string}</span>
                    <strong className="mt-1 block text-lg text-growth-ink">{"$"}{Number(value).toLocaleString()}</strong>
                    <span className="mt-1 block text-xs text-growth-muted">{detail as string}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-700" size={16} />
                  <StatusBadge tone="success">Policy compatible</StatusBadge>
                </div>
                <p className="mb-0 mt-2 text-xs text-emerald-900">
                  Draft creation is autonomous. Budget and external activation will route to Approval Center.
                </p>
              </div>
            </aside>

            <div className="flex justify-end gap-2 border-t border-growth-line pt-5 xl:col-span-2">
              <Button type="button" variant="secondary" onClick={() => setBuilderOpen(false)}>Cancel</Button>
              <Button type="submit"><ShieldCheck size={16} /> Prepare for approval</Button>
            </div>
          </form>
        </Panel>
      )}

      {previewDrafts.length > 0 && (
        <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <strong className="text-sm text-violet-900">Frontend campaign intent staged</strong>
          <p className="mb-0 mt-1 text-xs text-violet-800">
            {previewDrafts[0]?.name} is prepared as a preview draft. No external campaign, budget or customer communication has been activated.
          </p>
        </div>
      )}

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Active campaigns" value="38" detail="12 AI-managed" icon={<Megaphone size={18} />} />
        <MetricCard label="Spend this month" value="$248K" detail="71% pacing" icon={<BadgeDollarSign size={18} />} />
        <MetricCard label="Pipeline influenced" value="$1.9M" detail="+16.4% vs prior period" icon={<Target size={18} />} />
        <MetricCard label="Blended ROAS" value="5.4×" detail="Incrementality adjusted" icon={<BarChart3 size={18} />} />
      </section>

      <div className="module-tabs" role="tablist" aria-label="Campaign sections">
        {["Overview", "Paid media", "AdSync", "Budgets", "UTM", "Conversion activation"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <span className="section-kicker">{activeTab.toUpperCase()}</span>
              <h2>Campaign operating view</h2>
            </div>
            <StatusBadge tone="success">Measurement live</StatusBadge>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Campaign</th><th>Channels</th><th>Budget</th><th>ROAS</th><th>State</th></tr></thead>
              <tbody>
                {existingCampaigns.map(([name, channelList, campaignBudget, roas, state]) => (
                  <tr key={name}>
                    <td><strong>{name}</strong></td>
                    <td>{channelList}</td>
                    <td>{campaignBudget}</td>
                    <td>{roas}</td>
                    <td><StatusBadge tone={state === "Healthy" ? "success" : "accent"}>{state}</StatusBadge></td>
                  </tr>
                ))}
                {previewDrafts.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong><div className="text-[11px] text-slate-400">{item.id}</div></td>
                    <td>{item.channels.join(" · ") || "No channels selected"}</td>
                    <td>{item.currency} {item.budget.toLocaleString()}</td>
                    <td>Simulation only</td>
                    <td><StatusBadge tone="warning">{item.state === "approval_required" ? "Approval required" : "Draft"}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-5">
          <span className="section-kicker">AI RECOMMENDATION</span>
          <h2>Move budget toward higher-quality demand</h2>
          <p>
            Three paid programs show stable quality differences after controlling for assisted conversions.
            A guarded reallocation is ready for simulation and human approval.
          </p>

          <div className="mt-4 grid gap-3">
            {([
              ["Search high-intent", "+18% budget", "+$62K forecast", "High confidence"],
              ["Meta prospecting", "-12% budget", "$18K waste avoided", "Medium confidence"],
              ["Lifecycle expansion", "+8% budget", "+$39K expansion", "High confidence"]
            ] as const).map(([channel, change, impact, confidence]) => (
              <div key={channel} className="rounded-lg border border-growth-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm">{channel}</strong>
                  <StatusBadge tone={confidence.startsWith("High") ? "success" : "warning"}>{confidence}</StatusBadge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-growth-muted">
                  <span>{change}</span><span>{impact}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  );
}
