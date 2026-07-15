"use client";

import { useState, useEffect, useCallback } from "react";
import { db, AppEvent, DbRecord, EVENTS } from "../../../lib/db";

const FUNNELS_KEY = "lumio_db_funnels";

interface FunnelStep {
  eventName: string;
  label: string;
}
interface Funnel extends DbRecord {
  name: string;
  steps: FunnelStep[];
  window: "day" | "week" | "month";
}

function computeFunnel(funnel: Funnel, events: AppEvent[]): { step: FunnelStep; count: number; pct: number }[] {
  if (funnel.steps.length === 0) return [];
  const windowMs = funnel.window === "day" ? 86_400_000 : funnel.window === "week" ? 7 * 86_400_000 : 30 * 86_400_000;
  const now = Date.now();
  const inWindow = events.filter((e) => e.createdAt > now - windowMs);

  // Group events by user
  const byUser: Record<string, AppEvent[]> = {};
  inWindow.forEach((e) => { (byUser[e.userId] ??= []).push(e); });

  const stepCounts = funnel.steps.map(() => new Set<string>());

  Object.entries(byUser).forEach(([userId, evs]) => {
    const sorted = [...evs].sort((a, b) => a.createdAt - b.createdAt);
    let stepIdx = 0;
    for (const ev of sorted) {
      if (ev.name === funnel.steps[stepIdx].eventName) {
        stepCounts[stepIdx].add(userId);
        stepIdx++;
        if (stepIdx >= funnel.steps.length) break;
      }
    }
  });

  const top = stepCounts[0].size || 1;
  return funnel.steps.map((step, i) => ({
    step,
    count: stepCounts[i].size,
    pct: Math.round((stepCounts[i].size / top) * 100),
  }));
}

