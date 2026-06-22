"use client";

import { useState } from "react";

const INTEGRATIONS = [
  { name: "Segment", cat: "Data Sources", icon: "◎", desc: "Import all your Segment events with zero additional configuration." },
  { name: "Snowflake", cat: "Data Sources", icon: "❄", desc: "Sync your Snowflake data warehouse bidirectionally with Lumio." },
  { name: "BigQuery", cat: "Data Sources", icon: "▦", desc: "Real-time event streaming from Google BigQuery tables." },
  { name: "Amplitude", cat: "Data Sources", icon: "⇄", desc: "Migrate from Amplitude with a one-click historical data import." },
  { name: "Mixpanel", cat: "Data Sources", icon: "⇄", desc: "Migrate from Mixpanel — events, users, and cohorts included." },
  { name: "Stripe", cat: "Revenue", icon: "💳", desc: "Automatically ingest subscription lifecycle events and revenue metrics." },
  { name: "Chargebee", cat: "Revenue", icon: "💰", desc: "Subscription billing events and churn signals from Chargebee." },
  { name: "Slack", cat: "Communication", icon: "💬", desc: "Send dashboard digest reports to any Slack channel on a schedule." },
  { name: "Microsoft Teams", cat: "Communication", icon: "👥", desc: "Microsoft Teams digest support for dashboard reports and alerts." },
  { name: "Email", cat: "Communication", icon: "✉", desc: "Schedule email report digests for stakeholders who aren't in Lumio." },
  { name: "Intercom", cat: "Communication", icon: "💬", desc: "Identify Lumio users with Intercom contact data for enriched analytics." },
  { name: "Salesforce", cat: "CRM", icon: "☁", desc: "Enrich events with deal and account properties from Salesforce." },
  { name: "HubSpot", cat: "CRM", icon: "🔶", desc: "Sync HubSpot contact properties to enrich your Lumio user profiles." },
  { name: "Zapier", cat: "Destinations", icon: "⚡", desc: "Trigger Zaps from any Lumio event to automate workflows across 5,000+ apps." },
  { name: "Webhooks", cat: "Destinations", icon: "🔗", desc: "Send events to any HTTP endpoint in real time with configurable payloads." },
  { name: "Amazon S3", cat: "Destinations", icon: "🪣", desc: "Archive raw event streams to S3 for long-term storage and ML pipelines." },
  { name: "GitHub", cat: "Destinations", icon: "🐙", desc: "Automatically track deployments as Lumio events using GitHub Actions." },
  { name: "Linear", cat: "Destinations", icon: "◈", desc: "Tag product events with Linear issue data for incident correlation." },
];

const CATS = ["All", "Data Sources", "Destinations", "Communication", "CRM", "Revenue"];

export default function IntegrationsPage() {
  const [cat, setCat] = useState("All");

  const filtered = INTEGRATIONS.filter((i) => cat === "All" || i.cat === cat);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Integrations</span>
          <h1>Connect everything you already use</h1>
          <p>Lumio plugs into your existing stack — no rip-and-replace, no lock-in.</p>
        </div>
      </div>

      <section className="block">
        <div className="container">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => { setCat(c); (window as any).shubpy?.track?.("integrations_filter", { category: c }); }}
                style={{
                  padding: "7px 16px", borderRadius: 20, border: "1.5px solid", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", background: cat === c ? "var(--brand)" : "#fff",
                  color: cat === c ? "#fff" : "var(--body)", borderColor: cat === c ? "var(--brand)" : "var(--line)", transition: "all .15s",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
            {filtered.map((intg) => (
              <div className="card" key={intg.name} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="ico" style={{ fontSize: 22 }}>{intg.icon}</div>
                  <div>
                    <h3 style={{ fontSize: 16, marginBottom: 2 }}>{intg.name}</h3>
                    <span className="badge badge-gray" style={{ fontSize: 11 }}>{intg.cat}</span>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "var(--muted)", flex: 1 }}>{intg.desc}</p>
                <a
                  href="/docs"
                  className="btn btn-ghost btn-sm"
                  style={{ alignSelf: "flex-start" }}
                  onClick={() => (window as any).shubpy?.track?.("integration_connect_clicked", { name: intg.name })}
                >
                  Connect →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container" style={{ maxWidth: 680, textAlign: "center" }}>
          <h2>Don't see your tool?</h2>
          <p style={{ color: "var(--muted)", marginTop: 12, marginBottom: 28 }}>
            We add new integrations every month. Request one via the chat bubble or check our public roadmap.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={() => (window as any).shubpy?.open?.()}>Request an integration</button>
            <a className="btn btn-ghost" href="/contact">Contact us</a>
          </div>
        </div>
      </section>
    </>
  );
}
