"use client";

import { useState, useEffect, useCallback } from "react";
import { db, TeamMember, TEAM } from "../../../lib/db";

const ROLES = ["admin", "member", "viewer"] as const;
const STATUSES = ["active", "invited", "suspended"] as const;
const ROLE_COLORS: Record<string, string> = { admin: "#7c3aed", member: "#4f46e5", viewer: "#64748b" };
const STATUS_COLORS: Record<string, string> = { active: "#16a34a", invited: "#d97706", suspended: "#dc2626" };

const EMPTY: Omit<TeamMember, "id" | "createdAt" | "updatedAt"> = {
  name: "", email: "", role: "member", status: "invited", avatar: "",
};

function initials(name: string): string {
  return name.split(" ").map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2) || "?";
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(() => setMembers(db.list<TeamMember>(TEAM)), []);
  useEffect(() => {
    load();
    (window as any).shubpy?.track?.("team_page_viewed");
  }, [load]);

  const filtered = members.filter((m) =>
    search === "" ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    const payload = { ...form, avatar: initials(form.name || form.email) };
    setSaving(true);
    setTimeout(() => {
      if (editing) db.update<TeamMember>(TEAM, editing, payload);
      else {
        db.create<TeamMember>(TEAM, payload);
        (window as any).shubpy?.track?.("team_member_invited", { email: form.email, role: form.role });
      }
      setSaving(false); setShowForm(false); setEditing(null); setForm(EMPTY);
      load();
    }, 300);
  };

  const startEdit = (m: TeamMember) => {
    setForm({ name: m.name, email: m.email, role: m.role, status: m.status, avatar: m.avatar });
    setEditing(m.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = (id: string) => { db.remove(TEAM, id); setDeleteId(null); load(); };

  const toggleStatus = (m: TeamMember) => {
    const next = m.status === "active" ? "suspended" : "active";
    db.update<TeamMember>(TEAM, m.id, { status: next });
    load();
  };

  const active = members.filter((m) => m.status === "active").length;
  const invited = members.filter((m) => m.status === "invited").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0b1220", margin: 0 }}>Team</h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0 0" }}>
            {active} active · {invited} pending invitation
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY); }}>
          {showForm && !editing ? "Cancel" : "+ Invite member"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "22px 24px" }}>
          <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 18px" }}>{editing ? "Edit member" : "Invite team member"}</p>
          <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label>Full name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div className="form-group">
              <label>Email address *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
                {ROLES.map((r) => <option key={r} value={r} style={{ textTransform: "capitalize" }}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            {editing && (
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            )}
            <div style={{ gridColumn: "1/-1", display: "flex", gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Save" : "Send invite"}</button>
              <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members…" style={{ maxWidth: 280 }} />

      {/* Role legend */}
      <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
        {ROLES.map((r) => (
          <span key={r} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: ROLE_COLORS[r] }} />
            <span style={{ color: "#64748b", textTransform: "capitalize" }}>{r}</span>
            <span style={{ color: "#94a3b8" }}>({members.filter((m) => m.role === r).length})</span>
          </span>
        ))}
      </div>

      {/* Member table */}
      <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 110px 110px 120px", gap: 0, padding: "10px 20px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
          {["Member", "Email", "Role", "Status", ""].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#94a3b8" }}>
            No team members found.{" "}
            <button style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontWeight: 600 }} onClick={() => setShowForm(true)}>
              Invite someone →
            </button>
          </div>
        ) : (
          filtered.map((m) => (
            <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 180px 110px 110px 120px", gap: 0, padding: "13px 20px", borderBottom: "1px solid #f8fafc", alignItems: "center" }}>
              {/* Avatar + name */}
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${ROLE_COLORS[m.role]}22`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: ROLE_COLORS[m.role], flexShrink: 0 }}>
                  {m.avatar || initials(m.name || m.email)}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 }}>{m.name || "—"}</p>
                </div>
              </div>
              <span style={{ fontSize: 13, color: "#64748b" }}>{m.email}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: ROLE_COLORS[m.role], textTransform: "capitalize" }}>{m.role}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLORS[m.status], textTransform: "capitalize" }}>{m.status}</span>
              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                <button onClick={() => startEdit(m)} style={{ fontSize: 12, background: "none", border: "1px solid #e6e9ef", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#64748b" }}>Edit</button>
                {deleteId === m.id ? (
                  <>
                    <button onClick={() => del(m.id)} style={{ fontSize: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#dc2626", fontWeight: 600 }}>Remove</button>
                    <button onClick={() => setDeleteId(null)} style={{ fontSize: 12, background: "none", border: "1px solid #e6e9ef", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#94a3b8" }}>×</button>
                  </>
                ) : (
                  <button onClick={() => setDeleteId(m.id)} style={{ fontSize: 12, background: "none", border: "1px solid #e6e9ef", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#94a3b8" }}>⋯</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Role descriptions */}
      <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "20px 22px" }}>
        <p style={{ fontWeight: 700, color: "#0b1220", margin: "0 0 14px", fontSize: 15 }}>Role permissions</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { role: "admin", desc: "Full access — manage workspace, billing, and all data. Can invite and remove members." },
            { role: "member", desc: "Can create and edit dashboards, metrics, funnels, and view all events. Cannot manage billing." },
            { role: "viewer", desc: "Read-only access to dashboards and metrics. Cannot create or edit anything." },
          ].map(({ role, desc }) => (
            <div key={role} style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: ROLE_COLORS[role], textTransform: "capitalize", margin: "0 0 6px" }}>{role}</p>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
