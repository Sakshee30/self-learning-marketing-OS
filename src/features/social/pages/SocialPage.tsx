import { useState } from "react";
import { CalendarDays, MessageCircleMore, Plus, Sparkles, Users } from "lucide-react";
import { Button, Input, MetricCard, Panel, StatusBadge } from "../../../shared/ui";

type DraftPost = { id: string; channel: string; copy: string; state: "Draft" | "Approval required" };

const planned = [
  ["LinkedIn", "Operator pain → autonomous workflow", "Tomorrow 10:00", "Approval required"],
  ["YouTube", "How GrowthOS decision receipts work", "Thu 16:00", "Draft"],
  ["LinkedIn", "Revenue proof case-study thread", "Fri 11:30", "Approval required"],
  ["Instagram", "Before/after campaign operating loop", "Fri 18:00", "Draft"]
] as const;

export default function SocialPage() {
  const [idea, setIdea] = useState("");
  const [drafts, setDrafts] = useState<DraftPost[]>([]);

  function createDraft() {
    const copy = idea.trim() || "Show how a governed AI CMO moves from evidence to a measurable growth decision.";
    setDrafts((current) => [{
      id: "SOC-" + String(current.length + 1).padStart(3,"0"),
      channel: "LinkedIn",
      copy,
      state: "Approval required"
    }, ...current]);
    setIdea("");
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <span className="section-kicker">SOCIAL OPERATING SYSTEM</span>
          <h1>Social & Creator Growth</h1>
          <p className="mt-3">
            Plan, draft, approve and learn across brand, executive and creator channels while connecting engagement back to qualified site behavior and revenue outcomes.
          </p>
        </div>
        <Button onClick={createDraft}><Plus size={16} /> Draft social post</Button>
      </header>

      <section className="mb-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Qualified engagement" value="18.4K" detail="+22%" icon={<MessageCircleMore size={18} />} />
        <MetricCard label="Creator revenue" value="$84K" detail="+18%" icon={<Users size={18} />} />
        <MetricCard label="Content velocity" value="42/wk" detail="+7 posts" />
        <MetricCard label="Approval queue" value="6" detail="External publishing governed" />
      </section>

      <section className="mb-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel className="p-5">
          <div className="mb-4 flex items-center gap-2"><CalendarDays size={19} className="text-violet-700" /><span className="section-kicker mb-0">CONTENT PLANNER</span></div>
          <h2>Upcoming content</h2>
          <div className="mt-4 grid gap-3">
            {drafts.map((post) => (
              <div key={post.id} className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                <div className="flex items-start justify-between gap-3"><strong className="text-sm">{post.channel}</strong><StatusBadge tone="warning">{post.state}</StatusBadge></div>
                <p className="mb-0 mt-2 text-xs">{post.copy}</p>
              </div>
            ))}
            {planned.map(([channel,topic,time,state]) => (
              <div key={channel+topic} className="grid gap-2 rounded-xl border border-growth-line p-4 md:grid-cols-[100px_1fr_130px_130px] md:items-center">
                <strong className="text-sm">{channel}</strong><span className="text-xs text-growth-muted">{topic}</span><span className="text-xs">{time}</span><StatusBadge tone={state === "Approval required" ? "warning" : "accent"}>{state}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="h-fit p-5">
          <div className="flex items-center gap-2"><Sparkles size={18} className="text-violet-700" /><span className="section-kicker mb-0">AI SOCIAL BRIEF</span></div>
          <h2 className="mt-3">Draft from audience truth</h2>
          <p>Customer-operator content is generating 2.1× more qualified site visits than product-announcement posts.</p>
          <Input value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Idea, proof point or customer pain" />
          <Button className="mt-3 w-full" onClick={createDraft}>Create governed draft</Button>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <Panel className="p-5">
          <span className="section-kicker">CREATOR PROGRAM</span><h2>Revenue-linked creators</h2>
          <div className="mt-4 overflow-x-auto"><table><thead><tr><th>Creator</th><th>Qualified visits</th><th>Pipeline</th><th>Efficiency</th></tr></thead><tbody>
            {[
              ["GrowthOps Weekly","3,842","$31K","Strong"],
              ["RevLab","2,941","$24K","Strong"],
              ["B2B Systems","1,482","$17K","Learning"]
            ].map(([name,visits,pipeline,state]) => <tr key={name}><td><strong>{name}</strong></td><td>{visits}</td><td>{pipeline}</td><td><StatusBadge tone={state==="Strong"?"success":"accent"}>{state}</StatusBadge></td></tr>)}
          </tbody></table></div>
        </Panel>

        <Panel className="p-5">
          <span className="section-kicker">LISTENING</span><h2>Emerging buyer language</h2>
          <div className="mt-4 grid gap-3">
            {["replace manual reporting","AI marketing team","human approval for agents","prove incremental revenue"].map((phrase,index)=>(
              <div key={phrase} className="flex items-center justify-between rounded-lg border border-growth-line p-3"><span className="text-xs font-semibold">{phrase}</span><StatusBadge tone={index<2?"warning":"accent"}>{index<2?"Rising":"Relevant"}</StatusBadge></div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  );
}
