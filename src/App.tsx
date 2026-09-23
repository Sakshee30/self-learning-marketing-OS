import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
import { hasPermission } from "./rbac";
import { LoadingState } from "./shared/ui";
import type { Permission, Role } from "./types";

const OnboardingPage = lazy(() => import("./features/onboarding/OnboardingPage"));
const WorldModelPage = lazy(() => import("./features/world-model/pages/WorldModelPage"));
const CampaignsPage = lazy(() => import("./features/campaigns/pages/CampaignsPage"));
const IntegrationsPage = lazy(() => import("./features/integrations/pages/IntegrationsPage"));
const DigitalTwinPage = lazy(() => import("./features/digital-twin/pages/DigitalTwinPage"));

const moduleRoutes: Array<{ path: string; permission?: Permission }> = [
  { path: "/opportunities" },
  { path: "/revenue" },
  { path: "/customers" },
  { path: "/market" },
  { path: "/creative", permission: "creative.write" },
  { path: "/organic" },
  { path: "/social" },
  { path: "/lifecycle" },
  { path: "/experiences" },
  { path: "/experiments" },
  { path: "/agents" },
  { path: "/memory" },
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

function LazyBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingState label="Loading workspace module…" />}>{children}</Suspense>;
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

        <Route
          path="/onboarding"
          element={<LazyBoundary><OnboardingPage /></LazyBoundary>}
        />
        <Route
          path="/launchpad"
          element={<PermissionGate role={role} permission="workspace.manage"><LaunchpadPage /></PermissionGate>}
        />
        <Route path="/command" element={<CommandCenter />} />

        <Route
          path="/world-model"
          element={<LazyBoundary><WorldModelPage /></LazyBoundary>}
        />
        <Route
          path="/campaigns"
          element={
            <PermissionGate role={role} permission="campaigns.write">
              <LazyBoundary><CampaignsPage /></LazyBoundary>
            </PermissionGate>
          }
        />
        <Route
          path="/data"
          element={
            <PermissionGate role={role} permission="data.manage">
              <LazyBoundary><IntegrationsPage /></LazyBoundary>
            </PermissionGate>
          }
        />
        <Route
          path="/digital-twin"
          element={<LazyBoundary><DigitalTwinPage /></LazyBoundary>}
        />

        <Route
          path="/approvals"
          element={<PermissionGate role={role} permission="approvals.decide"><ApprovalsPage /></PermissionGate>}
        />
        <Route
          path="/automations"
          element={<PermissionGate role={role} permission="automation.write"><AutomationsPage /></PermissionGate>}
        />
        <Route
          path="/audit"
          element={<PermissionGate role={role} permission="governance.manage"><AuditPage /></PermissionGate>}
        />
        <Route
          path="/team"
          element={<PermissionGate role={role} permission="team.manage"><TeamPage /></PermissionGate>}
        />
        <Route
          path="/settings"
          element={<PermissionGate role={role} permission="workspace.manage"><SettingsPage /></PermissionGate>}
        />
        <Route
          path="/super-admin"
          element={role === "super_admin" ? <SuperAdminPage /> : <Navigate to="/command" replace />}
        />

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
