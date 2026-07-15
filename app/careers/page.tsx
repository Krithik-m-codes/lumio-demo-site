"use client";

import { useState } from "react";

const JOBS = [
  { title: "Senior Backend Engineer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Build and scale the query engine and event ingestion pipeline that processes billions of events per day." },
  { title: "Staff Frontend Engineer — React/TypeScript", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Own the dashboard and chart rendering layer. You'll set the standard for how we build UI at Lumio." },
  { title: "Data Infrastructure Engineer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Design the pipelines that move data from SDKs to queryable storage reliably and at scale." },
  { title: "ML Engineer — Anomaly Detection", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Build the models that surface anomalies in product metrics before customers notice them." },
  { title: "Product Manager — Growth", dept: "Product", location: "Remote", type: "Full-time", desc: "Own the self-serve funnel from sign-up to paid. Work across onboarding, activation, and expansion." },
  { title: "Product Designer — Data Visualization", dept: "Design", location: "Remote", type: "Full-time", desc: "Make complex analytics feel effortlessly simple. You'll set the visual language for charts and dashboards." },
  { title: "Senior Account Executive", dept: "GTM", location: "Remote", type: "Full-time", desc: "Drive new revenue from mid-market and enterprise accounts. You'll own the full cycle from demo to close." },
  { title: "Customer Success Manager", dept: "GTM", location: "Remote", type: "Full-time", desc: "Own the post-sale relationship. Help customers achieve their goals and expand their usage over time." },
  { title: "Developer Advocate", dept: "GTM", location: "Remote", type: "Full-time", desc: "Build the developer community around Lumio. Create content, run workshops, and collect feedback from the field." },
];

const DEPTS = ["All", "Engineering", "Product", "Design", "GTM"];

const PERKS = [
  { i: "🏥", t: "Full health coverage", d: "Medical, dental, and vision for you and your dependents — fully covered." },
  { i: "💰", t: "401(k) match", d: "4% match from day one. No vesting cliff." },
  { i: "🖥️", t: "$2,000 home office budget", d: "Set up your workspace the way you like it. Spend it however you want." },
  { i: "📚", t: "$2,000 learning budget", d: "Courses, books, conferences — invest in yourself and Lumio pays." },
  { i: "🏖️", t: "Unlimited PTO", d: "We trust you to manage your time. Minimum 15 days encouraged." },
  { i: "🌍", t: "Remote-first", d: "Work from anywhere. We have no office and no plans to get one." },
];

const deptColors: Record<string, string> = {
  Engineering: "badge-brand",
  Product: "badge-green",
  Design: "badge-amber",
  GTM: "badge-gray",
};

export default function CareersPage() {
  const [dept, setDept] = useState("All");

  const filtered = JOBS.filter((j) => dept === "All" || j.dept === dept);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Careers</span>
          <h1>Build the future of product analytics</h1>
          <p>We're a remote-first team obsessed with making analytics accessible to every product team on the planet.</p>
        </div>
      </div>

      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our culture</span>
            <h2>How we work</h2>
          </div>
          <div className="grid-3">
            {[
              { i: "🌍", t: "Remote-first, async-first", d: "No offices. No 9-5. We ship across time zones and trust people to do their best work wherever they are." },
              { i: "📈", t: "Equity for everyone", d: "Every full-time hire gets meaningful equity. We're building this together, and everyone should share in the outcome." },
              { i: "⚡", t: "Move fast, really", d: "We ship weekly. We cut scope aggressively. We'd rather deliver 80% now than 100% in 6 months." },
            ].map((v) => (
              <div className="card" key={v.t}>
                <div className="ico">{v.i}</div>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Open roles</span>
            <h2>{filtered.length} open position{filtered.length !== 1 ? "s" : ""}</h2>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
            {DEPTS.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                style={{
                  padding: "7px 16px", borderRadius: 20, border: "1.5px solid", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", background: dept === d ? "var(--brand)" : "#fff",
                  color: dept === d ? "#fff" : "var(--body)", borderColor: dept === d ? "var(--brand)" : "var(--line)", transition: "all .15s",
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((job) => (
              <div
                key={job.title}
                className="card"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                    <span className={`badge ${deptColors[job.dept] ?? "badge-gray"}`}>{job.dept}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{job.location} · {job.type}</span>
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 6 }}>{job.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--muted)" }}>{job.desc}</p>
                </div>
                <a
                  href="/contact?subject=Job+application"
                  className="btn btn-primary"
                  style={{ flexShrink: 0 }}
                  onClick={() => (window as any).shubpy?.track?.("job_apply_clicked", { role: job.title })}
                >
                  Apply →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Benefits</span>
            <h2>What we offer</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
            {PERKS.map((p) => (
              <div className="card" key={p.t}>
                <div className="ico">{p.i}</div>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block cta">
        <div className="container">
          <h2>Don't see the right role?</h2>
          <p>We're always interested in exceptional people. Send us a note and tell us what you'd build.</p>
          <a className="btn btn-primary btn-lg" href="/contact?subject=General+inquiry">Get in touch</a>
        </div>
      </section>
    </>
  );
}
