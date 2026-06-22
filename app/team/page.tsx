import Link from "next/link";

const leadershipTeam = [
  {
    name: "Priya Nair",
    title: "Chief Executive Officer",
    bio: "Previously led product growth at Amplitude and Mixpanel, where she scaled both platforms to 10k+ enterprise customers. Priya founded Lumio to make deep analytics accessible to every product team.",
    initials: "PN",
    color: "#4f46e5",
  },
  {
    name: "James Park",
    title: "Chief Technology Officer",
    bio: "Ex-Google engineer with 12 years building distributed systems at scale. James architected data pipelines processing billions of events daily before joining Lumio to lead its engineering org.",
    initials: "JP",
    color: "#0891b2",
  },
  {
    name: "Ines Martín",
    title: "Chief Product Officer",
    bio: "Built product from zero to one at two YC-backed companies, both of which achieved successful exits. Ines brings a customer-obsessed approach to shaping Lumio's roadmap and vision.",
    initials: "IM",
    color: "#7c3aed",
  },
];

const engineeringTeam = [
  {
    name: "Tariq Osei",
    title: "Frontend Engineer",
    bio: "Crafts the interactive dashboards and data visualization experiences that Lumio's users rely on every day.",
    initials: "TO",
    color: "#4f46e5",
  },
  {
    name: "Mei-Lin Chen",
    title: "Backend Engineer",
    bio: "Designs and maintains the APIs and core services that power reliable, real-time analytics at scale.",
    initials: "MC",
    color: "#0891b2",
  },
  {
    name: "Dmitri Volkov",
    title: "Data Engineering",
    bio: "Builds the ingestion pipelines and warehouse integrations that transform raw events into actionable insight.",
    initials: "DV",
    color: "#059669",
  },
  {
    name: "Aisha Kamara",
    title: "Machine Learning",
    bio: "Develops the predictive models and anomaly-detection algorithms that surface signals before they become surprises.",
    initials: "AK",
    color: "#d97706",
  },
  {
    name: "Luca Ferretti",
    title: "DevOps & Infrastructure",
    bio: "Keeps Lumio's infrastructure humming with 99.99% uptime through careful automation and observability practices.",
    initials: "LF",
    color: "#7c3aed",
  },
  {
    name: "Sara Johansson",
    title: "Security Engineer",
    bio: "Champions data privacy and compliance, ensuring Lumio meets SOC 2, GDPR, and enterprise security standards.",
    initials: "SJ",
    color: "#dc2626",
  },
];

const designProductTeam = [
  {
    name: "Noah Abramowitz",
    title: "Head of Design",
    bio: "Defines the visual language and interaction patterns that make complex analytics feel effortlessly intuitive.",
    initials: "NA",
    color: "#4f46e5",
  },
  {
    name: "Fatima Al-Rashid",
    title: "Product Designer",
    bio: "Conducts user research and translates insights into wireframes, prototypes, and polished UI components.",
    initials: "FA",
    color: "#0891b2",
  },
  {
    name: "Carlos Reyes",
    title: "Product Manager",
    bio: "Owns the core analytics product area, working closely with customers to prioritize features that drive real value.",
    initials: "CR",
    color: "#7c3aed",
  },
];

const goToMarketTeam = [
  {
    name: "Hannah Birch",
    title: "Head of Marketing",
    bio: "Leads brand, content, and demand-generation strategy to bring Lumio's story to the right audiences.",
    initials: "HB",
    color: "#4f46e5",
  },
  {
    name: "Kofi Mensah",
    title: "Sales Lead",
    bio: "Partners with mid-market and enterprise teams to help them unlock the full value of product analytics.",
    initials: "KM",
    color: "#059669",
  },
  {
    name: "Yuki Tanaka",
    title: "Customer Success",
    bio: "Ensures every Lumio customer achieves their goals through proactive onboarding, training, and support.",
    initials: "YT",
    color: "#d97706",
  },
];

function Avatar({ initials, color, size = 80 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginBottom: "1rem",
      }}
    >
      <span
        style={{
          color: "#ffffff",
          fontSize: size * 0.35,
          fontWeight: 700,
          letterSpacing: "0.03em",
          lineHeight: 1,
        }}
      >
        {initials}
      </span>
    </div>
  );
}

