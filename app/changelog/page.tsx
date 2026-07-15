import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — Lumio Analytics",
  description: "Every Lumio release, new feature, and improvement — newest first.",
};

const RELEASES = [
  {
    version: "v3.4.0",
    date: "Jun 15, 2026",
    headline: "Realtime funnels",
    items: [
      { type: "New", text: "Funnels now update in real time — no page refresh needed." },
      { type: "New", text: "Funnel branching: model multi-path funnels with OR steps." },
      { type: "Improved", text: "Funnel conversion window selector redesigned for clarity." },
      { type: "Fixed", text: "Funnel export to CSV included incorrect step timestamps." },
    ],
  },
  {
    version: "v3.3.0",
    date: "Jun 1, 2026",
    headline: "Cohort Explorer",
    items: [
      { type: "New", text: "Visual cohort builder — define cohorts with a point-and-click interface, no SQL." },
      { type: "New", text: "Side-by-side cohort comparison: compare up to 4 cohorts on a single retention chart." },
      { type: "Improved", text: "Cohort chart rendering is now 60% faster on large datasets." },
    ],
  },
  {
    version: "v3.2.0",
    date: "May 20, 2026",
    headline: "Dashboard sharing & Slack digests",
    items: [
      { type: "New", text: "Shareable dashboard links — share a live dashboard with anyone, no account required." },
      { type: "New", text: "CSV export for every chart type in dashboard view." },
      { type: "New", text: "Slack digest scheduling: send dashboard snapshots to any channel on a cron schedule." },
      { type: "Fixed", text: "Dashboard date range picker did not respect workspace timezone." },
    ],
  },
  {
    version: "v3.1.0",
    date: "May 5, 2026",
    headline: "SDK v2",
    items: [
      { type: "New", text: "Full TypeScript support across all SDK methods." },
      { type: "Improved", text: "Browser bundle is 40% smaller (12kb → 7kb gzipped)." },
      { type: "New", text: "React Native beta SDK — iOS and Android event tracking from a single package." },
    ],
  },
  {
    version: "v3.0.0",
    date: "Apr 15, 2026",
    headline: "New query engine & redesigned UI",
    items: [
      { type: "New", text: "Columnar query engine rewrite — most queries now 3x faster." },
      { type: "New", text: "Redesigned workspace UI — new sidebar navigation, command palette, and dark mode." },
      { type: "New", text: "Team workspaces: invite teammates, assign roles, manage permissions." },
      { type: "New", text: "Event Debugger: see events arrive in real time during development." },
      { type: "Improved", text: "All chart types now support annotations." },
    ],
  },
  {
    version: "v2.8.0",
    date: "Mar 28, 2026",
    headline: "Integrations: Salesforce, HubSpot, Stripe",
    items: [
      { type: "New", text: "Salesforce CRM sync — enrich events with deal and account properties from Salesforce." },
      { type: "New", text: "HubSpot integration — identify Lumio users with HubSpot contact data." },
      { type: "New", text: "Stripe revenue events — automatically ingest subscription lifecycle events from Stripe." },
    ],
  },
];

const typeColors: Record<string, string> = {
  New: "badge-brand",
  Improved: "badge-green",
  Fixed: "badge-amber",
};

export default function ChangelogPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Changelog</span>
          <h1>What's new in Lumio</h1>
          <p>Every release, improvement, and fix — shipped weekly, documented here.</p>
        </div>
      </div>

      <section className="block">
        <div className="container" style={{ maxWidth: 820 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {RELEASES.map((release, i) => (
              <div
                key={release.version}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "0 32px",
                  paddingBottom: i < RELEASES.length - 1 ? 48 : 0,
                  marginBottom: i < RELEASES.length - 1 ? 48 : 0,
                  borderBottom: i < RELEASES.length - 1 ? "1px solid var(--line)" : "none",
                }}
              >
                {/* Left: version + date */}
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--brand)", fontFamily: "monospace" }}>
                    {release.version}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{release.date}</div>
                </div>

                {/* Right: content */}
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>{release.headline}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {release.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span className={`badge ${typeColors[item.type] ?? "badge-gray"}`} style={{ flexShrink: 0, marginTop: 1 }}>
                          {item.type}
                        </span>
                        <span style={{ fontSize: 15, color: "var(--body)", lineHeight: 1.6 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block cta">
        <div className="container">
          <h2>Want early access to new features?</h2>
          <p>Join our beta program and help shape what ships next.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn btn-primary btn-lg" href="/contact?subject=Beta+program">Join the beta</a>
            <a className="btn btn-ghost btn-lg" href="/docs">Read the docs</a>
          </div>
        </div>
      </section>
    </>
  );
}
