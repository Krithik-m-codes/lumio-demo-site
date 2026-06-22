"use client";

import { useState, useEffect } from "react";

export const POSTS = [
  {
    slug: "funnel-analysis-101",
    title: "Funnel analysis 101: how to find where users drop",
    category: "Product",
    date: "Jun 10, 2026",
    readTime: "7 min",
    excerpt: "Funnels are the most powerful tool in any product analyst's kit — but only if you define them correctly. Here's how to build funnels that actually answer questions.",
    author: "Priya Nair",
  },
  {
    slug: "retention-cohorts-deep-dive",
    title: "Retention cohorts: the metric your team is ignoring",
    category: "Analytics",
    date: "Jun 3, 2026",
    readTime: "10 min",
    excerpt: "Monthly active users is a vanity metric. Retention cohorts tell you whether the product actually works. Learn to read them and find the leaks.",
    author: "James Park",
  },
  {
    slug: "event-schema-design",
    title: "How to design an event schema that scales",
    category: "Engineering",
    date: "May 28, 2026",
    readTime: "12 min",
    excerpt: "Bad event naming causes dashboard chaos six months later. Here's the naming convention and property structure we've seen work across 500+ workspaces.",
    author: "Ines Martín",
  },
  {
    slug: "gdpr-and-analytics",
    title: "GDPR, CCPA, and product analytics: the practical guide",
    category: "Compliance",
    date: "May 20, 2026",
    readTime: "9 min",
    excerpt: "Privacy laws don't have to break your analytics. Here's how to stay compliant without losing the signal you need to make product decisions.",
    author: "Tom Halley",
  },
  {
    slug: "dashboards-that-get-used",
    title: "Dashboards nobody ignores: five design principles",
    category: "Product",
    date: "May 14, 2026",
    readTime: "6 min",
    excerpt: "Most dashboards are built for the person who made them. These five principles ensure your dashboard gets opened — and acted on — by the whole team.",
    author: "Priya Nair",
  },
  {
    slug: "sdk-integration-guide",
    title: "Integrating Lumio in under 30 minutes",
    category: "Engineering",
    date: "May 7, 2026",
    readTime: "8 min",
    excerpt: "A step-by-step guide to installing the SDK, sending your first events, and verifying they arrive — no data engineer required.",
    author: "Ines Martín",
  },
  {
    slug: "product-market-fit-analytics",
    title: "How to use analytics to validate product-market fit",
    category: "Analytics",
    date: "May 1, 2026",
    readTime: "11 min",
    excerpt: "PMF isn't a feeling — it's a signal in your data. Here's how to instrument your product to detect fit before your investors ask about it.",
    author: "James Park",
  },
  {
    slug: "a-b-testing-best-practices",
    title: "A/B testing best practices: run tests that actually mean something",
    category: "Product",
    date: "Apr 25, 2026",
    readTime: "9 min",
    excerpt: "Most A/B tests are statistically invalid. Here's how to design experiments that produce results you can ship with confidence.",
    author: "Priya Nair",
  },
  {
    slug: "feature-flags-analytics",
    title: "Feature flags and event tracking: better together",
    category: "Engineering",
    date: "Apr 18, 2026",
    readTime: "7 min",
    excerpt: "Combining feature flags with structured event tracking gives you surgical control over rollouts and the data to know if they worked.",
    author: "Ines Martín",
  },
  {
    slug: "north-star-metric",
    title: "Choosing and tracking your north star metric",
    category: "Analytics",
    date: "Apr 11, 2026",
    readTime: "8 min",
    excerpt: "A north star metric aligns your entire company around the one number that best predicts long-term success. Here's how to find yours and keep it honest.",
    author: "James Park",
  },
  {
    slug: "activation-rate-guide",
    title: "Activation rate: what it is and how to improve it",
    category: "Product",
    date: "Apr 4, 2026",
    readTime: "10 min",
    excerpt: "Activation is the moment your product delivers its first real value. Most teams measure it wrong. Here's the right way to define, track, and improve it.",
    author: "Priya Nair",
  },
  {
    slug: "data-warehouse-vs-product-analytics",
    title: "Data warehouse vs. product analytics: when to use each",
    category: "Engineering",
    date: "Mar 28, 2026",
    readTime: "13 min",
    excerpt: "Both tools have a place in a modern data stack — but teams constantly confuse them. Here's a clear framework for deciding which one to reach for.",
    author: "Tom Halley",
  },
  {
    slug: "user-segmentation-strategies",
    title: "Behavioral segmentation done right",
    category: "Analytics",
    date: "Mar 21, 2026",
    readTime: "9 min",
    excerpt: "Demographic segments are table stakes. Behavioral segments — built from what users actually do — are where you find the real growth levers.",
    author: "James Park",
  },
  {
    slug: "product-led-growth-analytics",
    title: "Analytics for product-led growth companies",
    category: "Product",
    date: "Mar 14, 2026",
    readTime: "11 min",
    excerpt: "PLG companies live and die by in-product signals. Here are the metrics, funnels, and dashboards that PLG teams should instrument from day one.",
    author: "Priya Nair",
  },
  {
    slug: "revenue-analytics-saas",
    title: "MRR, ARR, NRR: a SaaS revenue analytics deep dive",
    category: "Analytics",
    date: "Mar 7, 2026",
    readTime: "10 min",
    excerpt: "Revenue metrics are deceptively simple to define and endlessly easy to calculate wrong. Here's how to get them right and build a dashboard that CFOs trust.",
    author: "Tom Halley",
  },
  {
    slug: "mobile-analytics-guide",
    title: "Mobile event tracking best practices",
    category: "Engineering",
    date: "Feb 28, 2026",
    readTime: "8 min",
    excerpt: "Mobile analytics has unique challenges: offline events, session fragmentation, and app store constraints. Here's how to instrument reliably across iOS and Android.",
    author: "Ines Martín",
  },
  {
    slug: "dashboard-design-principles",
    title: "Advanced dashboard design: beyond the basics",
    category: "Product",
    date: "Feb 21, 2026",
    readTime: "7 min",
    excerpt: "Once you've mastered the basics, these advanced principles separate dashboards that drive decisions from dashboards that just display numbers.",
    author: "Priya Nair",
  },
  {
    slug: "real-time-vs-batch-analytics",
    title: "Real-time vs. batch analytics: architecture tradeoffs",
    category: "Engineering",
    date: "Feb 14, 2026",
    readTime: "12 min",
    excerpt: "Real-time analytics feels like a requirement until you see the infrastructure cost. Here's how to make the right architectural choice for your stage.",
    author: "Tom Halley",
  },
  {
    slug: "customer-journey-mapping",
    title: "Mapping customer journeys with event data",
    category: "Analytics",
    date: "Feb 7, 2026",
    readTime: "9 min",
    excerpt: "Event streams are the raw material for journey maps that actually reflect how users behave — not how you imagined they would. Here's the methodology.",
    author: "James Park",
  },
  {
    slug: "onboarding-analytics",
    title: "Measuring and improving user onboarding with analytics",
    category: "Product",
    date: "Jan 31, 2026",
    readTime: "8 min",
    excerpt: "Onboarding is the highest-leverage surface in any SaaS product. Here's the complete analytics framework for diagnosing and fixing onboarding drop-off.",
    author: "Priya Nair",
  },
];

