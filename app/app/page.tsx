"use client";

import { useEffect, useState } from "react";
import { db, AppEvent, Metric, TeamMember, Workspace, EVENTS, METRICS, TEAM, WORKSPACE } from "../../lib/db";

interface Stats {
  totalEvents: number;
  uniqueUsers: number;
  topEvent: string;
  teamSize: number;
  eventsToday: number;
  metricsCount: number;
  ws: Workspace | null;
}

function MiniBarChart({ data, color = "#4f46e5" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 44 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.max(4, (v / max) * 100)}%`,
            background: i === data.length - 1 ? color : `${color}55`,
            borderRadius: "2px 2px 0 0",
            minHeight: 4,
          }}
        />
      ))}
    </div>
  );
}

export default function AppOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEvents, setRecentEvents] = useState<AppEvent[]>([]);
  const [hourlyData, setHourlyData] = useState<number[]>([]);

  useEffect(() => {
    const events = db.list<AppEvent>(EVENTS);
    const metrics = db.list<Metric>(METRICS);
    const team = db.list<TeamMember>(TEAM);
    const ws = db.list<Workspace>(WORKSPACE)[0] ?? null;

    const now = Date.now();
    const todayStart = now - 86_400_000;
    const eventsToday = events.filter((e) => e.createdAt > todayStart);
    const uniqueUsers = new Set(events.map((e) => e.userId)).size;

    const eventCounts: Record<string, number> = {};
    events.forEach((e) => { eventCounts[e.name] = (eventCounts[e.name] ?? 0) + 1; });
    const topEvent = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    // Hourly buckets for last 24h
    const hourly = Array(24).fill(0);
    eventsToday.forEach((e) => {
      const hoursAgo = Math.floor((now - e.createdAt) / 3_600_000);
      if (hoursAgo >= 0 && hoursAgo < 24) hourly[23 - hoursAgo]++;
    });

    setStats({
      totalEvents: events.length,
      uniqueUsers,
      topEvent,
      teamSize: team.length,
      eventsToday: eventsToday.length,
      metricsCount: metrics.length,
      ws,
    });
    setRecentEvents([...events].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8));
    setHourlyData(hourly);

    (window as any).shubpy?.track?.("app_overview_viewed");
  }, []);

  if (!stats) return <div style={{ color: "#94a3b8" }}>Loading…</div>;

  const { ws } = stats;
  const usagePct = ws ? Math.min(100, (ws.eventsThisMonth / ws.eventsLimit) * 100) : 0;

  const kpis = [
    { label: "Total events", value: stats.totalEvents.toLocaleString(), sub: `${stats.eventsToday} today`, color: "#4f46e5" },
    { label: "Unique users", value: stats.uniqueUsers.toLocaleString(), sub: "all time", color: "#16a34a" },
    { label: "Top event", value: stats.topEvent, sub: "most frequent", color: "#d97706" },
    { label: "Team members", value: stats.teamSize.toString(), sub: `${stats.metricsCount} metrics defined`, color: "#7c3aed" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1220", margin: 0 }}>Overview</h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>{ws?.name ?? "Workspace"} · last 60 hours of data</p>
        </div>
        <a href="/app/events" className="btn btn-primary btn-sm">+ Send event</a>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "20px 22px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>{kpi.label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: kpi.color, margin: "0 0 4px", fontVariantNumeric: "tabular-nums" }}>{kpi.value}</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Event activity chart */}
      <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: 0 }}>Event activity</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>events per hour, last 24h</p>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#4f46e5" }}>{stats.eventsToday} today</span>
        </div>
        <MiniBarChart data={hourlyData} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
          <span>24h ago</span><span>12h ago</span><span>now</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent events */}
        <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: 0 }}>Recent events</p>
            <a href="/app/events" style={{ fontSize: 13, color: "#4f46e5", textDecoration: "none" }}>View all →</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {recentEvents.map((ev) => (
              <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4f46e5", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.name}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{ev.userId}</p>
                </div>
                <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>
                  {Math.round((Date.now() - ev.createdAt) / 60000)}m ago
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage + quick actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Usage */}
          <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "20px 22px" }}>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 12px" }}>Monthly usage</p>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: "#334155" }}>{ws?.eventsThisMonth?.toLocaleString() ?? 0} events</span>
              <span style={{ color: "#94a3b8" }}>of {ws?.eventsLimit?.toLocaleString() ?? 0}</span>
            </div>
            <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${usagePct}%`, background: usagePct > 80 ? "#f59e0b" : "#4f46e5", borderRadius: 4, transition: "width .4s" }} />
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "8px 0 0" }}>
              {(100 - usagePct).toFixed(1)}% remaining · resets in ~{30 - new Date().getDate()} days
            </p>
          </div>

          {/* Quick actions */}
          <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "20px 22px" }}>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 12px" }}>Quick actions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Send a test event", href: "/app/events" },
                { label: "Define a metric", href: "/app/metrics" },
                { label: "Build a funnel", href: "/app/funnels" },
                { label: "Invite team member", href: "/app/team" },
              ].map((a) => (
                <a key={a.href} href={a.href} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, color: "#334155", textDecoration: "none", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
                  {a.label}
                  <span style={{ color: "#94a3b8" }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
