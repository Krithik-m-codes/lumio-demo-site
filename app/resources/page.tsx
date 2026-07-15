"use client";

import { useState } from "react";

const RESOURCES = [
  { title: "Funnel Analysis Masterclass", type: "Guide", icon: "⇄", desc: "Step-by-step walkthrough of building, reading, and acting on product funnels.", cta: "Read guide" },
  { title: "Retention Metrics That Matter", type: "Ebook", icon: "📕", desc: "40-page free ebook covering every retention metric worth tracking and why.", cta: "Download free" },
  { title: "First Dashboard Template", type: "Template", icon: "▦", desc: "A ready-to-use dashboard template for new Lumio workspaces. Import in one click.", cta: "Use template" },
  { title: "Product Analytics for Startups", type: "Webinar", icon: "🎥", desc: "45-minute recorded webinar: analytics setup for teams with no data infrastructure.", cta: "Watch now" },
  { title: "How Brightfin Grew 3x", type: "Case Study", icon: "📊", desc: "How Brightfin cut their analytics setup time from 3 weeks to an afternoon.", cta: "Read story" },
  { title: "Event Naming Convention Guide", type: "Guide", icon: "📋", desc: "The naming convention and schema structure that works across 500+ workspaces.", cta: "Read guide" },
  { title: "GDPR Analytics Checklist", type: "Guide", icon: "✓", desc: "A practical compliance checklist for product analytics teams in the EU and beyond.", cta: "Download" },
  { title: "Cohort Analysis Workshop", type: "Webinar", icon: "🎥", desc: "Recorded 60-min deep dive: reading retention curves, finding floors, acting on drops.", cta: "Watch now" },
  { title: "SaaS Metrics Template Pack", type: "Template", icon: "📦", desc: "7 ready-to-use dashboard templates for MRR, churn, activation, funnel, and more.", cta: "Use templates" },
  { title: "Growth Analytics Ebook", type: "Ebook", icon: "📗", desc: "How the fastest-growing SaaS companies instrument and act on growth metrics.", cta: "Download free" },
  { title: "Building Data-Driven Teams", type: "Webinar", icon: "🎥", desc: "Panel: how Amplitude, Notion, and Linear built analytics cultures from scratch.", cta: "Watch now" },
  { title: "B2B Analytics Handbook", type: "Ebook", icon: "📘", desc: "Everything you need to know about account-level analytics for B2B SaaS products.", cta: "Download free" },
];

const TYPES = ["All", "Guide", "Webinar", "Template", "Case Study", "Ebook"];

const typeColors: Record<string, string> = {
  Guide: "badge-brand",
  Webinar: "badge-green",
  Template: "badge-amber",
  "Case Study": "badge-gray",
  Ebook: "badge-green",
};

export default function ResourcesPage() {
  const [type, setType] = useState("All");

  const filtered = RESOURCES.filter((r) => type === "All" || r.type === type);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Resources</span>
          <h1>Learn, grow, ship better products</h1>
          <p>Guides, templates, webinars, and ebooks — all free, all practical.</p>
        </div>
      </div>

      {/* Featured */}
      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div
            className="card"
            style={{
              display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center",
              padding: "36px 40px", background: "var(--ink)", border: "none", flexWrap: "wrap",
            }}
          >
            <div>
              <span className="eyebrow" style={{ background: "rgba(255,255,255,0.12)", color: "#c7d2fe" }}>Featured · Free</span>
              <h2 style={{ color: "#fff", fontSize: "clamp(22px, 3vw, 32px)", marginTop: 14, marginBottom: 14 }}>
                The Product Analytics Playbook 2026
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, maxWidth: 560 }}>
                Our most comprehensive guide: 80 pages covering instrumentation strategy, funnel design, retention analysis, dashboarding, and building an analytics culture. Used by 12,000+ teams.
              </p>
            </div>
            <a
              className="btn btn-primary btn-lg"
              href="/contact?subject=Playbook+download"
              style={{ flexShrink: 0 }}
              onClick={() => (window as any).shubpy?.track?.("resource_downloaded", { title: "Product Analytics Playbook 2026" })}
            >
              Download free →
            </a>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="block">
        <div className="container">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                style={{
                  padding: "7px 16px", borderRadius: 20, border: "1.5px solid", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", background: type === t ? "var(--brand)" : "#fff",
                  color: type === t ? "#fff" : "var(--body)", borderColor: type === t ? "var(--brand)" : "var(--line)", transition: "all .15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {filtered.map((r) => (
              <div className="card" key={r.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className={`badge ${typeColors[r.type] ?? "badge-gray"}`}>{r.type}</span>
                  <span style={{ fontSize: 22 }}>{r.icon}</span>
                </div>
                <h3 style={{ fontSize: 17, lineHeight: 1.3, flex: 1 }}>{r.title}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{r.desc}</p>
                <a
                  href="/contact?subject=Resource+request"
                  className="btn btn-ghost btn-sm"
                  style={{ alignSelf: "flex-start", marginTop: "auto" }}
                  onClick={() => (window as any).shubpy?.track?.("resource_downloaded", { title: r.title, type: r.type })}
                >
                  {r.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block cta">
        <div className="container">
          <h2>Stay in the loop</h2>
          <p>New resources every month. Subscribe and we'll send them straight to your inbox.</p>
          <a className="btn btn-primary btn-lg" href="/#newsletter">Subscribe free</a>
        </div>
      </section>
    </>
  );
}