const CATEGORIES = ["All", "Product", "Analytics", "Engineering", "Compliance", "Growth", "Strategy"];

const categoryColors: Record<string, string> = {
  Product: "badge-brand",
  Analytics: "badge-green",
  Engineering: "badge-amber",
  Compliance: "badge-gray",
  Growth: "badge-green",
  Strategy: "badge-brand",
};

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [reads, setReads] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("lumio_reads");
    if (stored) setReads(JSON.parse(stored));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    if (q.trim().length > 0) {
      (window as any).shubpy?.track?.("blog_searched", { query: q });
    }
  };

  const filtered = POSTS.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Blog</span>
          <h1>Product analytics, decoded</h1>
          <p>Deep-dives, how-tos, and best practices from the Lumio team.</p>
        </div>
      </div>

      <section className="block">
        <div className="container">
          <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search articles…"
              style={{ maxWidth: 280, flex: "none" }}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    border: "1.5px solid",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: category === cat ? "var(--brand)" : "#fff",
                    color: category === cat ? "#fff" : "var(--body)",
                    borderColor: category === cat ? "var(--brand)" : "var(--line)",
                    transition: "all .15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {reads.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>
                ↩ Continue reading
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {reads.map((slug) => {
                  const post = POSTS.find((p) => p.slug === slug);
                  if (!post) return null;
                  return (
                    <a key={slug} href={`/blog/${slug}`} className="badge badge-brand">
                      {post.title.length > 48 ? post.title.slice(0, 48) + "…" : post.title}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
              No articles match your search.{" "}
              <button
                style={{ background: "none", border: "none", color: "var(--brand)", cursor: "pointer", fontWeight: 600 }}
                onClick={() => { setSearch(""); setCategory("All"); }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 22 }}>
              {filtered.map((post) => {
                const isRead = reads.includes(post.slug);
                return (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className={`badge ${categoryColors[post.category] ?? "badge-gray"}`}>
                          {post.category}
                        </span>
                        {isRead && <span style={{ fontSize: 11, color: "var(--muted)" }}>✓ Read</span>}
                      </div>
                      <h3 style={{ fontSize: 17, lineHeight: 1.3, flex: 1 }}>{post.title}</h3>
                      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{post.excerpt}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginTop: "auto" }}>
                        <span>{post.author}</span>
                        <span>{post.date} · {post.readTime}</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
