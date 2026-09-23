import { useState } from "react";
import { BellRing, Globe2, KeyRound, Save, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Button, FormField, Input, Panel, Select, StatusBadge } from "../../../shared/ui";
import { useZodForm } from "../../../shared/forms/useZodForm";
import { workspaceSettingsSchema, type WorkspaceSettingsInput } from "../schemas/settings.schema";

export default function SettingsPage(){
  const [saveIntent,setSaveIntent]=useState<WorkspaceSettingsInput|null>(null);
  const form=useZodForm<WorkspaceSettingsInput>(workspaceSettingsSchema,{defaultValues:{
    name:"Production",
    region:"ap-south-1",
    currency:"USD",
    timezone:"Asia/Kolkata",
    draftAutomatically:true,
    requireExternalApproval:true,
    requireRollback:true,
    approvalNotifications:true,
    materialKpiNotifications:true
  }});

  const submit=form.handleSubmit(values=>setSaveIntent(values));

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><span className="section-kicker">WORKSPACE</span><h1>Workspace Settings</h1><p className="mt-3">Configure regional defaults, autonomy posture, notifications and identity policy for the current tenant. The frontend stages changes; security-critical enforcement remains authoritative on the backend.</p></div><Button onClick={()=>void submit()}><Save size={16}/> Stage settings update</Button></header>

      {saveIntent&&<div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4"><strong className="text-sm text-violet-900">Settings update staged</strong><p className="mb-0 mt-1 text-xs text-violet-800">Workspace “{saveIntent.name}” has a pending frontend change intent. No backend configuration has been changed yet.</p></div>}

      <form onSubmit={submit} className="grid gap-4 xl:grid-cols-2">
        <Panel className="p-5"><div className="mb-5 flex items-start gap-3"><Globe2 size={19} className="mt-0.5 text-violet-700"/><div><h2>Workspace profile</h2><p className="mb-0 text-xs">Region, currency and reporting defaults.</p></div></div>
          <div className="grid gap-4 md:grid-cols-2"><div className="md:col-span-2"><FormField label="Workspace name">{({inputId})=><Input id={inputId} {...form.register("name")}/>}</FormField></div><FormField label="Primary region">{({inputId})=><Select id={inputId} {...form.register("region")}><option value="ap-south-1">India — Mumbai</option><option value="us-east-1">United States — Virginia</option><option value="eu-west-1">Europe — Ireland</option></Select>}</FormField><FormField label="Currency">{({inputId})=><Select id={inputId} {...form.register("currency")}><option>USD</option><option>INR</option><option>EUR</option><option>GBP</option></Select>}</FormField><div className="md:col-span-2"><FormField label="Timezone">{({inputId})=><Input id={inputId} {...form.register("timezone")}/>}</FormField></div></div>
        </Panel>

        <Panel className="p-5"><div className="mb-5 flex items-start gap-3"><SlidersHorizontal size={19} className="mt-0.5 text-violet-700"/><div><h2>Autonomy defaults</h2><p className="mb-0 text-xs">Default posture for new agents and workflows.</p></div></div>
          <div className="grid gap-3">{[
            ["draftAutomatically","Draft automatically","Agents may prepare plans and content without external execution."],
            ["requireExternalApproval","Require approval for external actions","Publishing, spend and new customer communication stay gated."],
            ["requireRollback","Require rollback support","Production changes need a reversible execution plan."]
          ].map(([field,label,detail])=><label key={field} className="flex items-start justify-between gap-4 rounded-lg border border-growth-line p-3"><span><strong className="block text-xs">{label}</strong><span className="mt-1 block text-xs text-growth-muted">{detail}</span></span><input type="checkbox" {...form.register(field as keyof WorkspaceSettingsInput)}/></label>)}</div>
        </Panel>

        <Panel className="p-5"><div className="mb-5 flex items-start gap-3"><BellRing size={19} className="mt-0.5 text-violet-700"/><div><h2>Notifications</h2><p className="mb-0 text-xs">Operational and approval awareness.</p></div></div>
          <div className="grid gap-3"><label className="flex items-center justify-between rounded-lg border border-growth-line p-3"><span className="text-xs font-semibold">Approval requests</span><input type="checkbox" {...form.register("approvalNotifications")}/></label><label className="flex items-center justify-between rounded-lg border border-growth-line p-3"><span className="text-xs font-semibold">Material KPI changes</span><input type="checkbox" {...form.register("materialKpiNotifications")}/></label><div className="flex items-center justify-between rounded-lg border border-growth-line p-3"><span className="text-xs font-semibold">Agent incidents</span><StatusBadge tone="warning">Critical immediately</StatusBadge></div></div>
        </Panel>

        <Panel className="p-5"><div className="mb-5 flex items-start gap-3"><KeyRound size={19} className="mt-0.5 text-violet-700"/><div><h2>Identity & access</h2><p className="mb-0 text-xs">Preview of backend-enforced identity policies.</p></div></div>
          <div className="grid gap-3">{[["Multi-factor authentication","Required for owners, admins and approvers","Required"],["Single sign-on","SAML / OIDC enterprise configuration","Configure"],["Session timeout","12 hours; re-auth for sensitive actions","Policy"],["Sensitive approval step-up","Fresh authentication before high-risk decisions","Required"]].map(([label,detail,state])=><div key={label} className="flex items-start justify-between gap-3 rounded-lg border border-growth-line p-3"><span><strong className="block text-xs">{label}</strong><span className="mt-1 block text-xs text-growth-muted">{detail}</span></span><StatusBadge tone={state==="Required"?"success":"accent"}>{state}</StatusBadge></div>)}</div>
        </Panel>

        <div className="xl:col-span-2 flex justify-end"><Button type="submit"><ShieldCheck size={16}/> Validate & stage update</Button></div>
      </form>
    </>
  );
}
