"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db, Workspace, TeamMember, WORKSPACE, TEAM, EVENTS, METRICS } from "../../lib/db";

const NAV = [
  { href: "/app", label: "Overview", icon: "▦" },
  { href: "/app/events", label: "Events", icon: "⚡" },
  { href: "/app/metrics", label: "Metrics", icon: "◎" },
  { href: "/app/funnels", label: "Funnels", icon: "⇄" },
  { href: "/app/team", label: "Team", icon: "◈" },
  { href: "/app/settings", label: "Settings", icon: "⚙" },
];

function seedAll() {
  db.seed<Workspace>(WORKSPACE, [
    {
      name: "Acme Analytics",
      plan: "growth",
      writeKey: "wk_demo_7f3a9c2e1b4d8f6a",
      timezone: "UTC",
      eventsThisMonth: 1_240_580,
      eventsLimit: 25_000_000,
    },
  ]);

  db.seed<TeamMember>(TEAM, [
    { name: "Jane Doe", email: "jane@acme.com", role: "admin", status: "active", avatar: "JD" },
    { name: "Ravi Mehta", email: "ravi@acme.com", role: "member", status: "active", avatar: "RM" },
    { name: "Sofia Torres", email: "sofia@acme.com", role: "viewer", status: "invited", avatar: "ST" },
  ]);

  const now = Date.now();
  const NAMES = ["page_viewed", "button_clicked", "signup_started", "signup_completed", "dashboard_created", "funnel_saved", "export_started", "user_identified"];
  const USERS = ["usr_a1b2c3", "usr_d4e5f6", "usr_g7h8i9", "usr_j0k1l2", "usr_m3n4o5"];
  if (db.list(EVENTS).length === 0) {
    for (let i = 59; i >= 0; i--) {
      const count = Math.floor(Math.random() * 4) + 1;
      for (let j = 0; j < count; j++) {
        const eventName = NAMES[Math.floor(Math.random() * NAMES.length)];
        const userId = USERS[Math.floor(Math.random() * USERS.length)];
        localStorage.setItem(
          `lumio_db_events`,
          JSON.stringify([
            ...(JSON.parse(localStorage.getItem("lumio_db_events") ?? "[]")),
            {
              id: Math.random().toString(36).slice(2),
              createdAt: now - i * 3_600_000 - Math.random() * 3_600_000,
              updatedAt: now - i * 3_600_000,
              name: eventName,
              userId,
              source: "sdk",
              properties: eventName === "page_viewed" ? { url: ["/", "/pricing", "/docs", "/blog"][Math.floor(Math.random() * 4)] } : {},
            },
          ])
        );
      }
    }
  }

  db.seed(METRICS, [
    { name: "Daily Active Users", description: "Unique users per day", eventName: "page_viewed", aggregation: "unique_users", propertyKey: "", period: "day", goal: 500 },
    { name: "Signups", description: "Completed sign-up flow", eventName: "signup_completed", aggregation: "count", propertyKey: "", period: "week", goal: 50 },
    { name: "Dashboards created", description: "New dashboards per week", eventName: "dashboard_created", aggregation: "count", propertyKey: "", period: "week", goal: 20 },
  ]);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ws, setWs] = useState<Workspace | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    seedAll();
    const workspaces = db.list<Workspace>(WORKSPACE);
    setWs(workspaces[0] ?? null);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f8f9fb" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 56 : 220,
        flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid #e6e9ef",
        display: "flex",
        flexDirection: "column",
        transition: "width .2s",
        overflow: "hidden",
      }}>
        {/* Brand */}
        <div style={{ padding: collapsed ? "16px 14px" : "16px 18px", borderBottom: "1px solid #e6e9ef", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#4f46e5,#8b5cf6)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>L</span>
            {!collapsed && <span style={{ fontWeight: 700, fontSize: 15, color: "#0b1220" }}>Lumio</span>}
          </a>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 14, padding: 2, flexShrink: 0 }}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/app" && pathname?.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: collapsed ? "9px 14px" : "9px 12px",
                  borderRadius: 9,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#4f46e5" : "#334155",
                  background: active ? "#eef2ff" : "transparent",
                  transition: "background .12s, color .12s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </a>
            );
          })}
        </nav>

        {/* Workspace badge */}
        {ws && !collapsed && (
          <div style={{ padding: "12px 14px", borderTop: "1px solid #e6e9ef", fontSize: 12 }}>
            <p style={{ fontWeight: 600, color: "#0b1220", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ws.name}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
              <span style={{ color: "#64748b", textTransform: "capitalize" }}>{ws.plan} plan</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header style={{ height: 56, background: "#fff", borderBottom: "1px solid #e6e9ef", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {NAV.find((n) => n.href === pathname || (n.href !== "/app" && pathname?.startsWith(n.href)))?.label ?? "Lumio App"}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 13 }}
              onClick={() => (window as any).shubpy?.open?.()}
            >
              💬 Support
            </button>
            <a href="/account" style={{ width: 32, height: 32, borderRadius: "50%", background: "#eef2ff", border: "2px solid #c7d2fe", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, color: "#4f46e5", textDecoration: "none" }}>
              {ws?.name?.[0] ?? "A"}
            </a>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto", padding: "28px 28px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
