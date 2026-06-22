"use client";

import { useState, useEffect } from "react";

interface UserProfile {
  name: string;
  email: string;
  company: string;
  role: string;
  plan: string;
}

const EMPTY: UserProfile = { name: "", email: "", company: "", role: "", plan: "starter" };

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY);
  const [saved, setSaved] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "notifications" | "danger">("profile");

  // Preferences state
  const [prefs, setPrefs] = useState({ weeklyDigest: true, featureAnnouncements: true, productTips: false, usageAlerts: true });
  const [prefsSaved, setPrefsSaved] = useState(false);

  useEffect(() => {
    const storedProfile = localStorage.getItem("lumio_user");
    if (storedProfile) {
      const p = JSON.parse(storedProfile) as UserProfile;
      setProfile(p);
      setSaved(p);
    }
    const storedPrefs = localStorage.getItem("lumio_prefs");
    if (storedPrefs) setPrefs(JSON.parse(storedPrefs));
  }, []);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.email.trim()) { setStatus("error"); return; }
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("lumio_user", JSON.stringify(profile));
      setSaved(profile);
      setSaving(false);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);

      // Identify the visitor in the widget
      (window as any).shubpy?.identify?.({
        email: profile.email,
        name: profile.name,
        company: profile.company,
        plan: profile.plan,
      });
      (window as any).shubpy?.track?.("profile_updated", { role: profile.role, plan: profile.plan });
    }, 700);
  };

  const savePrefs = () => {
    localStorage.setItem("lumio_prefs", JSON.stringify(prefs));
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2500);
  };

  const clearAccount = () => {
    localStorage.removeItem("lumio_user");
    localStorage.removeItem("lumio_prefs");
    localStorage.removeItem("lumio_plan");
    localStorage.removeItem("lumio_billing");
    localStorage.removeItem("lumio_newsletter");
    localStorage.removeItem("lumio_reads");
    localStorage.removeItem("lumio_likes");
    localStorage.removeItem("lumio_recent_docs");
    setProfile(EMPTY);
    setSaved(null);
    (window as any).shubpy?.reset?.();
    alert("All local data cleared. The widget visitor identity has been reset.");
  };

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "preferences", label: "Email preferences" },
    { key: "notifications", label: "Notifications" },
    { key: "danger", label: "Data & privacy" },
  ] as const;

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Account</span>
          <h1>
            {saved?.name ? `Hello, ${saved.name.split(" ")[0]}` : "Your account"}
          </h1>
          <p>
            {saved?.email
              ? `Signed in as ${saved.email} · ${saved.plan} plan`
              : "Set up your profile so the widget knows who you are."}
          </p>
          {!saved && (
            <div className="alert alert-info" style={{ marginTop: 20, maxWidth: 480 }}>
              💡 Filling in your email here calls <code>shubpy.identify()</code> — the widget will then show your name and let agents see your profile.
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: "48px 24px 80px", display: "flex", gap: 40, alignItems: "flex-start" }}>
        {/* Tab nav */}
        <nav style={{ width: 200, flexShrink: 0 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "9px 12px",
                background: activeTab === tab.key ? "var(--brand-soft)" : "none",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? "var(--brand)" : "var(--body)",
                cursor: "pointer",
                marginBottom: 2,
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div style={{ flex: 1, maxWidth: 560 }}>
          {activeTab === "profile" && (
            <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ fontSize: 20 }}>Profile information</h2>

              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Full name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Jane Doe" />
                </div>
                <div className="form-group">
                  <label>Email address *</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="jane@company.com" required />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} placeholder="Acme Corp" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                    <option value="">Select…</option>
                    <option value="product">Product manager</option>
                    <option value="engineer">Engineer</option>
                    <option value="analyst">Data analyst</option>
                    <option value="founder">Founder / CEO</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Current plan</label>
                <select value={profile.plan} onChange={(e) => setProfile({ ...profile, plan: e.target.value })}>
                  <option value="starter">Starter (free)</option>
                  <option value="growth">Growth ($99/mo)</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <span className="hint">
                  This is stored locally and used to identify your plan tier in the chat widget.
                </span>
              </div>

              {status === "error" && <p className="form-error">Email address is required.</p>}
              {status === "saved" && (
                <div className="alert alert-success">
                  ✓ Profile saved and widget identity updated. The chat agent can now see your name and plan.
                </div>
              )}

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save profile"}
                </button>
                {saved && (
                  <button type="button" className="btn btn-ghost" onClick={() => setProfile(saved)}>
                    Reset
                  </button>
                )}
              </div>

              {saved && (
                <div style={{ padding: "16px 20px", background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 13, color: "var(--muted)" }}>
                  <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>Widget identity active</p>
                  <p>The chat widget has been told you are <strong>{saved.name || saved.email}</strong>
                  {saved.company ? ` from ${saved.company}` : ""}
                  {saved.plan ? ` on the ${saved.plan} plan` : ""}.</p>
                </div>
              )}
            </form>
          )}

          {activeTab === "preferences" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ fontSize: 20 }}>Email preferences</h2>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Choose which emails you&apos;d like to receive from us.</p>

              {[
                { key: "weeklyDigest" as const, label: "Weekly product digest", desc: "A summary of your key metrics every Monday morning." },
                { key: "featureAnnouncements" as const, label: "New feature announcements", desc: "When we ship something we think you'll love." },
                { key: "productTips" as const, label: "Product tips & tutorials", desc: "Practical how-tos from our team. Usually one per month." },
                { key: "usageAlerts" as const, label: "Usage alerts", desc: "When you approach or exceed your event quota." },
              ].map((item) => (
                <label
                  key={item.key}
                  style={{ display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer", padding: "16px 20px", background: "#fff", border: "1px solid var(--line)", borderRadius: 12 }}
                >
                  <input
                    type="checkbox"
                    checked={prefs[item.key]}
                    onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                    style={{ width: 18, height: 18, marginTop: 2, accentColor: "var(--brand)", flexShrink: 0 }}
                  />
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: 14 }}>{item.label}</p>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>{item.desc}</p>
                  </div>
                </label>
              ))}

              {prefsSaved && <div className="alert alert-success">✓ Preferences saved.</div>}
              <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={savePrefs}>
                Save preferences
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ fontSize: 20 }}>In-app notifications</h2>

              <div className="alert alert-info">
                Notification settings are workspace-level. Contact your workspace admin to change these, or open the chat if you need help.
              </div>

              {["Threshold alerts", "Export complete", "Dashboard shared with you", "New comment on dashboard", "Weekly report ready"].map((item) => (
                <label key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "#fff", border: "1px solid var(--line)", borderRadius: 10, cursor: "pointer" }}>
                  <span style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>{item}</span>
                  <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: "var(--brand)" }} />
                </label>
              ))}

              <button className="btn btn-ghost" onClick={() => (window as any).shubpy?.open?.()}>
                Need help? Chat with us
              </button>
            </div>
          )}

          {activeTab === "danger" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <h2 style={{ fontSize: 20 }}>Data & privacy</h2>

              <div style={{ padding: "20px 24px", border: "1.5px solid var(--line)", borderRadius: 12 }}>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>Export your data</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>Download a copy of your Lumio data including events, dashboards, and settings.</p>
                <button className="btn btn-ghost btn-sm" onClick={() => alert("In a real app, this would start a data export job and email you the download link.")}>
                  Request data export
                </button>
              </div>

              <div style={{ padding: "20px 24px", border: "1.5px solid #fecaca", borderRadius: 12, background: "#fff5f5" }}>
                <h3 style={{ fontSize: 16, marginBottom: 6, color: "var(--red)" }}>Clear all local data</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
                  Clears everything stored in this browser: your profile, plan selection, reading history, newsletter status, and widget identity. Useful for testing the widget as a new visitor.
                </p>
                <button
                  className="btn btn-sm"
                  style={{ background: "var(--red)", color: "#fff", border: "none" }}
                  onClick={() => { if (window.confirm("Clear all local demo data?")) clearAccount(); }}
                >
                  Clear local data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
