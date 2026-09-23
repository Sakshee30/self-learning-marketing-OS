import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BadgeCheck,
  Bell,
  Bot,
  BrainCircuit,
  Cable,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  Command,
  CreditCard,
  FlaskConical,
  Globe2,
  LogOut,
  Megaphone,
  Menu,
  MessageCircleMore,
  Palette,
  PanelsTopLeft,
  Radar,
  ScanSearch,
  Search,
  SearchCheck,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  Telescope,
  UserRoundCog,
  Users,
  Workflow,
  X,
  Zap,
  type LucideIcon
} from "lucide-react";
import { navItems } from "../data";
import { useWorkspaceScope } from "../features/workspace/hooks/useWorkspaceScope";
import { AiCommandPalette } from "../features/command-center/components/AiCommandPalette";
import { hasPermission, roleDefinitions, roleLabel } from "../rbac";
import type { Role } from "../types";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Globe2,
  Telescope,
  ChartNoAxesCombined,
  Users,
  Radar,
  Megaphone,
  Palette,
  SearchCheck,
  MessageCircleMore,
  Workflow,
  PanelsTopLeft,
  FlaskConical,
  Zap,
  Bot,
  BadgeCheck,
  BrainCircuit,
  ScanSearch,
  Cable,
  ShieldCheck,
  UserRoundCog,
  CreditCard,
  Settings2,
  Shield
};

function initials(name: string) {
  const value = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return value || "GO";
}

export function Shell({
  role,
  onRoleChange,
  userName,
  onSignOut,
  children
}: {
  role: Role;
  onRoleChange: (role: Role) => void;
  userName: string;
  onSignOut: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();
  const { organization, workspace, workspaces, switching, switchWorkspace } = useWorkspaceScope();

  const visibleItems = useMemo(
    () =>
      navItems.filter((item) => {
        if (item.roles && !item.roles.includes(role)) return false;
        return hasPermission(role, item.permission);
      }),
    [role]
  );

  const sections = Array.from(new Set(visibleItems.map((item) => item.section)));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="app-shell">
      <aside className={"sidebar " + (open ? "mobile-open" : "")}>
        <div className="brand-row">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <div className="brand-copy">
            <strong>GrowthOS</strong>
            <span>Self-learning marketing</span>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X size={19} />
          </button>
        </div>

        <button className="ask-ai" type="button" onClick={() => setCommandOpen(true)}>
          <Command size={17} />
          <span>Ask AI CMO</span>
          <kbd>⌘ K</kbd>
        </button>

        <nav className="nav-scroll" aria-label="Primary workspace navigation">
          {sections.map((section) => (
            <div className="nav-section" key={section}>
              <span className="nav-title">{section}</span>
              {visibleItems
                .filter((item) => item.section === section)
                .map((item) => {
                  const Icon = iconMap[item.icon] ?? Bot;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => "nav-item " + (isActive ? "active" : "")}
                    >
                      <Icon size={17} />
                      <span>{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </NavLink>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="autonomy-card">
            <div className="autonomy-head">
              <span>Autonomy mode</span>
              <span className="status-dot" />
            </div>
            <strong>Governed execution</strong>
            <p>AI can plan and draft. Material actions require approval.</p>
          </div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu size={20} />
            </button>

            <div className="relative">
              <button
                type="button"
                className="workspace-switcher rounded-lg px-1 py-1 text-left hover:bg-white"
                onClick={() => setWorkspaceOpen((value) => !value)}
                aria-expanded={workspaceOpen}
                aria-haspopup="menu"
              >
                <div className="workspace-logo">{initials(organization?.name ?? "GrowthOS").slice(0, 1)}</div>
                <div>
                  <strong>{organization?.name ?? "Workspace"}</strong>
                  <span>{switching ? "Switching workspace…" : (workspace?.name ?? "Resolving workspace")}</span>
                </div>
                <ChevronDown size={15} />
              </button>

              {workspaceOpen && (
                <div className="absolute left-0 top-12 z-50 w-72 rounded-xl border border-growth-line bg-white p-2 shadow-xl" role="menu">
                  <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Workspaces
                  </div>
                  {workspaces.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50"
                      onClick={() => {
                        setWorkspaceOpen(false);
                        void switchWorkspace(item.id);
                      }}
                    >
                      <div>
                        <strong className="block text-sm text-growth-ink">{item.name}</strong>
                        <span className="block text-xs capitalize text-growth-muted">{item.plan} · {item.status.replace("_", " ")}</span>
                      </div>
                      {item.id === workspace?.id ? <Check className="text-violet-600" size={17} /> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="topbar-center">
            <Search size={17} />
            <input aria-label="Search" placeholder="Search customers, campaigns, decisions..." readOnly onFocus={() => setCommandOpen(true)} />
            <kbd>⌘ /</kbd>
          </div>

          <div className="topbar-right">
            <button className="icon-button notification" aria-label="Notifications">
              <Bell size={18} />
              <span />
            </button>
            <div className="role-menu-wrap">
              <button className="profile-button" onClick={() => setRoleOpen((value) => !value)} aria-expanded={roleOpen}>
                <span className="avatar">{initials(userName)}</span>
                <span className="profile-copy">
                  <strong>{userName}</strong>
                  <small>{roleLabel(role)}</small>
                </span>
                <ChevronDown size={15} />
              </button>
              {roleOpen && (
                <div className="role-menu">
                  <div className="role-menu-heading">Preview permissions as</div>
                  {roleDefinitions.filter((item) => item.role !== "super_admin").map((item) => (
                    <button
                      key={item.role}
                      className={role === item.role ? "selected" : ""}
                      onClick={() => {
                        onRoleChange(item.role);
                        setRoleOpen(false);
                      }}
                    >
                      <span>{item.name}</span>
                      <small>{item.description}</small>
                    </button>
                  ))}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setRoleOpen(false);
                      onSignOut();
                    }}
                  >
                    <span className="flex items-center gap-2"><LogOut size={14} /> Sign out</span>
                    <small>End the current frontend preview session.</small>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="page-wrap" key={location.pathname}>{children}</main>
      </div>
      {open && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <AiCommandPalette open={commandOpen} onOpenChange={setCommandOpen} items={visibleItems} />
    </div>
  );
}