function LeadershipCard({ person }: { person: { name: string; title: string; bio: string; initials: string; color: string } }) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem 1.75rem",
        gap: "0",
      }}
    >
      <Avatar initials={person.initials} color={person.color} size={88} />
      <h3
        style={{
          fontSize: "1.15rem",
          fontWeight: 700,
          color: "var(--ink)",
          margin: "0 0 0.5rem",
        }}
      >
        {person.name}
      </h3>
      <span
        className="badge"
        style={{
          marginBottom: "1rem",
          background: "var(--brand-soft)",
          color: "var(--brand)",
        }}
      >
        {person.title}
      </span>
      <p
        style={{
          color: "var(--body)",
          fontSize: "0.9rem",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {person.bio}
      </p>
    </div>
  );
}

function TeamCard({ person }: { person: { name: string; title: string; bio: string; initials: string; color: string } }) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "1.5rem",
        gap: "0",
      }}
    >
      <Avatar initials={person.initials} color={person.color} size={56} />
      <h4
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--ink)",
          margin: "0 0 0.35rem",
        }}
      >
        {person.name}
      </h4>
      <span
        className="badge"
        style={{
          marginBottom: "0.85rem",
          background: "var(--brand-soft)",
          color: "var(--brand)",
          fontSize: "0.72rem",
        }}
      >
        {person.title}
      </span>
      <p
        style={{
          color: "var(--muted)",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {person.bio}
      </p>
    </div>
  );
}

export default function TeamPage() {
  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Our team</p>
          <h1>The people building Lumio</h1>
          <p
            style={{
              color: "var(--body)",
              fontSize: "1.15rem",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            We are a distributed team of builders, researchers, and customer
            advocates united by one mission: making product analytics so clear
            that every team can act on it confidently.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Leadership</p>
            <h2>Meet the founders</h2>
            <p style={{ color: "var(--body)", maxWidth: "480px", margin: "0 auto" }}>
              Three operators who have lived the pain of bad analytics and came
              together to build something better.
            </p>
          </div>
          <div className="grid-3">
            {leadershipTeam.map((person) => (
              <LeadershipCard key={person.name} person={person} />
            ))}
          </div>
        </div>
      </section>

      {/* Engineering */}
      <section className="block">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Engineering</p>
            <h2>The builders</h2>
            <p style={{ color: "var(--body)", maxWidth: "480px", margin: "0 auto" }}>
              A lean, senior engineering team obsessed with performance,
              reliability, and shipping fast without breaking things.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {engineeringTeam.map((person) => (
              <TeamCard key={person.name} person={person} />
            ))}
          </div>
        </div>
      </section>

      {/* Design & Product */}
      <section className="block" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Design & Product</p>
            <h2>Craft and clarity</h2>
            <p style={{ color: "var(--body)", maxWidth: "480px", margin: "0 auto" }}>
              The team turning complex data into interfaces so intuitive that
              users do not even notice they are doing analytics.
            </p>
          </div>
          <div className="grid-3">
            {designProductTeam.map((person) => (
              <TeamCard key={person.name} person={person} />
            ))}
          </div>
        </div>
      </section>

      {/* Go-to-Market */}
      <section className="block">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Go-to-Market</p>
            <h2>Growth & customer success</h2>
            <p style={{ color: "var(--body)", maxWidth: "480px", margin: "0 auto" }}>
              The team that brings Lumio to market and makes sure every
              customer gets lasting value from day one.
            </p>
          </div>
          <div className="grid-3">
            {goToMarketTeam.map((person) => (
              <TeamCard key={person.name} person={person} />
            ))}
          </div>
        </div>
      </section>

      {/* Join the Team CTA */}
      <section
        className="block"
        style={{
          background: "var(--brand)",
          borderRadius: "var(--radius)",
          margin: "0 auto 4rem",
          maxWidth: "900px",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <div>
          <p
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.7)",
              borderColor: "rgba(255,255,255,0.25)",
            }}
          >
            We are hiring
          </p>
          <h2
            style={{
              color: "#ffffff",
              fontSize: "2rem",
              margin: "0.5rem 0 1rem",
            }}
          >
            Join the team building Lumio
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "1.05rem",
              maxWidth: "500px",
              margin: "0 auto 2rem",
              lineHeight: 1.7,
            }}
          >
            We are always looking for thoughtful, curious people who want to
            make a real dent in how teams understand their products.
          </p>
          <Link
            href="/careers"
            className="btn btn-primary"
            style={{
              background: "#ffffff",
              color: "var(--brand)",
              fontWeight: 700,
              padding: "0.75rem 2rem",
              borderRadius: "var(--radius)",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "0.95rem",
            }}
          >
            View open roles
          </Link>
        </div>
      </section>
    </main>
  );
}
