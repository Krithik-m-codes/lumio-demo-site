"use client";

import { useState, useEffect } from "react";
import { db, Workspace, WORKSPACE, EVENTS, METRICS, TEAM } from "../../../lib/db";

export default function SettingsPage() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [form, setForm] = useState({ name: "", timezone: "", plan: "growth" });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "api" | "danger">("general");
  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const w = db.list<Workspace>(WORKSPACE)[0];
    if (w) {
      setWs(w);
      setForm({ name: w.name, timezone: w.timezone, plan: w.plan });
    }
    (window as any).shubpy?.track?.("settings_page_viewed");
  }, []);

  const saveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;
    db.update<Workspace>(WORKSPACE, ws.id, { name: form.name, timezone: form.timezone, plan: form.plan as any });
    setWs({ ...ws, ...form, plan: form.plan as any });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(ws?.writeKey ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAllData = () => {
    if (!window.confirm("This will delete ALL demo data (events, metrics, funnels, team). Are you sure?")) return;
    db.clear(EVENTS);
    db.clear(METRICS);
    db.clear(TEAM);
    db.clear("funnels");
    db.clear(WORKSPACE);
    window.location.href = "/app";
  };

  const eventCount = db.list(EVENTS).length;
  const metricCount = db.list(METRICS).length;
  const teamCount = db.list(TEAM).length;

  const tabs = [
    { key: "general" as const, label: "General" },
    { key: "api" as const, label: "API & SDK" },
    { key: "danger" as const, label: "Danger zone" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1220", margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>Workspace configuration and API access.</p>
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e6e9ef", marginBottom: 4 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{ padding: "10px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? "#4f46e5" : "#64748b", borderBottom: `2px solid ${activeTab === tab.key ? "#4f46e5" : "transparent"}`, transition: "all .15s" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div style={{ maxWidth: 560 }}>
          <form onSubmit={saveGeneral} style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: 0, fontSize: 16 }}>Workspace details</p>

            <div className="form-group">
              <label>Workspace name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Workspace" />
            </div>

            <div className="form-group">
              <label>Timezone</label>
              <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}>
                {["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney"].map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Plan</label>
              <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                <option value="starter">Starter (free)</option>
                <option value="growth">Growth ($99/mo)</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <span className="hint">Changing this updates the sidebar badge and usage limits.</span>
            </div>

            {saved && <div className="alert alert-success" style={{ padding: "10px 14px" }}>✓ Settings saved.</div>}

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>Save changes</button>
          </form>

          {/* Data summary */}
          <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "20px 26px", marginTop: 16 }}>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 14px", fontSize: 16 }}>Workspace data</p>
            {[
              { label: "Events logged", value: eventCount, href: "/app/events" },
              { label: "Metrics defined", value: metricCount, href: "/app/metrics" },
              { label: "Team members", value: teamCount, href: "/app/team" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 14, color: "#334155" }}>{row.label}</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#4f46e5" }}>{row.value}</span>
                  <a href={row.href} style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>View →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "api" && (
        <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "24px 26px" }}>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 6px", fontSize: 16 }}>Write key</p>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px" }}>Use this key to authenticate SDK and API calls. Keep it secret — treat it like a password.</p>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <code style={{ flex: 1, background: "#f8fafc", border: "1px solid #e6e9ef", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "monospace", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {keyVisible ? (ws?.writeKey ?? "—") : "wk_demo_••••••••••••••••"}
              </code>
              <button className="btn btn-ghost btn-sm" onClick={() => setKeyVisible(!keyVisible)}>{keyVisible ? "Hide" : "Show"}</button>
              <button className="btn btn-ghost btn-sm" onClick={copyKey}>{copied ? "Copied!" : "Copy"}</button>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "24px 26px" }}>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 16px", fontSize: 16 }}>Quick integration</p>
            <div style={{ background: "#0f172a", borderRadius: 10, padding: "16px 18px", overflow: "auto" }}>
              <pre style={{ margin: 0, fontSize: 12, color: "#e2e8f0", fontFamily: "monospace", lineHeight: 1.6 }}>{`// 1. Install
npm install @lumio/browser

// 2. Initialise
import { lumio } from '@lumio/browser'
lumio.init('${ws?.writeKey ?? "wk_demo_..."}')

// 3. Identify users
lumio.identify('user-id', {
  email: 'jane@example.com',
  plan: '${ws?.plan ?? "growth"}'
})

// 4. Track events
lumio.track('dashboard_created', {
  template: 'blank'
})`}</pre>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "24px 26px" }}>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 6px", fontSize: 16 }}>REST API</p>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 14px" }}>Send events directly via HTTP. Useful for server-side or non-JS environments.</p>
            <div style={{ background: "#0f172a", borderRadius: 10, padding: "16px 18px", overflow: "auto" }}>
              <pre style={{ margin: 0, fontSize: 12, color: "#e2e8f0", fontFamily: "monospace", lineHeight: 1.6 }}>{`POST https://api.lumio.io/v1/track
Authorization: Bearer ${keyVisible ? (ws?.writeKey ?? "wk_demo_...") : "wk_demo_••••••••"}
Content-Type: application/json

{
  "event": "purchase_completed",
  "userId": "usr_abc123",
  "properties": {
    "plan": "growth",
    "amount": 99
  }
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === "danger" && (
        <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", border: "1.5px solid #fecaca", borderRadius: 14, padding: "22px 24px" }}>
            <p style={{ fontWeight: 700, color: "#dc2626", margin: "0 0 8px", fontSize: 16 }}>Reset all demo data</p>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 18px" }}>
              Deletes all events, metrics, funnels, and team members stored in this browser. The workspace will be re-seeded with fresh demo data on next load. This cannot be undone.
            </p>
            <button
              className="btn"
              style={{ background: "#dc2626", color: "#fff", border: "none" }}
              onClick={resetAllData}
            >
              Reset all data
            </button>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "22px 24px" }}>
            <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 8px", fontSize: 16 }}>Support</p>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 14px" }}>
              Having trouble? Our team can help — usually under 2 minutes during business hours.
            </p>
            <button className="btn btn-outline" onClick={() => (window as any).shubpy?.open?.()}>
              💬 Open support chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
