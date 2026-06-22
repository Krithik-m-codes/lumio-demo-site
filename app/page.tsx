"use client";

import { useState, useEffect } from "react";

const FEATURES = [
  { i: "▦", t: "Live dashboards", d: "Drag-and-drop charts that update the second an event lands. Share a link, not a screenshot." },
  { i: "⇄", t: "Funnels & retention", d: "Build a funnel in three clicks and see exactly where users drop — by cohort, plan, or device." },
  { i: "◎", t: "Segment anything", d: "Slice every metric by any property. Save segments and reuse them across the workspace." },
  { i: "⚡", t: "Sub-second queries", d: "A columnar engine tuned for product data. Billions of events, answers before you blink." },
  { i: "🔒", t: "Privacy-first", d: "EU/US data residency, PII controls, and SOC 2 Type II out of the box." },
  { i: "{ }", t: "Open by default", d: "A clean REST + SDK story so engineers ship instrumentation in an afternoon." },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lumio_newsletter");
    if (stored) setSubscribed(true);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      localStorage.setItem("lumio_newsletter", email);
      setSubscribed(true);
      setSubmitting(false);
      (window as any).shubpy?.track?.("newsletter_signup", { email, source: "home_hero" });
    }, 800);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">● New · Realtime funnels are here</span>
          <h1>Turn raw product events into answers your team trusts.</h1>
          <p className="sub">
            Lumio is the analytics layer for product teams — pipe in events,
            get clean dashboards, funnels, and retention without a data
            engineer in the loop.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" href="/pricing">
              Start free — no card
            </a>
            <a className="btn btn-ghost btn-lg" href="/docs">
              Read the docs
            </a>
          </div>
          <p className="hero-note">
            Need a hand setting up? Tap the chat bubble in the corner — our
            assistant (and a human if needed) will help you live.
          </p>
        </div>
      </section>

      <section className="logos">
        <div className="container logos-grid">
          <span>NORTHWIND</span>
          <span>Aerolab</span>
          <span>Quanta</span>
          <span>Brightfin</span>
          <span>Hoverboard</span>
          <span>Mosaic</span>
        </div>
      </section>

      <section className="block" id="features">
        <div className="container">
          <div className="section-head">
            <h2>Everything you need to understand your product</h2>
            <p>From the first event to the boardroom slide — one tool, no warehouse babysitting.</p>
          </div>
          <div className="grid-3">
            {FEATURES.map((f) => (
              <div className="card" key={f.t}>
                <div className="ico">{f.i}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="section-head">
            <h2>Live in an afternoon</h2>
            <p>No warehouse, no pipeline project. Three steps.</p>
          </div>
          <div className="steps">
            <div className="step">
              <h3>Drop in the SDK</h3>
              <p>One snippet on web or mobile. Events start flowing immediately — historical backfill optional.</p>
            </div>
            <div className="step">
              <h3>Model your metrics</h3>
              <p>Point-and-click definitions for funnels, retention, and revenue. Versioned and shareable.</p>
            </div>
            <div className="step">
              <h3>Ship the dashboard</h3>
              <p>Publish to the team, embed in Notion, or schedule a Slack digest. Everyone sees the same numbers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <div className="quote">
            <blockquote>
              "We replaced a warehouse, three dbt models, and a BI seat with
              Lumio in a week. Our PMs finally answer their own questions."
            </blockquote>
            <div className="who">Priya Nair · VP Product, Brightfin</div>
          </div>
        </div>
      </section>

      {/* Newsletter signup with localStorage */}
      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container" style={{ maxWidth: 560, textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", marginBottom: 12 }}>
            Stay in the loop
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 28 }}>
            Monthly product updates, best-practice guides, and the occasional deep-dive.
            No spam, unsubscribe any time.
          </p>

          {subscribed ? (
            <div className="alert alert-success" style={{ maxWidth: 380, margin: "0 auto" }}>
              ✓ You&apos;re subscribed! We&apos;ll be in touch.{" "}
              <button
                style={{ background: "none", border: "none", color: "inherit", textDecoration: "underline", cursor: "pointer", fontSize: "inherit" }}
                onClick={() => { localStorage.removeItem("lumio_newsletter"); setSubscribed(false); setEmail(""); }}
              >
                Unsubscribe
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "…" : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="block cta">
        <div className="container">
          <h2>Stop guessing. Start knowing.</h2>
          <p>
            Spin up a workspace in two minutes. Questions? The chat bubble
            connects you to our bot — and a real person when it matters.
          </p>
          <a className="btn btn-primary btn-lg" href="/checkout">
            Create your workspace
          </a>
        </div>
      </section>
    </>
  );
}
