import { useState } from "react";
import { Plus, ShieldCheck, UserRoundCog, X } from "lucide-react";
import { roleDefinitions } from "../../../rbac";
import { Button, FormField, Input, Panel, Select, StatusBadge } from "../../../shared/ui";
import { useZodForm } from "../../../shared/forms/useZodForm";
import { inviteMemberSchema, type InviteMemberInput } from "../schemas/team.schema";

type PreviewInvite = InviteMemberInput & { id:string; state:"Pending backend invitation" };

const members=[
  ["Sakshee","sakshee@northstarlabs.demo","Workspace Owner","Active","Now"],
  ["Arjun Mehta","arjun@northstarlabs.demo","Workspace Admin","Active","2h ago"],
  ["Maya Singh","maya@northstarlabs.demo","Marketing Manager","Active","3h ago"],
  ["Kabir Roy","kabir@northstarlabs.demo","Analyst","Active","4h ago"],
  ["Nisha Rao","nisha@northstarlabs.demo","Approver","Invited","—"]
] as const;

export default function TeamPage(){
  const [inviteOpen,setInviteOpen]=useState(false);
  const [invites,setInvites]=useState<PreviewInvite[]>([]);
  const form=useZodForm<InviteMemberInput>(inviteMemberSchema,{defaultValues:{email:"",role:"viewer"}});

  const submit=form.handleSubmit(values=>{
    setInvites(current=>[{...values,id:"INV-PREVIEW-"+String(current.length+1).padStart(3,"0"),state:"Pending backend invitation"},...current]);
    setInviteOpen(false);
    form.reset();
  });

  return (
    <>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl"><span className="section-kicker">WORKSPACE SECURITY</span><h1>Team, Roles & Permissions</h1><p className="mt-3">Use least-privilege workspace access. Analysis, creation, approval and administration remain separate responsibilities, while platform operations live in the separate control application.</p></div>
        <Button onClick={()=>setInviteOpen(true)}><Plus size={16}/> Invite member</Button>
      </header>

      {inviteOpen&&<Panel className="mb-5 overflow-hidden border-violet-200">
        <div className="flex items-start justify-between gap-4 border-b border-violet-100 bg-violet-50 p-5"><div><span className="section-kicker">INVITE MEMBER</span><h2>Stage a workspace invitation</h2><p className="mb-0 text-xs">The browser validates the intent. The identity service must issue and deliver the real invitation.</p></div><button className="icon-button" onClick={()=>setInviteOpen(false)} aria-label="Close invitation form"><X size={18}/></button></div>
        <form onSubmit={submit} className="grid gap-5 p-5 md:grid-cols-2">
          <FormField label="Work email" required error={form.formState.errors.email?.message}>{({inputId,errorId})=><Input id={inputId} type="email" aria-describedby={errorId} {...form.register("email")}/>}</FormField>
          <FormField label="Role">{({inputId})=><Select id={inputId} {...form.register("role")}><option value="admin">Workspace Admin</option><option value="marketing_manager">Marketing Manager</option><option value="analyst">Analyst</option><option value="approver">Approver</option><option value="viewer">Viewer</option></Select>}</FormField>
          <div className="md:col-span-2 flex justify-end gap-2 border-t border-growth-line pt-4"><Button type="button" variant="secondary" onClick={()=>setInviteOpen(false)}>Cancel</Button><Button type="submit">Stage invitation</Button></div>
        </form>
      </Panel>}

      {invites.length>0&&<div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4"><strong className="text-sm text-violet-900">{invites[0]?.email} invitation intent staged</strong><p className="mb-0 mt-1 text-xs text-violet-800">No email or identity record has been created until the backend confirms the invitation.</p></div>}

      <section className="mb-4 grid gap-3 lg:grid-cols-3">
        {roleDefinitions.filter(role=>role.role!=="super_admin").map(role=><Panel className="p-4" key={role.role}><div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-violet-700"><UserRoundCog size={17}/></span><div><strong className="text-sm">{role.name}</strong><p className="mb-0 mt-1 text-xs">{role.description}</p></div></div><div className="mt-3 flex items-center gap-2 text-xs text-growth-muted"><ShieldCheck size={14}/>{role.permissions.length} permission groups</div></Panel>)}
      </section>

      <Panel className="p-5"><div className="mb-4 flex items-start justify-between gap-3"><div><span className="section-kicker">WORKSPACE MEMBERS</span><h2>Current access</h2></div><StatusBadge tone="accent">{members.length+invites.length} seats represented</StatusBadge></div>
        <div className="overflow-x-auto"><table><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Last active</th></tr></thead><tbody>
          {invites.map(item=><tr key={item.id}><td><strong>{item.email}</strong><div className="text-[11px] text-slate-400">{item.id}</div></td><td>{item.role.replaceAll("_"," ")}</td><td><StatusBadge tone="warning">{item.state}</StatusBadge></td><td>—</td></tr>)}
          {members.map(([name,email,role,status,last])=><tr key={email}><td><strong>{name}</strong><div className="text-[11px] text-slate-400">{email}</div></td><td>{role}</td><td><StatusBadge tone={status==="Active"?"success":"warning"}>{status}</StatusBadge></td><td>{last}</td></tr>)}
        </tbody></table></div>
      </Panel>
    </>
  );
}
