import Link from "next/link";

export const metadata = {
  title: "About Us — Lumio Analytics",
  description:
    "Learn about the team and mission behind Lumio Analytics — the product analytics platform built for teams who care about data and privacy.",
};

const founders = [
  {
    name: "Priya Nair",
    role: "CEO & Co-founder",
    bio: "Previously led growth at two B2B SaaS companies. Obsessed with turning messy data into clear decisions.",
  },
  {
    name: "James Park",
    role: "CTO & Co-founder",
    bio: "Infrastructure engineer at heart. Built Lumio's event pipeline to handle billions of events without breaking a sweat.",
  },
  {
    name: "Ines Martín",
    role: "CPO & Co-founder",
    bio: "Spent a decade designing analytics tools and grew tired of products that made simple questions hard to answer.",
  },
];

const values = [
  {
    title: "Ship fast & learn",
    description:
      "We move quickly, release often, and treat every release as a learning opportunity. Speed is only useful when paired with curiosity.",
  },
  {
    title: "Privacy by default",
    description:
      "Privacy is not an afterthought or a checkbox. Every feature we design starts with the question: what is the minimum data we actually need?",
  },
  {
    title: "Transparency",
    description:
      "We publish our uptime, share our roadmap, and tell customers when we make mistakes. Honest relationships outlast slick marketing.",
  },
  {
    title: "Customer obsession",
    description:
      "Our roadmap is driven by conversations, not assumptions. We stay close to the teams using Lumio every day so we solve real problems.",
  },
];

const stats = [
  { value: "2,500+", label: "Workspaces" },
  { value: "48B", label: "Events processed" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "12+", label: "Integrations" },
];

export default function AboutPage() {
  return (
    <main>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">About us</div>
          <h1>
            We believe great products are built on great data
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--body)",
              maxWidth: 620,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Lumio Analytics gives product teams the clarity they need to make
            confident decisions — without the noise, vendor lock-in, or privacy
            trade-offs that come with legacy tools.
          </p>
        </div>
      </section>

      {/* Mission statement */}
      <section
        style={{
          background: "var(--ink)",
          padding: "80px 0",
        }}
      >
        <div className="container">
          <blockquote className="quote">
            <p>
              &ldquo;Analytics should make you feel more confident about your
              product, not more confused. We started Lumio because we were tired
              of spending days wrangling dashboards instead of shipping features
              our users actually wanted.&rdquo;
            </p>
            <footer
              style={{
                marginTop: "1.5rem",
                color: "var(--brand-soft)",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              — The Lumio founding team
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Company story */}
      <section className="block">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our story</span>
            <h2>Built out of frustration, refined by feedback</h2>
            <p>
              In 2021, three product builders met while consulting for a
              fast-growing fintech. They were using four different analytics
              tools, none of which talked to each other, and they were still
              guessing why their activation rate had dropped by eight points.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "start",
              marginTop: "3rem",
            }}
            className="grid-2"
          >
            <div>
              <p style={{ color: "var(--body)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                Priya, James, and Ines spent six weeks building a lightweight
                internal pipeline to unify their event data. It was scrappy, but
                it worked. Within a month, they had answers to questions that
                previously took a data analyst two days to produce.
              </p>
              <p style={{ color: "var(--body)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                They quit their consulting contracts in early 2022, incorporated
                Lumio, and opened a private beta to ten teams. The feedback was
                immediate: teams loved the speed and simplicity, but wanted
                better privacy controls and deeper funnel analysis.
              </p>
              <p style={{ color: "var(--body)", lineHeight: 1.8 }}>
                Today Lumio processes tens of billions of events every month for
                product teams across fintech, SaaS, and e-commerce — and the
                founding team still reads every support ticket.
              </p>
            </div>

            {/* Founders */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {founders.map((founder) => (
                <div key={founder.name} className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "var(--brand-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--brand)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {founder.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "0.15rem" }}>
                      {founder.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "var(--brand)",
                        marginBottom: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {founder.role}
                    </div>
                    <p style={{ fontSize: "0.92rem", color: "var(--body)", lineHeight: 1.65, margin: 0 }}>
                      {founder.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we stand for</span>
            <h2>The values that shape every decision we make</h2>
          </div>
          <div className="grid-2" style={{ marginTop: "3rem" }}>
            {values.map((value) => (
              <div key={value.title} className="card">
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {value.title}
                </h3>
                <p style={{ color: "var(--body)", lineHeight: 1.7, margin: 0, fontSize: "0.95rem" }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="block">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">By the numbers</span>
            <h2>Trusted by teams who care about their users</h2>
          </div>
          <div className="grid-2" style={{ marginTop: "3rem" }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="card"
                style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: "var(--brand)",
                    lineHeight: 1,
                    marginBottom: "0.6rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="badge badge-brand" style={{ marginBottom: "1.25rem", display: "inline-block" }}>
            Join us
          </span>
          <h2 style={{ marginBottom: "1rem" }}>Want to help build Lumio?</h2>
          <p
            style={{
              color: "var(--body)",
              maxWidth: 520,
              margin: "0 auto 2rem",
              lineHeight: 1.7,
            }}
          >
            We are a small, remote-first team with big ambitions. If you care
            about data, privacy, and building tools that genuinely help people
            ship better software, we would love to hear from you.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/careers" className="btn btn-primary">
              View open roles
            </Link>
            <Link href="/contact" className="btn-ghost">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
