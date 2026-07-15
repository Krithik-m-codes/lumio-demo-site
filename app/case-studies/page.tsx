import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Stories — Lumio Analytics",
  description: "See how 2,500+ product teams use Lumio to grow their products.",
};

const CASES = [
  { slug: "aerolab", company: "Aerolab", industry: "B2B SaaS", result: "Reduced churn 28% by finding two hidden aha moments in cohort data.", desc: "45-person startup that used retention cohort analysis to identify the exact behaviors that separated churned from retained users." },
  { slug: "quanta", company: "Quanta", industry: "Fintech", result: "Found 3 critical payment funnel drop-offs and recovered $2M ARR.", desc: "Payments platform that discovered segment-specific drop-off patterns invisible in aggregate funnel data." },
  { slug: "hoverboard", company: "Hoverboard", industry: "E-commerce", result: "2x email revenue and 41% lower CAC with behavioral segments.", desc: "E-commerce brand that replaced demographic targeting with behavioral segments built from Lumio event data." },
];

const QUOTES = [
  { q: "Lumio answered questions in 10 minutes that used to take us 2 weeks to get from the data team.", who: "Priya Nair · VP Product, Brightfin" },
  { q: "We found our activation event in day one and doubled our onboarding completion rate in a month.", who: "Dev Kim · Head of Growth, Aerolab" },
  { q: "The funnel segmentation feature alone paid for three years of Lumio in the first quarter.", who: "Sara Chen · Head of Data, Quanta" },
];

export default function CaseStudiesPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Customer stories</span>
          <h1>See how teams use Lumio to grow</h1>
          <p>Real companies, real results — from reducing churn to doubling revenue.</p>
        </div>
      </div>

      {/* Stats */}
      <section style={{ borderBottom: "1px solid var(--line)", borderTop: "1px solid var(--line)", background: "var(--bg-soft)", padding: "36px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }}>
            {[
              { n: "2,500+", l: "Companies" },
              { n: "48B", l: "Events / month" },
              { n: "2.8x", l: "Avg. growth" },
              { n: "4.9 / 5", l: "Customer rating" },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "var(--brand)" }}>{s.n}</div>
                <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="block">
        <div className="container">
          <a href="/case-studies/brightfin" style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{ background: "var(--ink)", border: "none", padding: "48px 44px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 40, alignItems: "center" }}
            >
              <div>
                <span className="eyebrow" style={{ background: "rgba(255,255,255,0.1)", color: "#c7d2fe" }}>Featured story</span>
                <h2 style={{ color: "#fff", fontSize: "clamp(24px,3vw,36px)", marginTop: 14, marginBottom: 16 }}>
                  How Brightfin replaced 3 weeks of data work with one afternoon
                </h2>
                <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                  Brightfin's VP Product was spending three weeks setting up analytics for every new experiment. With Lumio, that became an afternoon — and conversion went up 34%.
                </p>
                <span className="btn btn-primary">Read the story →</span>
              </div>
              <div style={{ display: "grid", gap: 16 }}>
                {[
                  { n: "34%", l: "Conversion lift" },
                  { n: "3 weeks → afternoon", l: "Setup time" },
                  { n: "2.2x", l: "Experiment velocity" },
                ].map((s) => (
                  <div key={s.l} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{s.n}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Grid */}
      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="grid-3">
            {CASES.map((c) => (
              <a key={c.slug} href={`/case-studies/${c.slug}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>{c.company}</div>
                    <span className="badge badge-gray">{c.industry}</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4 }}>{c.result}</p>
                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>{c.desc}</p>
                  <span style={{ color: "var(--brand)", fontSize: 14, fontWeight: 600 }}>Read story →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="block">
        <div className="container">
          <div className="section-head">
            <h2>What customers say</h2>
          </div>
          <div className="grid-3">
            {QUOTES.map((q, i) => (
              <div key={i} className="card" style={{ background: "var(--bg-soft)" }}>
                <p style={{ fontSize: 15, fontStyle: "italic", color: "var(--body)", lineHeight: 1.7, marginBottom: 16 }}>
                  &ldquo;{q.q}&rdquo;
                </p>
                <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{q.who}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block cta">
        <div className="container">
          <h2>Ready to write your own story?</h2>
          <p>Join 2,500+ teams using Lumio to grow smarter. No card required.</p>
          <a className="btn btn-primary btn-lg" href="/checkout">Start free →</a>
        </div>
      </section>
    </>
  );
}
