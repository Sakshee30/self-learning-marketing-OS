import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Database,
  Globe2,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import { Button, FormField, Input, MetricCard, Panel, Select, StatusBadge } from "../../shared/ui";
import { useZodForm } from "../../shared/forms/useZodForm";
import { useWorkspaceStore } from "../../shared/store/workspaceStore";
import { useAuthStore } from "../auth/store/authStore";
import {
  companyProfileSchema,
  growthSetupSchema,
  type CompanyProfileInput,
  type GrowthSetupInput
} from "./schemas/onboarding.schema";
import { readOnboardingPreview, writeOnboardingPreview } from "./previewState";

const steps = [
  "Company",
  "Data",
  "Business",
  "Goals",
  "Autonomy",
  "Approvals",
  "Review"
] as const;

const connectionOptions = [
  ["Website & product analytics", "Events, sessions, conversions and product usage"],
  ["CRM & pipeline", "Leads, accounts, opportunities and revenue outcomes"],
  ["Google Ads", "Spend, campaigns, search terms and conversions"],
  ["Meta Ads", "Campaigns, audiences, creatives and conversion signals"],
  ["Email & lifecycle", "Journeys, engagement, suppression and revenue"],
  ["WhatsApp", "Lead conversations, templates and lifecycle actions"]
] as const;