const EMPTY_FUNNEL: Omit<Funnel, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  steps: [{ eventName: "", label: "Step 1" }, { eventName: "", label: "Step 2" }],
  window: "week",
};

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Funnel, "id" | "createdAt" | "updatedAt">>(EMPTY_FUNNEL);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    const evs = db.list<AppEvent>(EVENTS);
    const fns = db.list<Funnel>(FUNNELS_KEY);
    setEvents(evs);
    setFunnels(fns);
    setEventNames([...new Set(evs.map((e) => e.name))].sort());

    // Seed one example funnel
    if (fns.length === 0) {
      db.seed<Funnel>(FUNNELS_KEY, [
        { name: "Sign-up flow", steps: [{ eventName: "page_viewed", label: "Visited site" }, { eventName: "signup_started", label: "Started signup" }, { eventName: "signup_completed", label: "Completed signup" }], window: "week" },
      ]);
      setFunnels(db.list<Funnel>(FUNNELS_KEY));
    }
  }, []);

  useEffect(() => {
    load();
    (window as any).shubpy?.track?.("funnels_page_viewed");
  }, [load]);

  const addStep = () => setForm((f) => ({ ...f, steps: [...f.steps, { eventName: "", label: `Step ${f.steps.length + 1}` }] }));
  const removeStep = (i: number) => setForm((f) => ({ ...f, steps: f.steps.filter((_, j) => j !== i) }));
  const updateStep = (i: number, field: keyof FunnelStep, value: string) =>
    setForm((f) => ({ ...f, steps: f.steps.map((s, j) => j === i ? { ...s, [field]: value } : s) }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.steps.some((s) => !s.eventName.trim())) return;
    setSaving(true);
    setTimeout(() => {
      if (editing) db.update<Funnel>(FUNNELS_KEY, editing, form);
      else db.create<Funnel>(FUNNELS_KEY, form);
      setSaving(false); setShowForm(false); setEditing(null); setForm(EMPTY_FUNNEL);
      load();
      (window as any).shubpy?.track?.("funnel_saved", { name: form.name });
    }, 300);
  };

  const del = (id: string) => { db.remove(FUNNELS_KEY, id); setDeleteId(null); load(); };

  const startEdit = (fn: Funnel) => {
    setForm({ name: fn.name, steps: fn.steps, window: fn.window });
    setEditing(fn.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1220", margin: 0 }}>Funnels</h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>Track conversion through multi-step user journeys.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY_FUNNEL); }}>
          {showForm && !editing ? "Cancel" : "+ New funnel"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "22px 24px" }}>
          <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 18px" }}>{editing ? "Edit funnel" : "Build new funnel"}</p>
          <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group">
                <label>Funnel name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sign-up flow" required />
              </div>
              <div className="form-group">
                <label>Conversion window</label>
                <select value={form.window} onChange={(e) => setForm({ ...form, window: e.target.value as any })}>
                  <option value="day">1 day</option>
                  <option value="week">7 days</option>
                  <option value="month">30 days</option>
                </select>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 10 }}>Steps</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {form.steps.map((step, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 36px", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
                    <input value={step.label} onChange={(e) => updateStep(i, "label", e.target.value)} placeholder={`Step ${i + 1} label`} />
                    <input value={step.eventName} onChange={(e) => updateStep(i, "eventName", e.target.value)} list={`en-${i}`} placeholder="Event name" required />
                    <datalist id={`en-${i}`}>{eventNames.map((n) => <option key={n} value={n} />)}</datalist>
                    {form.steps.length > 2 && (
                      <button type="button" onClick={() => removeStep(i)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addStep} className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", marginTop: 4 }}>+ Add step</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Create funnel"}</button>
              <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {funnels.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "56px 24px", textAlign: "center", color: "#94a3b8" }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>No funnels yet.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Build your first funnel</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {funnels.map((fn) => {
            const result = computeFunnel(fn, events);
            const isExpanded = expandedId === fn.id;
            return (
              <div key={fn.id} style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, overflow: "hidden" }}>
                {/* Header */}
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", cursor: "pointer" }}
                  onClick={() => setExpandedId(isExpanded ? null : fn.id)}
                >
                  <div>
                    <p style={{ fontWeight: 700, color: "#0b1220", margin: 0 }}>{fn.name}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>
                      {fn.steps.length} steps · {fn.window} window · {result[0]?.count ?? 0} entered
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {result.length >= 2 && (
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5" }}>
                        {result[result.length - 1].pct}% convert
                      </span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); startEdit(fn); }} style={{ fontSize: 12, background: "none", border: "1px solid #e6e9ef", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#64748b" }}>Edit</button>
                    {deleteId === fn.id ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); del(fn.id); }} style={{ fontSize: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#dc2626", fontWeight: 600 }}>Delete</button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(null); }} style={{ fontSize: 12, background: "none", border: "1px solid #e6e9ef", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#94a3b8" }}>×</button>
                      </>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); setDeleteId(fn.id); }} style={{ fontSize: 12, background: "none", border: "1px solid #e6e9ef", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#94a3b8" }}>Delete</button>
                    )}
                    <span style={{ color: "#94a3b8", fontSize: 16 }}>{isExpanded ? "▾" : "▸"}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: "0 22px 22px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                      {result.map((r, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                            <span style={{ fontWeight: 600, color: "#1e293b" }}>
                              <span style={{ display: "inline-flex", width: 22, height: 22, borderRadius: "50%", background: "#eef2ff", color: "#4f46e5", fontWeight: 700, fontSize: 11, alignItems: "center", justifyContent: "center", marginRight: 8 }}>{i + 1}</span>
                              {r.step.label}
                              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>({r.step.eventName})</span>
                            </span>
                            <div style={{ display: "flex", gap: 12 }}>
                              <span style={{ fontWeight: 700, color: "#0b1220" }}>{r.count.toLocaleString()} users</span>
                              {i > 0 && (
                                <span style={{ fontWeight: 700, color: r.pct < 50 ? "#dc2626" : r.pct < 80 ? "#d97706" : "#16a34a" }}>{r.pct}%</span>
                              )}
                            </div>
                          </div>
                          <div style={{ height: 24, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${r.pct}%`, background: r.pct < 50 ? "#ef4444" : r.pct < 80 ? "#f59e0b" : "#4f46e5", borderRadius: 6, transition: "width .5s ease" }} />
                          </div>
                          {i < result.length - 1 && (
                            <div style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "4px 0" }}>
                              ↓ {result[i + 1].pct}% continue
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
