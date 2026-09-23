import {
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  Play,
  Radar,
  ShieldCheck
} from "lucide-react";
import type { GovernedDecisionStage } from "./types";

const stages = [
  { id: "proposed", label: "Proposed", icon: BrainCircuit },
  { id: "simulated", label: "Simulated", icon: Radar },
  { id: "approval_required", label: "Approval required", icon: BadgeCheck },
  { id: "approval_intent_submitted", label: "Intent submitted", icon: ShieldCheck }
] as const satisfies ReadonlyArray<{
  id: GovernedDecisionStage;
  label: string;
  icon: typeof BrainCircuit;
}>;

const stageIndex: Record<GovernedDecisionStage, number> = {
  proposed: 0,
  simulated: 1,
  approval_required: 2,
  approval_intent_submitted: 3
};

export function DecisionJourney({ stage }: { stage: GovernedDecisionStage }) {
  const activeIndex = stageIndex[stage];

  return (
    <ol className="grid gap-2 md:grid-cols-4" aria-label="Governed decision journey">
      {stages.map((item, index) => {
        const Icon = item.icon;
        const completed = index < activeIndex;
        const active = index === activeIndex;

        return (
          <li
            key={item.id}
            className={[
              "rounded-xl border p-3",
              completed
                ? "border-emerald-200 bg-emerald-50"
                : active
                  ? "border-violet-300 bg-violet-50"
                  : "border-growth-line bg-white"
            ].join(" ")}
          >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white shadow-sm">
                {completed ? <CheckCircle2 className="text-emerald-700" size={16} /> : <Icon className={active ? "text-violet-700" : "text-slate-400"} size={16} />}
              </span>
              <div>
                <span className="type-overline text-slate-400">STEP {index + 1}</span>
                <strong className="block text-sm text-growth-ink">{item.label}</strong>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function GovernedExecutionLegend() {
  return (
    <div className="grid gap-2 rounded-xl border border-growth-line bg-slate-50/70 p-3 sm:grid-cols-3">
      <div className="flex items-center gap-2">
        <Radar className="text-violet-700" size={15} />
        <span className="type-caption">Simulation is forecast only.</span>
      </div>
      <div className="flex items-center gap-2">
        <BadgeCheck className="text-amber-700" size={15} />
        <span className="type-caption">Approval is a separate authority step.</span>
      </div>
      <div className="flex items-center gap-2">
        <Play className="text-slate-700" size={15} />
        <span className="type-caption">Execution waits for backend confirmation.</span>
      </div>
    </div>
  );
}
