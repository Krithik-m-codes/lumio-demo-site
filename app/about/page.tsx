import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Lumio Analytics",
  description: "The story behind Lumio: why we built it, what we believe, and where we're going.",
};

const VALUES = [
  { i: "⚡", t: "Ship fast, learn faster", d: "We believe small bets, shipped quickly, beat long bets shipped slowly. Our roadmap is measured in weeks, not quarters." },
  { i: "🔒", t: "Privacy by default", d: "We don't sell your data. We don't share it. Privacy is an architectural decision, not a checkbox we tick at the end." },
  { i: "◎", t: "Radical transparency", d: "Our pricing is public. Our roadmap is shared. Our metrics are honest. We say what we mean and mean what we say." },
  { i: "♥", t: "Customer obsession", d: "Every feature starts with a customer conversation. If we can't name the person it helps, we don't build it." },
];

const STATS = [
  { n: "2,500+", l: "Workspaces" },
  { n: "48B", l: "Events / month" },
  { n: "99.99%", l: "Uptime SLA" },
  { n: "12+", l: "Integrations" },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">About us</span>
          <h1>We believe great products are built on great data.</h1>
          <p>Lumio exists because product teams deserve analytics that actually answer questions — without a data warehouse, a pipeline project, or a BI team in the way.</p>
        </div>
      </div>

      {/* Mission */}
      <section className="block" style={{ background: "var(--ink)", color: "#e2e8f0" }}>
        <div className="container" style={{ maxWidth: 780, textAlign: "center" }}>
          <p style={{ fontSize: "clamp(20px, 2.8vw, 30px)", fontWeight: 700, lineHeight: 1.4, color: "#fff" }}>
            "Our mission is to make every product team as data-capable as the best engineering team in the world — regardless of headcount."
          </p>
          <p style={{ marginTop: 20, color: "#94a3b8", fontSize: 15 }}>Priya Nair · CEO &amp; Co-founder</p>
        </div>
      </section>

      {/* Story */}
      <section className="block">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="section-head" style={{ textAlign: "left", margin: "0 0 36px" }}>
            <span className="eyebrow">Our story</span>
            <h2 style={{ marginTop: 12 }}>Built out of frustration</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, fontSize: 16, color: "var(--body)", lineHeight: 1.8 }}>
            <p>In 2021, Priya, James, and Ines were working at different companies — all three fighting the same battle. Every time they wanted to answer a product question, they needed a data engineer. Every dashboard required a pipeline. Every funnel analysis was a two-week ticket.</p>
            <p>The existing tools were either too simple (limited to basic counts) or too complex (required a data warehouse and a team to maintain it). There was nothing in the middle for the PM who needed answers this afternoon, not next quarter.</p>
            <p>So they built Lumio. Starting with a single SDK and a canvas of charts, they tested it with 20 beta customers in three months. By month six, workspaces were growing 40% month-over-month — purely word of mouth.</p>
            <p>Today, over 2,500 product teams use Lumio to ship better products. We're still the same scrappy, opinionated team — we've just got more customers to be obsessed about.</p>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The founders</span>
            <h2>Three founders, one obsession</h2>
          </div>
          <div className="grid-3">
            {[
              { name: "Priya Nair", title: "CEO & Co-founder", init: "PN", bio: "Former VP Product at Amplitude and Principal PM at Mixpanel. Has built product analytics systems for 8 years and still gets angry when funnels are slow." },
              { name: "James Park", title: "CTO & Co-founder", init: "JP", bio: "Ex-Google Staff Engineer on the BigQuery team. Spent 6 years building distributed query engines and is now putting that experience to work for product teams." },
              { name: "Ines Martín", title: "CPO & Co-founder", init: "IM", bio: "Built product at two YC companies (W18, S20). Shipped the first analytics integrations at both. Believes deeply that good design and good data are inseparable." },
            ].map((f) => (
              <div className="card" key={f.name} style={{ textAlign: "center", padding: "36px 28px" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 22, margin: "0 auto 20px" }}>
                  {f.init}
                </div>
                <h3 style={{ fontSize: 18 }}>{f.name}</h3>
                <p style={{ color: "var(--brand)", fontSize: 13, fontWeight: 600, marginTop: 4, marginBottom: 14 }}>{f.title}</p>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="block">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we believe</span>
            <h2>Four values we hire and ship by</h2>
          </div>
          <div className="grid-2">
            {VALUES.map((v) => (
              <div className="card" key={v.t}>
                <div className="ico">{v.i}</div>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {STATS.map((s) => (
              <div key={s.l} style={{ textAlign: "center", padding: "32px 20px", border: "1px solid var(--line)", borderRadius: "var(--radius)", background: "#fff" }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: "var(--brand)", letterSpacing: "-0.03em" }}>{s.n}</div>
                <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 6, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="block cta">
        <div className="container">
          <h2>Join us or work with us</h2>
          <p>We're hiring across engineering, product, and GTM. Or just start a free workspace — no card required.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn btn-primary btn-lg" href="/careers">View open roles</a>
            <a className="btn btn-ghost btn-lg" href="/contact">Get in touch</a>
          </div>
        </div>
      </section>
    </>
  );
}
