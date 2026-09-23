export type Role =
  | "super_admin"
  | "owner"
  | "admin"
  | "marketing_manager"
  | "analyst"
  | "approver"
  | "viewer";

export type Permission =
  | "workspace.manage"
  | "team.manage"
  | "billing.manage"
  | "campaigns.write"
  | "creative.write"
  | "automation.write"
  | "analytics.view"
  | "approvals.decide"
  | "data.manage"
  | "governance.manage"
  | "platform.manage";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  section: string;
  permission?: Permission | undefined;
  roles?: Role[] | undefined;
  badge?: string | undefined;
}

export interface Kpi {
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down" | "flat";
  hint: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  description: string;
  agent: string;
  impact: string;
  risk: "Low" | "Medium" | "High";
  status: "Pending" | "Approved" | "Rejected";
  requestedAt: string;
}

export interface Agent {
  name: string;
  domain: string;
  status: "Running" | "Waiting" | "Learning";
  autonomy: "Observe" | "Draft" | "Approval required";
  actions: number;
  outcome: string;
}

export interface ActivityItem {
  time: string;
  actor: string;
  action: string;
  result: string;
}

export interface RoleDefinition {
  role: Role;
  name: string;
  description: string;
  permissions: Permission[];
}
