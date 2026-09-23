import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Image,
  Palette,
  Plus,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X
} from "lucide-react";
import { Button, FormField, Input, MetricCard, Panel, Select, StatusBadge } from "../../../shared/ui";
import { useZodForm } from "../../../shared/forms/useZodForm";
import { creativeBriefSchema, type CreativeBriefInput } from "../schemas/creative.schema";

type DraftVariant = {
  id: string;
  headline: string;
  body: string;
  angle: string;
  state: "draft";
};

const genomeSignals = [
  ["Outcome proof", "+31%", "High-confidence winner"],
  ["Before / after workflow", "+24%", "Strong across mid-market"],
  ["Operator pain", "+19%", "Strong social engagement"],
  ["Feature montage", "-19%", "Fatigued"],
  ["Generic AI automation", "-8%", "Category saturation"]
] as const;

export default function CreativeStudioPage() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [drafts, setDrafts] = useState<DraftVariant[]>([]);
  const [brandSafe, setBrandSafe] = useState(true);

  const form = useZodForm<CreativeBriefInput>(creativeBriefSchema, {
    defaultValues: {
      objective: "Increase qualified pipeline from operations leaders",
      audience: "Mid-market marketing and growth operations teams",
      offer: "Autonomous marketing operations with human governance",
      proof: "18.6% revenue influenced growth and lower cost per revenue dollar",
      tone: "authoritative",
      variants: 3
    }
  });

  const variantCount = form.watch("variants") || 1;

  const fatigueCount = useMemo(
    () => genomeSignals.filter(([, value]) => value.startsWith("-")).length,
    []
  );

  const submit = form.handleSubmit((values) => {
    const generated = Array.from({ length: values.variants }, (_, index): DraftVariant => ({
      id: "CR-DRAFT-" + String(Date.now()).slice(-5) + "-" + (index + 1),
      angle: index % 3 === 0 ? "Outcome proof" : index % 3 === 1 ? "Operator pain" : "Before / after",
      headline:
        index % 3 === 0
          ? "Turn marketing operations into a governed growth system."
          : index % 3 === 1
            ? "Stop stitching together dashboards and manual campaign work."
            : "From fragmented marketing work to one self-learning operating loop.",
      body:
        values.proof + ". Drafted for " + values.audience + " with a " + values.tone + " tone.",
      state: "draft"
    }));

    setDrafts(generated);
    setBuilderOpen(false);
  });

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">CREATIVE INTELLIGENCE</span>
          <h1>Creative Studio</h1>
          <p className="mt-3">
            Turn customer truth, market language and performance evidence into concepts, copy and variants.
            GrowthOS learns which creative attributes drive qualified business outcomes—not just clicks.
          </p>
        </div>
        <Button onClick={() => setBuilderOpen(true)}><WandSparkles size={16} /> Generate concept</Button>
      </header>

      {builderOpen && (
        <Panel className="mb-5 overflow-hidden border-violet-200">
          <div className="flex items-start justify-between gap-4 border-b border-violet-100 bg-violet-50/70 p-5">
            <div>
              <span className="section-kicker">CREATIVE COMPILER</span>
              <h2>Build an evidence-backed creative brief</h2>
              <p className="mb-0 text-xs">
                Generated variants remain drafts. External publishing and spend activation require an approval and provider confirmation.
              </p>
            </div>
            <button className="icon-button" type="button" onClick={() => setBuilderOpen(false)} aria-label="Close creative builder">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={submit} className="grid gap-5 p-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Business objective" required error={form.formState.errors.objective?.message}>
                {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...form.register("objective")} />}
              </FormField>
            </div>
            <FormField label="Audience" required error={form.formState.errors.audience?.message}>
              {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...form.register("audience")} />}
            </FormField>
            <FormField label="Offer" required error={form.formState.errors.offer?.message}>
              {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...form.register("offer")} />}
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Evidence / proof" required error={form.formState.errors.proof?.message}>
                {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...form.register("proof")} />}
              </FormField>
            </div>
            <FormField label="Tone">
              {({ inputId }) => (
                <Select id={inputId} {...form.register("tone")}>
                  <option value="authoritative">Authoritative</option>
                  <option value="direct">Direct</option>
                  <option value="educational">Educational</option>
                  <option value="aspirational">Aspirational</option>
                </Select>
              )}
            </FormField>
            <FormField label="Number of variants">
              {({ inputId }) => (
                <Input id={inputId} type="number" min={1} max={8} {...form.register("variants", { valueAsNumber: true })} />
              )}
            </FormField>

            <div className="md:col-span-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-700" size={17} />
                <strong className="text-sm text-emerald-900">Brand-policy precheck</strong>
              </div>
              <p className="mb-0 mt-1 text-xs text-emerald-800">
                Claims must be linked to evidence. Unsupported guarantees, prohibited claims and destructive competitor language are blocked before draft generation.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-growth-line pt-5 md:col-span-2">
              <Button type="button" variant="secondary" onClick={() => setBuilderOpen(false)}>Cancel</Button>
              <Button type="submit"><Sparkles size={16} /> Generate {variantCount} drafts</Button>
            </div>
          </form>
        </Panel>
      )}

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Active variants" value="126" detail="+18 this week" icon={<Image size={18} />} />
        <MetricCard label="Winning messages" value="14" detail="+3 newly verified" />
        <MetricCard label="Fatigued patterns" value={String(fatigueCount + 5)} detail="-4 vs prior week" />
        <MetricCard label="Brand-rule coverage" value="100%" detail={brandSafe ? "Precheck enabled" : "Review required"} icon={<ShieldCheck size={18} />} />
      </section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1fr_.85fr]">
        <Panel className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <span className="section-kicker">CREATIVE GENOME</span>
              <h2>What attributes are driving outcomes</h2>
            </div>
            <StatusBadge tone="accent">Learning continuously</StatusBadge>
          </div>

          <div className="grid gap-3">
            {genomeSignals.map(([pattern, lift, note]) => (
              <div key={pattern} className="grid gap-2 rounded-xl border border-growth-line p-4 sm:grid-cols-[1fr_90px_180px] sm:items-center">
                <strong className="text-sm">{pattern}</strong>
                <strong className={lift.startsWith("+") ? "text-sm text-emerald-700" : "text-sm text-red-700"}>{lift}</strong>
                <span className="text-xs text-growth-muted">{note}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <Palette className="text-violet-700" size={20} />
            <div>
              <span className="section-kicker">BRAND GOVERNOR</span>
              <h2>Creative guardrails</h2>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              ["Evidence-backed claims", "Required", "success"],
              ["Approved visual system", "Enforced", "success"],
              ["Competitor naming", "Review", "warning"],
              ["Pricing claims", "Approval required", "warning"],
              ["External publishing", "Approval required", "warning"]
            ].map(([rule, state, tone]) => (
              <div key={rule} className="flex items-center justify-between gap-3 rounded-lg border border-growth-line p-3">
                <span className="text-xs font-semibold text-growth-ink">{rule}</span>
                <StatusBadge tone={tone as "success" | "warning"}>{state}</StatusBadge>
              </div>
            ))}
          </div>

          <label className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-xs">
            <input type="checkbox" checked={brandSafe} onChange={(event) => setBrandSafe(event.target.checked)} />
            Run brand-policy precheck on every generated draft
          </label>
        </Panel>
      </section>

      <Panel className="p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="section-kicker">DRAFT VARIANTS</span>
            <h2>Generated workbench</h2>
          </div>
          <StatusBadge tone={drafts.length ? "warning" : "neutral"}>
            {drafts.length ? drafts.length + " unpublished drafts" : "No new drafts"}
          </StatusBadge>
        </div>

        {drafts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-growth-line p-8 text-center">
            <Sparkles className="mx-auto text-slate-400" size={26} />
            <strong className="mt-3 block text-sm">Generate a concept to create governed drafts.</strong>
            <p className="mx-auto mb-0 mt-1 max-w-lg text-xs text-growth-muted">
              GrowthOS will use the Creative Genome, audience evidence and brand rules to prepare variants here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-3">
            {drafts.map((draft) => (
              <article key={draft.id} className="rounded-xl border border-growth-line p-4">
                <div className="flex items-start justify-between gap-2">
                  <StatusBadge tone="accent">{draft.angle}</StatusBadge>
                  <StatusBadge tone="warning">Draft</StatusBadge>
                </div>
                <h3 className="mt-4">{draft.headline}</h3>
                <p className="mb-0 text-xs">{draft.body}</p>
                <div className="mt-4 border-t border-growth-line pt-3">
                  <span className="text-[11px] text-slate-400">{draft.id}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {drafts.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button variant="secondary"><Plus size={15} /> Add to experiment</Button>
            <Button><CheckCircle2 size={15} /> Prepare selected drafts for approval</Button>
          </div>
        )}
      </Panel>
    </>
  );
}
