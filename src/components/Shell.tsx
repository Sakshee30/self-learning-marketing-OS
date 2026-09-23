import { useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BadgeCheck,
  Bell,
  Bot,
  BrainCircuit,
  Cable,
  ChartNoAxesCombined,
  ChevronDown,
  Command,
  CreditCard,
  FlaskConical,
  Globe2,
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

export function Shell({
  role,
  onRoleChange,
  children
}: {
  role: Role;
  onRoleChange: (role: Role) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const location = useLocation();

  const visibleItems = useMemo(
    () =>
      navItems.filter((item) => {
        if (item.roles && !item.roles.includes(role)) return false;
        return hasPermission(role, item.permission);
      }),
    [role]
  );

  const sections = Array.from(new Set(visibleItems.map((item) => item.section)));

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

        <button className="ask-ai">
          <Command size={17} />
          <span>Ask AI CMO</span>
          <kbd>⌘ K</kbd>
        </button>

        <nav className="nav-scroll">
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
            <div className="workspace-switcher">
              <div className="workspace-logo">N</div>
              <div>
                <strong>Northstar Labs</strong>
                <span>Production workspace</span>
              </div>
              <ChevronDown size={15} />
            </div>
          </div>

          <div className="topbar-center">
            <Search size={17} />
            <input aria-label="Search" placeholder="Search customers, campaigns, decisions..." />
            <kbd>⌘ /</kbd>
          </div>

          <div className="topbar-right">
            <button className="icon-button notification" aria-label="Notifications">
              <Bell size={18} />
              <span />
            </button>
            <div className="role-menu-wrap">
              <button className="profile-button" onClick={() => setRoleOpen((value) => !value)}>
                <span className="avatar">SK</span>
                <span className="profile-copy">
                  <strong>Sakshee</strong>
                  <small>{roleLabel(role)}</small>
                </span>
                <ChevronDown size={15} />
              </button>
              {roleOpen && (
                <div className="role-menu">
                  <div className="role-menu-heading">Preview permissions as</div>
                  {roleDefinitions.map((item) => (
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
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="page-wrap" key={location.pathname}>{children}</main>
      </div>
      {open && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    </div>
  );
}
