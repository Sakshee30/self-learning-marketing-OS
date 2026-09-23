import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import CommandCenter from "./pages/CommandCenter";
import AuthPage from "./pages/AuthPage";
import LaunchpadPage from "./pages/LaunchpadPage";
import { useAuthStore } from "./features/auth/store/authStore";
import { useSessionLifecycle } from "./compositions/session/useSessionLifecycle";
import { hasPermission } from "./rbac";
import { LoadingState } from "./shared/ui";
import type { Permission, Role } from "./types";

const OnboardingPage = lazy(() => import("./features/onboarding/OnboardingPage"));
const AiCmoPage = lazy(() => import("./features/ai-cmo/pages/AiCmoPage"));
const WorldModelPage = lazy(() => import("./features/world-model/pages/WorldModelPage"));
const CampaignsPage = lazy(() => import("./features/campaigns/pages/CampaignsPage"));
const IntegrationsPage = lazy(() => import("./features/integrations/pages/IntegrationsPage"));
const DigitalTwinPage = lazy(() => import("./features/digital-twin/pages/DigitalTwinPage"));
const CreativeStudioPage = lazy(() => import("./features/creative/pages/CreativeStudioPage"));
const ExperimentsPage = lazy(() => import("./features/experiments/pages/ExperimentsPage"));
const ApprovalsPage = lazy(() => import("./features/approvals/pages/ApprovalsPage"));
const OpportunitiesPage = lazy(() => import("./features/opportunities/pages/OpportunitiesPage"));
const RevenuePage = lazy(() => import("./features/revenue/pages/RevenuePage"));
const CustomersPage = lazy(() => import("./features/customers/pages/CustomersPage"));
const MarketPage = lazy(() => import("./features/market/pages/MarketPage"));
const OrganicPage = lazy(() => import("./features/organic/pages/OrganicPage"));
const SocialPage = lazy(() => import("./features/social/pages/SocialPage"));
const LifecyclePage = lazy(() => import("./features/lifecycle/pages/LifecyclePage"));
const ExperiencesPage = lazy(() => import("./features/experiences/pages/ExperiencesPage"));
const AgentsPage = lazy(() => import("./features/agents/pages/AgentsPage"));
const AutomationsPage = lazy(() => import("./features/automations/pages/AutomationsPage"));
const MemoryPage = lazy(() => import("./features/memory/pages/MemoryPage"));
const GovernancePage = lazy(() => import("./features/governance/pages/GovernancePage"));
const BillingPage = lazy(() => import("./features/billing/pages/BillingPage"));
const TeamPage = lazy(() => import("./features/team/pages/TeamPage"));
const SettingsPage = lazy(() => import("./features/settings/pages/SettingsPage"));
const AuditPage = lazy(() => import("./features/audit/pages/AuditPage"));

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
  const [role, setRole] = useState<Role>(() => {
    const stored = localStorage.getItem("growthos-role") as Role | null;
    return !stored || stored === "super_admin" ? "owner" : stored;
  });
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const onboardingRequired = useAuthStore((state) => state.onboardingRequired);
  const { signOut } = useSessionLifecycle();

  useEffect(() => {
    localStorage.setItem("growthos-role", role);
  }, [role]);

  if (status !== "authenticated") {
    return <AnonymousRoutes />;
  }

  if (onboardingRequired) {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
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
        <Route path="/ai-cmo" element={<LazyBoundary><AiCmoPage /></LazyBoundary>} />

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
          path="/creative"
          element={
            <PermissionGate role={role} permission="creative.write">
              <LazyBoundary><CreativeStudioPage /></LazyBoundary>
            </PermissionGate>
          }
        />
        <Route
          path="/experiments"
          element={<LazyBoundary><ExperimentsPage /></LazyBoundary>}
        />
        <Route path="/opportunities" element={<LazyBoundary><OpportunitiesPage /></LazyBoundary>} />
        <Route path="/revenue" element={<LazyBoundary><RevenuePage /></LazyBoundary>} />
        <Route path="/customers" element={<LazyBoundary><CustomersPage /></LazyBoundary>} />
        <Route path="/market" element={<LazyBoundary><MarketPage /></LazyBoundary>} />
        <Route path="/organic" element={<LazyBoundary><OrganicPage /></LazyBoundary>} />
        <Route path="/social" element={<LazyBoundary><SocialPage /></LazyBoundary>} />
        <Route path="/lifecycle" element={<LazyBoundary><LifecyclePage /></LazyBoundary>} />
        <Route path="/experiences" element={<LazyBoundary><ExperiencesPage /></LazyBoundary>} />
        <Route path="/agents" element={<LazyBoundary><AgentsPage /></LazyBoundary>} />
        <Route
          path="/automations"
          element={
            <PermissionGate role={role} permission="automation.write">
              <LazyBoundary><AutomationsPage /></LazyBoundary>
            </PermissionGate>
          }
        />
        <Route path="/memory" element={<LazyBoundary><MemoryPage /></LazyBoundary>} />
        <Route
          path="/governance"
          element={
            <PermissionGate role={role} permission="governance.manage">
              <LazyBoundary><GovernancePage /></LazyBoundary>
            </PermissionGate>
          }
        />
        <Route
          path="/billing"
          element={
            <PermissionGate role={role} permission="billing.manage">
              <LazyBoundary><BillingPage /></LazyBoundary>
            </PermissionGate>
          }
        />

        <Route
          path="/approvals"
          element={
            <PermissionGate role={role} permission="approvals.decide">
              <LazyBoundary><ApprovalsPage /></LazyBoundary>
            </PermissionGate>
          }
        />
        <Route
          path="/audit"
          element={
            <PermissionGate role={role} permission="governance.manage">
              <LazyBoundary><AuditPage /></LazyBoundary>
            </PermissionGate>
          }
        />
        <Route
          path="/team"
          element={
            <PermissionGate role={role} permission="team.manage">
              <LazyBoundary><TeamPage /></LazyBoundary>
            </PermissionGate>
          }
        />
        <Route
          path="/settings"
          element={
            <PermissionGate role={role} permission="workspace.manage">
              <LazyBoundary><SettingsPage /></LazyBoundary>
            </PermissionGate>
          }
        />
        <Route path="*" element={<Navigate to="/command" replace />} />
      </Routes>
    </Shell>
  );
}
