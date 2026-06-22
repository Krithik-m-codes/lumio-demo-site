"use client";

import { useState, useEffect, useCallback } from "react";
import { db, Metric, AppEvent, METRICS, EVENTS } from "../../../lib/db";

const AGGREGATIONS = [
  { value: "count", label: "Count" },
  { value: "unique_users", label: "Unique users" },
  { value: "sum", label: "Sum of property" },
];
const PERIODS = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
];

interface MetricValue extends Metric {
  currentValue: number;
  previousValue: number;
  trend: number;
}

function computeMetric(metric: Metric, events: AppEvent[]): MetricValue {
  const now = Date.now();
  const periodMs = metric.period === "day" ? 86_400_000 : metric.period === "week" ? 7 * 86_400_000 : 30 * 86_400_000;

  const current = events.filter((e) => e.name === metric.eventName && e.createdAt > now - periodMs);
  const previous = events.filter((e) => e.name === metric.eventName && e.createdAt > now - 2 * periodMs && e.createdAt <= now - periodMs);

  const calc = (evs: AppEvent[]) => {
    if (metric.aggregation === "count") return evs.length;
    if (metric.aggregation === "unique_users") return new Set(evs.map((e) => e.userId)).size;
    if (metric.aggregation === "sum") return evs.reduce((s, e) => s + (Number(e.properties[metric.propertyKey]) || 0), 0);
    return 0;
  };

  const cur = calc(current);
  const prev = calc(previous);
  const trend = prev === 0 ? 0 : Math.round(((cur - prev) / prev) * 100);

  return { ...metric, currentValue: cur, previousValue: prev, trend };
}

const EMPTY_FORM: Omit<Metric, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  description: "",
  eventName: "",
  aggregation: "count",
  propertyKey: "",
  period: "week",
  goal: null,
};

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricValue[]>([]);
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    const events = db.list<AppEvent>(EVENTS);
    const mets = db.list<Metric>(METRICS);
    const names = [...new Set(events.map((e) => e.name))].sort();
    setEventNames(names);
    setMetrics(mets.map((m) => computeMetric(m, events)));
  }, []);

  useEffect(() => {
    load();
    (window as any).shubpy?.track?.("metrics_page_viewed");
  }, [load]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.eventName.trim()) return;
    setSaving(true);
    setTimeout(() => {
      if (editing) {
        db.update<Metric>(METRICS, editing, form);
      } else {
        db.create<Metric>(METRICS, form);
      }
      setSaving(false);
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      load();
    }, 300);
  };

  const startEdit = (m: MetricValue) => {
    setForm({ name: m.name, description: m.description, eventName: m.eventName, aggregation: m.aggregation, propertyKey: m.propertyKey, period: m.period, goal: m.goal });
    setEditing(m.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = (id: string) => {
    db.remove(METRICS, id);
    setDeleteId(null);
    load();
  };

  const trendColor = (t: number) => t > 0 ? "#16a34a" : t < 0 ? "#dc2626" : "#94a3b8";
  const trendLabel = (t: number) => t > 0 ? `↑ ${t}%` : t < 0 ? `↓ ${Math.abs(t)}%` : "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1220", margin: 0 }}>Metrics</h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>Define and track key performance indicators.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY_FORM); }}>
          {showForm && !editing ? "Cancel" : "+ New metric"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "22px 24px" }}>
          <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 18px" }}>{editing ? "Edit metric" : "Define new metric"}</p>
          <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label>Metric name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Weekly signups" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this measure?" />
            </div>
            <div className="form-group">
              <label>Event name *</label>
              <input value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} list="event-names-list" placeholder="Type or choose…" required />
              <datalist id="event-names-list">
                {eventNames.map((n) => <option key={n} value={n} />)}
              </datalist>
            </div>
            <div className="form-group">
              <label>Aggregation</label>
              <select value={form.aggregation} onChange={(e) => setForm({ ...form, aggregation: e.target.value as any })}>
                {AGGREGATIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
            {form.aggregation === "sum" && (
              <div className="form-group">
                <label>Property key to sum</label>
                <input value={form.propertyKey} onChange={(e) => setForm({ ...form, propertyKey: e.target.value })} placeholder="e.g. revenue" />
              </div>
            )}
            <div className="form-group">
              <label>Period</label>
              <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value as any })}>
                {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Goal <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
              <input type="number" value={form.goal ?? ""} onChange={(e) => setForm({ ...form, goal: e.target.value ? Number(e.target.value) : null })} placeholder="100" min={0} />
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Create metric"}</button>
              <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {metrics.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "56px 24px", textAlign: "center", color: "#94a3b8" }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>No metrics defined yet.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Define your first metric</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {metrics.map((m) => {
            const pct = m.goal ? Math.min(100, (m.currentValue / m.goal) * 100) : null;
            return (
              <div key={m.id} style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0b1220", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</p>
                    {m.description && <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>{m.description}</p>}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
                    <button onClick={() => startEdit(m)} style={{ fontSize: 12, background: "none", border: "1px solid #e6e9ef", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#64748b" }}>Edit</button>
                    {deleteId === m.id ? (
                      <>
                        <button onClick={() => del(m.id)} style={{ fontSize: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#dc2626", fontWeight: 600 }}>Confirm</button>
                        <button onClick={() => setDeleteId(null)} style={{ fontSize: 12, background: "none", border: "1px solid #e6e9ef", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#94a3b8" }}>×</button>
                      </>
                    ) : (
                      <button onClick={() => setDeleteId(m.id)} style={{ fontSize: 12, background: "none", border: "1px solid #e6e9ef", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#94a3b8" }}>Delete</button>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "12px 0 6px" }}>
                  <span style={{ fontSize: 34, fontWeight: 800, color: "#0b1220", fontVariantNumeric: "tabular-nums" }}>{m.currentValue.toLocaleString()}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: trendColor(m.trend) }}>{trendLabel(m.trend)}</span>
                </div>

                <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#94a3b8", marginBottom: pct !== null ? 10 : 0 }}>
                  <span style={{ background: "#f1f5f9", borderRadius: 4, padding: "2px 6px", fontFamily: "monospace" }}>{m.eventName}</span>
                  <span>{AGGREGATIONS.find((a) => a.value === m.aggregation)?.label}</span>
                  <span>·</span>
                  <span>{PERIODS.find((p) => p.value === m.period)?.label}</span>
                </div>

                {pct !== null && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 5 }}>
                      <span>Goal progress</span>
                      <span>{Math.round(pct)}% of {m.goal?.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? "#16a34a" : "#4f46e5", borderRadius: 4 }} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
