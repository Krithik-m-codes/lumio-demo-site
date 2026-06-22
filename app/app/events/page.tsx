"use client";

import { useState, useEffect, useCallback } from "react";
import { db, AppEvent, EVENTS } from "../../../lib/db";

const PRESET_EVENTS = [
  { name: "page_viewed", props: { url: "/pricing" } },
  { name: "button_clicked", props: { element: "start_trial_btn", page: "/pricing" } },
  { name: "signup_started", props: { plan: "growth" } },
  { name: "signup_completed", props: { plan: "growth", method: "email" } },
  { name: "dashboard_created", props: { template: "blank" } },
  { name: "funnel_saved", props: { steps: "3" } },
  { name: "export_started", props: { format: "csv" } },
  { name: "user_identified", props: { plan: "growth" } },
];

const SOURCES = ["manual", "sdk", "api"] as const;
const PAGE_SIZE = 20;

export default function EventsPage() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [filter, setFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", userId: "usr_demo", source: "manual" as typeof SOURCES[number], props: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    const all = db.list<AppEvent>(EVENTS).sort((a, b) => b.createdAt - a.createdAt);
    setEvents(all);
  }, []);

  useEffect(() => {
    load();
    (window as any).shubpy?.track?.("events_page_viewed");
  }, [load]);

  const filtered = events.filter((e) => {
    const matchName = filter === "" || e.name.includes(filter.toLowerCase());
    const matchSource = sourceFilter === "all" || e.source === sourceFilter;
    return matchName && matchSource;
  });

  const paginated = filtered.slice(0, page * PAGE_SIZE);

  const sendEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSending(true);

    let properties: Record<string, string> = {};
    try {
      if (form.props.trim()) properties = JSON.parse(form.props);
    } catch { properties = {}; }

    setTimeout(() => {
      const ev = db.create<AppEvent>(EVENTS, {
        name: form.name.trim(),
        userId: form.userId.trim() || "usr_anonymous",
        source: form.source,
        properties,
      });
      (window as any).shubpy?.track?.("demo_event_sent", { eventName: form.name });
      setSent(ev.id);
      setSending(false);
      setForm({ name: "", userId: "usr_demo", source: "manual", props: "" });
      load();
      setTimeout(() => setSent(null), 3000);
    }, 400);
  };

  const usePreset = (preset: typeof PRESET_EVENTS[0]) => {
    setForm((f) => ({ ...f, name: preset.name, props: JSON.stringify(preset.props) }));
    setShowForm(true);
  };

  const deleteEvent = (id: string) => {
    db.remove(EVENTS, id);
    setDeleteId(null);
    load();
  };

  const clearAll = () => {
    if (window.confirm("Delete all events?")) {
      db.clear(EVENTS);
      load();
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  const sourceColor: Record<string, string> = { manual: "#4f46e5", sdk: "#16a34a", api: "#d97706" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1220", margin: 0 }}>Events</h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>{events.length} total · {filtered.length} shown</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={clearAll}>Clear all</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Send event"}
          </button>
        </div>
      </div>

      {/* Send form */}
      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "22px 24px" }}>
          <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 16px" }}>Send a new event</p>

          {/* Presets */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>Quick presets</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PRESET_EVENTS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => usePreset(p)}
                  style={{ padding: "5px 12px", borderRadius: 20, border: "1.5px solid #e6e9ef", background: form.name === p.name ? "#eef2ff" : "#fff", fontSize: 12, fontWeight: 600, color: form.name === p.name ? "#4f46e5" : "#334155", cursor: "pointer" }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={sendEvent} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label>Event name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. button_clicked" required />
            </div>
            <div className="form-group">
              <label>User ID</label>
              <input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} placeholder="usr_xyz" />
            </div>
            <div className="form-group">
              <label>Source</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as any })}>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Properties <span style={{ fontWeight: 400, color: "#94a3b8" }}>(JSON)</span></label>
              <input value={form.props} onChange={(e) => setForm({ ...form, props: e.target.value })} placeholder='{"url": "/pricing"}' />
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 12, alignItems: "center" }}>
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? "Sending…" : "Send event"}
              </button>
              {sent && <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>✓ Event sent · ID: {sent}</span>}
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          placeholder="Filter by event name…"
          style={{ maxWidth: 240 }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["all", ...SOURCES].map((s) => (
            <button
              key={s}
              onClick={() => { setSourceFilter(s); setPage(1); }}
              style={{
                padding: "6px 14px", borderRadius: 20, border: "1.5px solid", fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: sourceFilter === s ? (sourceColor[s] ?? "#4f46e5") : "#fff",
                color: sourceFilter === s ? "#fff" : "#334155",
                borderColor: sourceFilter === s ? (sourceColor[s] ?? "#4f46e5") : "#e6e9ef",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Event table */}
      <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px 120px 80px", gap: 0, padding: "10px 20px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
          {["Event name", "User ID", "Source", "Time", ""].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#94a3b8" }}>
            No events yet.{" "}
            <button style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontWeight: 600 }} onClick={() => setShowForm(true)}>
              Send your first event →
            </button>
          </div>
        ) : (
          paginated.map((ev) => (
            <div
              key={ev.id}
              style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px 120px 80px", gap: 0, padding: "12px 20px", borderBottom: "1px solid #f8fafc", alignItems: "center" }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0, fontFamily: "monospace" }}>{ev.name}</p>
                {Object.keys(ev.properties).length > 0 && (
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0", fontFamily: "monospace" }}>
                    {Object.entries(ev.properties).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                  </p>
                )}
              </div>
              <span style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{ev.userId}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: sourceColor[ev.source] ?? "#4f46e5", textTransform: "uppercase", letterSpacing: "0.04em" }}>{ev.source}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{formatTime(ev.createdAt)}</span>
              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                {deleteId === ev.id ? (
                  <>
                    <button onClick={() => deleteEvent(ev.id)} style={{ fontSize: 11, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#dc2626", fontWeight: 600 }}>Delete</button>
                    <button onClick={() => setDeleteId(null)} style={{ fontSize: 11, background: "#f8fafc", border: "1px solid #e6e9ef", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#64748b" }}>×</button>
                  </>
                ) : (
                  <button onClick={() => setDeleteId(ev.id)} style={{ fontSize: 13, background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "2px 6px" }}>⋯</button>
                )}
              </div>
            </div>
          ))
        )}

        {paginated.length < filtered.length && (
          <div style={{ padding: "14px 20px", textAlign: "center", borderTop: "1px solid #f1f5f9" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage((p) => p + 1)}>
              Load more ({filtered.length - paginated.length} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
