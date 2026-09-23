import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { Shell } from "./components/Shell";
import CommandCenter from "./pages/CommandCenter";
import ApprovalsPage from "./pages/ApprovalsPage";
import AutomationsPage from "./pages/AutomationsPage";
import TeamPage from "./pages/TeamPage";
import SuperAdminPage from "./pages/SuperAdminPage";
import ModulePage from "./pages/ModulePage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import type { Role } from "./types";

const moduleRoutes = [
  "/world-model",
  "/opportunities",
  "/revenue",
  "/customers",
  "/market",
  "/campaigns",
  "/creative",
  "/organic",
  "/social",
  "/lifecycle",
  "/experiences",
  "/experiments",
  "/agents",
  "/memory",
  "/digital-twin",
  "/data",
  "/governance",
  "/billing"
];

export default function App() {
  const [role, setRole] = useState<Role>(() => (localStorage.getItem("growthos-role") as Role) || "owner");
  const [signedIn, setSignedIn] = useState(() => sessionStorage.getItem("growthos-demo-auth") === "true");

  useEffect(() => {
    localStorage.setItem("growthos-role", role);
  }, [role]);

  function enterDemo() {
    sessionStorage.setItem("growthos-demo-auth", "true");
    setSignedIn(true);
  }

  if (!signedIn) {
    return <Routes><Route path="*" element={<AuthPage onEnter={enterDemo} />} /></Routes>;
  }

  return (
    <Shell role={role} onRoleChange={setRole}>
      <Routes>
        <Route path="/" element={<Navigate to="/command" replace />} />
        <Route path="/command" element={<CommandCenter />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/automations" element={<AutomationsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/super-admin" element={role === "super_admin" ? <SuperAdminPage /> : <Navigate to="/command" replace />} />
        {moduleRoutes.map((path) => <Route key={path} path={path} element={<ModulePage path={path} />} />)}
        <Route path="*" element={<Navigate to="/command" replace />} />
      </Routes>
    </Shell>
  );
}