const autonomyRules = [
  ["Research & analysis", "Autonomous", "Observe, analyze and recommend without approval."],
  ["Opportunity detection", "Autonomous", "Find and rank growth opportunities continuously."],
  ["Campaign & creative drafting", "Autonomous", "Create plans and drafts without external publishing."],
  ["Budget, bid or spend changes", "Approval required", "Human approval is required before material financial changes."],
  ["External publishing", "Approval required", "Ads, pages, social posts and lifecycle messages remain governed."],
  ["New customer communication", "Approval required", "Outbound contact must be explicitly approved."],
  ["Destructive or irreversible actions", "Blocked", "Deletion and irreversible production actions are not autonomous."]
] as const;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const initialPreview = useMemo(() => readOnboardingPreview(), []);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(() => Math.min(Math.max(initialPreview.currentStep, 0), steps.length - 1));
  const [connected, setConnected] = useState<string[]>(() =>
    initialPreview.connectedSystems.length
      ? initialPreview.connectedSystems
      : [
          "Website & product analytics",
          "CRM & pipeline",
          "Google Ads",
          "Meta Ads"
        ]
  );

  const companyForm = useZodForm<CompanyProfileInput>(companyProfileSchema, {
    defaultValues: initialPreview.companyDraft ?? {
      organizationName: "Northstar Labs",
      workspaceName: "Production",
      website: "https://example.com",
      businessModel: "b2b_saas",
      primaryMarket: "US & India",
      timezone: "Asia/Kolkata",
      currency: "USD"
    }
  });

  const growthForm = useZodForm<GrowthSetupInput>(growthSetupSchema, {
    defaultValues: initialPreview.growthDraft ?? {
      objective: "Grow qualified pipeline while protecting contribution margin",
      target: "$5M qualified pipeline",
      horizonDays: 90,
      maxCac: 420,
      spendCeiling: 180000,
      grossMargin: 72
    }
  });

  const progress = Math.round(((step + 1) / steps.length) * 100);
  const company = companyForm.watch();
  const growth = growthForm.watch();

  useEffect(() => {
    writeOnboardingPreview({
      completed: false,
      currentStep: step,
      completedSteps: Array.from(steps.slice(0, step)),
      connectedSystems: connected,
      companyDraft: company,
      growthDraft: growth,
      updatedAt: new Date().toISOString()
    });
  }, [company, connected, growth, step]);


  const readiness = useMemo(() => {
    const evidence = Math.min(100, 40 + connected.length * 10);
    return {
      setup: progress,
      evidence,
      approval: 100
    };
  }, [connected.length, progress]);

  async function next() {
    if (step === 0) {
      const valid = await companyForm.trigger();
      if (!valid) return;
    }

    if (step === 3) {
      const valid = await growthForm.trigger();
      if (!valid) return;
    }

    setStep((current) => Math.min(steps.length - 1, current + 1));
  }

  function back() {
    setStep((current) => Math.max(0, current - 1));
  }

  function toggleConnection(name: string) {
    setConnected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  }

  function complete() {
    writeOnboardingPreview({
      completed: true,
      currentStep: steps.length - 1,
      completedSteps: [...steps],
      connectedSystems: connected,
      companyDraft: company,
      growthDraft: growth,
      updatedAt: new Date().toISOString()
    });
    setWorkspace("org-northstar", "ws-production");
    completeOnboarding();
    navigate("/launchpad", { replace: true });
  }

  return (
    <div className="mx-auto max-w-[1480px]">
      <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="section-kicker">SAAS ONBOARDING</span>
          <h1>Teach GrowthOS how your business works.</h1>
          <p className="mt-3">
            Configure the company, evidence sources, economic boundaries and approval policy once.
            The AI uses this context to build the initial Business World Model and operating plan.
          </p>
        </div>
        <StatusBadge tone="accent">{progress}% configured</StatusBadge>
      </header>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <MetricCard label="Setup progress" value={readiness.setup + "%"} detail={`${step + 1} of ${steps.length} stages`} />
        <MetricCard label="Evidence readiness" value={readiness.evidence + "%"} detail={`${connected.length} systems selected`} />
        <MetricCard label="Approval coverage" value={readiness.approval + "%"} detail="Material actions remain governed" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[250px_minmax(0,1fr)]">
        <Panel className="h-fit p-3">
          <nav aria-label="Onboarding progress" className="grid gap-1">
            {steps.map((label, index) => {
              const active = index === step;
              const completeStep = index < step;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => index <= step && setStep(index)}
                  className={[
                    "flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm transition",
                    active ? "bg-violet-50 font-semibold text-violet-800" : "text-slate-600 hover:bg-slate-50",
                    index > step ? "cursor-default opacity-55" : ""
                  ].join(" ")}
                  aria-current={active ? "step" : undefined}
                >
                  <span className={[
                    "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
                    completeStep ? "bg-emerald-100 text-emerald-700" : active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"
                  ].join(" ")}>
                    {completeStep ? <Check size={14} /> : index + 1}
                  </span>
                  {label}
                </button>
              );
            })}
          </nav>
        </Panel>

        <Panel className="min-h-[560px] p-6 md:p-8">
          {step === 0 && (
            <section>
              <div className="mb-6 flex items-start gap-3">
                <Globe2 className="mt-1 text-violet-600" size={22} />
                <div>
                  <h2>Company and workspace</h2>
                  <p>Establish the organization and first tenant workspace the user will operate inside.</p>
                </div>
              </div>

              <form className="grid gap-5 md:grid-cols-2">
                <FormField label="Organization name" required error={companyForm.formState.errors.organizationName?.message}>
                  {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...companyForm.register("organizationName")} />}
                </FormField>
                <FormField label="Workspace name" required error={companyForm.formState.errors.workspaceName?.message}>
                  {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...companyForm.register("workspaceName")} />}
                </FormField>
                <FormField label="Company website" required error={companyForm.formState.errors.website?.message}>
                  {({ inputId, errorId }) => <Input id={inputId} type="url" aria-describedby={errorId} {...companyForm.register("website")} />}
                </FormField>
                <FormField label="Business model" required>
                  {({ inputId }) => (
                    <Select id={inputId} {...companyForm.register("businessModel")}>
                      <option value="b2b_saas">B2B SaaS</option>
                      <option value="b2c">B2C</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="marketplace">Marketplace</option>
                      <option value="services">Services</option>
                      <option value="other">Other</option>
                    </Select>
                  )}
                </FormField>
                <FormField label="Primary market" required error={companyForm.formState.errors.primaryMarket?.message}>
                  {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...companyForm.register("primaryMarket")} />}
                </FormField>
                <FormField label="Timezone">
                  {({ inputId }) => (
                    <Select id={inputId} {...companyForm.register("timezone")}>
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="UTC">UTC</option>
                    </Select>
                  )}
                </FormField>
              </form>
            </section>
          )}

          {step === 1 && (
            <section>
              <div className="mb-6 flex items-start gap-3">
                <Database className="mt-1 text-violet-600" size={22} />
                <div>
                  <h2>Connect the evidence fabric</h2>
                  <p>Select the systems GrowthOS should learn from. OAuth/API authorization is completed by the backend integration layer later.</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {connectionOptions.map(([name, detail]) => {
                  const selected = connected.includes(name);
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => toggleConnection(name)}
                      aria-pressed={selected}
                      className={[
                        "rounded-xl border p-4 text-left transition",
                        selected ? "border-violet-300 bg-violet-50" : "border-growth-line bg-white hover:border-slate-300"
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <strong className="block text-sm text-growth-ink">{name}</strong>
                          <span className="mt-1 block text-xs leading-5 text-growth-muted">{detail}</span>
                        </div>
                        {selected ? <CheckCircle2 className="text-violet-600" size={20} /> : <span className="h-5 w-5 rounded-full border border-slate-300" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <div className="mb-6 flex items-start gap-3">
                <Sparkles className="mt-1 text-violet-600" size={22} />
                <div>
                  <h2>Business World Model seed</h2>
                  <p>Confirm the commercial facts that strategy, simulation and agent decisions must respect.</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["Business model", company.businessModel.replaceAll("_", " ")],
                  ["Primary market", company.primaryMarket],
                  ["Workspace", company.workspaceName],
                  ["Evidence systems", String(connected.length)],
                  ["Data posture", "First-party evidence preferred"],
                  ["Decision posture", "Evidence-backed + governed"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-growth-line bg-slate-50/60 p-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                    <strong className="mt-2 block text-sm capitalize text-growth-ink">{value}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 p-4">
                <strong className="text-sm text-violet-900">World Model behavior</strong>
                <p className="mb-0 mt-1 text-xs text-violet-800">
                  GrowthOS will continuously challenge assumptions against connected revenue, customer, market and experiment evidence rather than treating onboarding answers as permanent truth.
                </p>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <div className="mb-6 flex items-start gap-3">
                <Target className="mt-1 text-violet-600" size={22} />
                <div>
                  <h2>Define the outcome the AI owns</h2>
                  <p>The AI should optimize toward a business result while respecting economic and spend boundaries.</p>
                </div>
              </div>

              <form className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField label="Primary business objective" required error={growthForm.formState.errors.objective?.message}>
                    {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...growthForm.register("objective")} />}
                  </FormField>
                </div>
                <FormField label="Target" required error={growthForm.formState.errors.target?.message}>
                  {({ inputId, errorId }) => <Input id={inputId} aria-describedby={errorId} {...growthForm.register("target")} />}
                </FormField>
                <FormField label="Time horizon (days)">
                  {({ inputId }) => <Input id={inputId} type="number" {...growthForm.register("horizonDays", { valueAsNumber: true })} />}
                </FormField>
                <FormField label="Maximum CAC">
                  {({ inputId }) => <Input id={inputId} type="number" {...growthForm.register("maxCac", { valueAsNumber: true })} />}
                </FormField>
                <FormField label="Monthly spend ceiling">
                  {({ inputId }) => <Input id={inputId} type="number" {...growthForm.register("spendCeiling", { valueAsNumber: true })} />}
                </FormField>
                <FormField label="Gross margin (%)">
                  {({ inputId }) => <Input id={inputId} type="number" {...growthForm.register("grossMargin", { valueAsNumber: true })} />}
                </FormField>
              </form>
            </section>
          )}

          {step === 4 && (
            <section>
              <div className="mb-6 flex items-start gap-3">
                <Sparkles className="mt-1 text-violet-600" size={22} />
                <div>
                  <h2>Set AI autonomy</h2>
                  <p>Low-risk cognition can run continuously. Consequential execution stays behind policy and approval boundaries.</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-growth-line">
                <table>
                  <thead><tr><th>Action class</th><th>Default mode</th><th>Boundary</th></tr></thead>
                  <tbody>
                    {autonomyRules.map(([action, mode, policy]) => (
                      <tr key={action}>
                        <td><strong>{action}</strong></td>
                        <td><StatusBadge tone={mode === "Autonomous" ? "success" : mode === "Blocked" ? "danger" : "warning"}>{mode}</StatusBadge></td>
                        <td>{policy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {step === 5 && (
            <section>
              <div className="mb-6 flex items-start gap-3">
                <ShieldCheck className="mt-1 text-violet-600" size={22} />
                <div>
                  <h2>Approval and safety policy</h2>
                  <p>GrowthOS must explain evidence and expected impact before an authorized human approves material actions.</p>
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  ["Money", "Budget, bid, spend and pricing changes", "Owner / Approver"],
                  ["Brand", "External publishing and new creative activation", "Marketing Manager / Approver"],
                  ["Customer", "New outbound communication or lifecycle activation", "Approver"],
                  ["Production", "Website, tracking or integration production changes", "Admin / Owner"],
                  ["Irreversible", "Destructive operations", "Blocked by default"]
                ].map(([area, scope, authority]) => (
                  <div key={area} className="grid gap-3 rounded-xl border border-growth-line p-4 md:grid-cols-[120px_1fr_180px] md:items-center">
                    <strong className="text-sm">{area}</strong>
                    <span className="text-xs leading-5 text-growth-muted">{scope}</span>
                    <StatusBadge tone={authority === "Blocked by default" ? "danger" : "warning"}>{authority}</StatusBadge>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 6 && (
            <section>
              <div className="mb-6 flex items-start gap-3">
                <CheckCircle2 className="mt-1 text-emerald-600" size={22} />
                <div>
                  <h2>Ready to initialize the marketing OS</h2>
                  <p>Review the operating contract before GrowthOS begins building the initial plan and World Model.</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["Organization", company.organizationName],
                  ["Workspace", company.workspaceName],
                  ["Primary objective", growth.objective],
                  ["Target", growth.target],
                  ["Evidence systems", String(connected.length)],
                  ["Maximum CAC", String(growth.maxCac)],
                  ["Spend ceiling", String(growth.spendCeiling)],
                  ["Approval policy", "Governed material execution"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-growth-line bg-slate-50/60 p-4">
                    <span className="text-xs font-semibold text-growth-muted">{label}</span>
                    <strong className="mt-1 block text-sm text-growth-ink">{value}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                Completing setup does not publish campaigns, change spend or contact customers. It creates the governed workspace context and allows the AI to research, model and prepare recommendations.
              </div>
            </section>
          )}

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-growth-line pt-5">
            <Button variant="secondary" onClick={back} disabled={step === 0}>
              <ArrowLeft size={16} /> Back
            </Button>

            {step < steps.length - 1 ? (
              <Button onClick={() => void next()}>
                Continue <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={complete}>
                <Sparkles size={16} /> Initialize GrowthOS
              </Button>
            )}
          </footer>
        </Panel>
      </div>
    </div>
  );
}
