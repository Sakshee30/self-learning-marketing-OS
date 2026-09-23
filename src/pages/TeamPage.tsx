import { Plus, ShieldCheck, UserRoundCog } from "lucide-react";
import { Badge, Button, PageHeader } from "../components/Ui";
import { roleDefinitions } from "../rbac";

const members = [
  ["Sakshee", "sakshee@northstarlabs.demo", "Workspace Owner", "Active"],
  ["Arjun Mehta", "arjun@northstarlabs.demo", "Workspace Admin", "Active"],
  ["Maya Singh", "maya@northstarlabs.demo", "Marketing Manager", "Active"],
  ["Kabir Roy", "kabir@northstarlabs.demo", "Analyst", "Active"],
  ["Nisha Rao", "nisha@northstarlabs.demo", "Approver", "Invited"]
];

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="WORKSPACE SECURITY"
        title="Team, Roles & Permissions"
        description="Least-privilege access for every workspace. Separate who can analyze, create, approve, administer and control the SaaS platform."
        actions={<Button><Plus size={16} /> Invite member</Button>}
      />

      <div className="role-grid">
        {roleDefinitions.filter((role) => role.role !== "super_admin").map((role) => (
          <article className="panel role-card" key={role.role}>
            <div className="role-card-icon"><UserRoundCog size={18} /></div>
            <h3>{role.name}</h3>
            <p>{role.description}</p>
            <div className="permission-count"><ShieldCheck size={15} /> {role.permissions.length} permission groups</div>
          </article>
        ))}
      </div>

      <article className="panel table-panel">
        <div className="panel-head">
          <div><span className="section-kicker">MEMBERS</span><h2>Workspace access</h2></div>
          <Badge tone="accent">5 seats</Badge>
        </div>
        <div className="table-wrap borderless">
          <table>
            <thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Last active</th></tr></thead>
            <tbody>
              {members.map(([name, email, role, status], index) => (
                <tr key={email}>
                  <td><div className="person-cell"><span className="avatar mini">{name.split(" ").map((part) => part[0]).join("").slice(0,2)}</span><div><strong>{name}</strong><small>{email}</small></div></div></td>
                  <td>{role}</td>
                  <td><Badge tone={status === "Active" ? "success" : "warning"}>{status}</Badge></td>
                  <td>{index === 4 ? "—" : index === 0 ? "Now" : index + 2 + "h ago"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
