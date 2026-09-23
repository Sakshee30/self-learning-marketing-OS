import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { Shell } from "./components/Shell";
import CommandCenter from "./pages/CommandCenter";
import ApprovalsPage from "./pages/ApprovalsPage";
import AutomationsPage from "./pages/AutomationsPage";
import TeamPage from "./pages/TeamPage";
import SuperAdminPage from "./pages/SuperAdminPage";
import ModulePage from "./pages/ModulePage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import LaunchpadPage from "./pages/LaunchpadPage";
import AuditPage from "./pages/AuditPage";
import { useAuthStore } from "./features/auth/store/authStore";
import OnboardingPage from "./features/onboarding/OnboardingPage";
import { hasPermission } from "./rbac";
import type { Permission, Role } from "./types";

const moduleRoutes: Array<{ path: string; permission?: Permission }> = [
  { path: "/world-model" },
  { path: "/opportunities" },
  { path: "/revenue" },
  { path: "/customers" },
  { path: "/market" },
  { path: "/campaigns", permission: "campaigns.write" },
  { path: "/creative", permission: "creative.write" },
  { path: "/organic" },
  { path: "/social" },
  { path: "/lifecycle" },
  { path: "/experiences" },
  { path: "/experiments" },
  { path: "/agents" },
  { path: "/memory" },
  { path: "/digital-twin" },
  { path: "/data", permission: "data.manage" },
  { path: "/governance", permission: "governance.manage" },
  { path: "/billing", permission: "billing.manage" }
];

function PermissionGate({
  role,
  permission,
  children
}: {
  role: Role;
  permission: Permission;
  children: ReactNode;
}) {
  return hasPermission(role, permission) ? <>{children}</> : <Navigate to="/command" replace />;
}

function AnonymousRoutes() {
  return (
    <Routes>
      <Route path="/auth/sign-in" element={<AuthPage mode="sign-in" />} />
      <Route path="/auth/sign-up" element={<AuthPage mode="sign-up" />} />
      <Route path="/auth/forgot-password" element={<AuthPage mode="forgot-password" />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>(() => (localStorage.getItem("growthos-role") as Role) || "owner");
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    localStorage.setItem("growthos-role", role);
  }, [role]);

  if (status !== "authenticated") {
    return <AnonymousRoutes />;
  }

  return (
    <Shell
      role={role}
      onRoleChange={setRole}
      userName={user?.displayName ?? "GrowthOS user"}
      onSignOut={signOut}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/launchpad" replace />} />
        <Route path="/auth/*" element={<Navigate to="/launchpad" replace />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/launchpad" element={<PermissionGate role={role} permission="workspace.manage"><LaunchpadPage /></PermissionGate>} />
        <Route path="/command" element={<CommandCenter />} />
        <Route path="/approvals" element={<PermissionGate role={role} permission="approvals.decide"><ApprovalsPage /></PermissionGate>} />
        <Route path="/automations" element={<PermissionGate role={role} permission="automation.write"><AutomationsPage /></PermissionGate>} />
        <Route path="/audit" element={<PermissionGate role={role} permission="governance.manage"><AuditPage /></PermissionGate>} />
        <Route path="/team" element={<PermissionGate role={role} permission="team.manage"><TeamPage /></PermissionGate>} />
        <Route path="/settings" element={<PermissionGate role={role} permission="workspace.manage"><SettingsPage /></PermissionGate>} />
        <Route path="/super-admin" element={role === "super_admin" ? <SuperAdminPage /> : <Navigate to="/command" replace />} />
        {moduleRoutes.map(({ path, permission }) => (
          <Route
            key={path}
            path={path}
            element={
              permission
                ? <PermissionGate role={role} permission={permission}><ModulePage path={path} /></PermissionGate>
                : <ModulePage path={path} />
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/command" replace />} />
      </Routes>
    </Shell>
  );
}
