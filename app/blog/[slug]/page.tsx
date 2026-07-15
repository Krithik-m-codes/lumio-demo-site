"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { POSTS } from "../page";

const CONTENT: Record<string, string[]> = {
  "funnel-analysis-101": [
    "A funnel is a sequence of steps you expect users to take on the path to a key action. The key word is *expect* — because the funnel's job is to show you where reality diverges from that expectation.",
    "**Step 1: Define the goal event.** Start at the end. What is the action you care about? A purchase, a subscription activation, a first export? Pick one, then work backwards.",
    "**Step 2: Map the critical path.** List the three to five steps a user must complete to reach the goal. Don't over-engineer it — more steps make the funnel harder to act on.",
    "**Step 3: Choose a conversion window.** Should a user complete all steps within 24 hours? 7 days? 30 days? This matters more than most teams realise. A 24h window shows intent; a 30-day window shows eventual behaviour.",
    "**Step 4: Segment.** A single aggregate funnel hides your real story. Split by acquisition channel, plan tier, device, or any property that might explain the drop. The differences between segments are where the insight lives.",
    "**Step 5: Act on the biggest drop.** Pick the step with the largest percentage drop and focus there. Don't try to fix every step at once — one experiment at a time.",
    "Common mistakes include defining too many steps, using a conversion window that's too short for your user's natural purchase cycle, and not segmenting at all. Avoid these and your funnels will actually drive decisions.",
  ],
  "retention-cohorts-deep-dive": [
    "Monthly active users (MAU) can go up while your product is dying. If you acquire 10,000 users in January and lose 9,500 of them by March, MAU still looks fine — because you kept acquiring. Retention cohorts show you the truth.",
    "**What is a retention cohort?** A cohort is a group of users who performed their first meaningful action (sign-up, first purchase, first event) in the same time period. A retention chart tracks what percentage of each cohort is still active N days/weeks/months later.",
    "**Reading the chart.** The top row is always 100% — that's the cohort at week 0. By week 4, a healthy SaaS product might show 40%. By week 12, the number that matters is whether it has *flattened*. A curve that keeps falling towards zero means users are churning. A curve that flattens means you have a retained core.",
    "**Finding the retention floor.** The floor — where the curve stabilises — is your signal. If it stabilises at 20%, that's your loyal base. If it never stabilises, you have a leaky bucket problem that no amount of acquisition will fix.",
    "**Segmenting cohorts.** Split cohorts by acquisition channel, onboarding path, plan tier, or any property available at sign-up. Often you'll find one segment retains at 2x the average — that's the audience worth doubling down on.",
    "Retention is the most honest product metric. Prioritise it above all others.",
  ],
  "event-schema-design": [
    "Six months after launch, your analytics workspace will either be a gold mine or a wasteland. The difference comes down to one decision made early: your event schema.",
    "**The naming convention.** Use `noun_verb` or `object_action` format. Examples: `user_signed_up`, `dashboard_created`, `export_started`. This makes events self-documenting and sortable.",
    "**Properties are where the power is.** Every event should carry properties that answer 'who, what, where, and how'. A `dashboard_created` event should include `workspace_id`, `plan`, `template_used`, `source` (web/api), and `dashboard_type`.",
    "**The super-properties pattern.** Certain properties appear on every event — `workspace_id`, `user_id`, `plan_tier`, `app_version`. Set these as super-properties in the SDK once and they'll be appended automatically.",
    "**Version your schema.** Add a `schema_version` property to your events. When you rename or restructure, bump the version. Historical queries can then filter by version and avoid mixing data from different schemas.",
    "**What NOT to do.** Don't send PII in event properties. Don't use spaces or camelCase in event names. Don't track everything — track what you've decided to act on. An event with no corresponding decision is noise.",
    "Write a schema doc before you write any code. Future you will be grateful.",
  ],
  "gdpr-and-analytics": [
    "The instinct when GDPR hits is to strip out all analytics. That's an overcorrection. Privacy regulations are about collecting data *lawfully and proportionately* — not avoiding data collection entirely.",
    "**Legitimate interest vs. consent.** For analytics that improve the product you've sold to a user, legitimate interest is usually a valid lawful basis. You don't necessarily need a cookie banner for server-side analytics on your own users. Consult your legal team, but don't assume consent is always required.",
    "**What to anonymise.** IP addresses, email addresses, names — none of these belong in your event schema. Use a pseudonymous `user_id` that maps to PII only in your CRM. Your analytics should only see IDs.",
    "**Data minimisation.** Only track what you need to make decisions. If you can't name a decision that would change based on a property, don't collect it.",
    "**Deletion requests.** When a user invokes the right to erasure, you need to delete their data from your analytics too. This is why anonymised IDs matter — you can delete the mapping table entry and the analytics data becomes permanently anonymised.",
    "**Retention limits.** Define an event retention policy. Most product analytics questions can be answered with 12-24 months of data. Automatically purge older events.",
    "Privacy compliance and high-quality analytics are not in conflict. Design for both from day one.",
  ],
  "dashboards-that-get-used": [
    "The average product dashboard is opened once when it's built and never again. Here's how to break that pattern.",
    "**Principle 1: One question per dashboard.** A dashboard that tries to answer 'how is the product doing?' will answer nothing. Name your dashboard after the question it answers: 'Are new users activating?' or 'Is the checkout funnel improving?'.",
    "**Principle 2: Put the answer first.** The most important number goes top-left. Don't make readers hunt for the signal. If the dashboard is about activation rate, the activation rate is the first thing they see.",
    "**Principle 3: Add context, not just numbers.** A number without a benchmark is meaningless. Show week-over-week change, goal attainment, and cohort comparison inline. Make the interpretation obvious.",
    "**Principle 4: Annotate events.** When you ship a feature or run a campaign, add an annotation to your charts. Future readers need to know why the line moved.",
    "**Principle 5: Schedule a review.** A dashboard nobody looks at is the same as no dashboard. Put a recurring calendar event on the team's calendar: '10 min dashboard review every Monday'. It becomes a ritual, and the dashboard becomes valuable.",
    "Dashboards that get used are built for the reader, not the builder.",
  ],
  "sdk-integration-guide": [
    "You can be sending real product events to Lumio in under 30 minutes. Here's exactly how.",
    "**Step 1: Install the package.** `npm install @lumio/browser` or drop the snippet into your HTML. The browser SDK is 8kb gzipped.",
    "**Step 2: Initialise.** Call `lumio.init('YOUR_WRITE_KEY')` as early as possible in your app boot sequence. This starts buffering events immediately.",
    "**Step 3: Identify your users.** When a user logs in, call `lumio.identify('user-id', { email, name, plan })`. This connects all future events to that user.",
    "**Step 4: Track events.** Call `lumio.track('event_name', { prop1: value1 })` whenever something meaningful happens. Start with your five most important events — don't try to track everything at once.",
    "**Step 5: Verify.** Open the Lumio Debugger in your workspace. You'll see events arriving in real time. Check that properties are what you expect and that user identification is working.",
    "**Step 6: Deploy and monitor.** Ship to production and watch the event stream for the first 24 hours. Look for unexpected spikes, missing properties, or events from test users contaminating your data.",
    "That's it. Most teams are fully instrumented within a week. Need help? The chat bubble connects you to our engineering support team.",
  ],
};

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const post = POSTS.find((p) => p.slug === slug);
  const content = CONTENT[slug] ?? [];
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const reads: string[] = JSON.parse(localStorage.getItem("lumio_reads") ?? "[]");
    if (!reads.includes(slug)) {
      reads.unshift(slug);
      localStorage.setItem("lumio_reads", JSON.stringify(reads.slice(0, 10)));
    }
    const likedPosts: string[] = JSON.parse(localStorage.getItem("lumio_likes") ?? "[]");
    setLiked(likedPosts.includes(slug));
    (window as any).shubpy?.track?.("article_viewed", { slug, title: post?.title });
  }, [slug, post?.title]);

  const toggleLike = () => {
    const likedPosts: string[] = JSON.parse(localStorage.getItem("lumio_likes") ?? "[]");
    let updated: string[];
    if (liked) {
      updated = likedPosts.filter((s) => s !== slug);
    } else {
      updated = [slug, ...likedPosts];
      (window as any).shubpy?.track?.("article_liked", { slug });
    }
    localStorage.setItem("lumio_likes", JSON.stringify(updated));
    setLiked(!liked);
  };

  if (!post) {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h1>Article not found</h1>
        <a href="/blog" className="btn btn-ghost" style={{ marginTop: 20 }}>← Back to blog</a>
      </div>
    );
  }

  const otherPosts = POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <div className="page-hero">
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
            <a href="/blog" style={{ color: "var(--muted)", fontSize: 13 }}>← Blog</a>
            <span style={{ color: "var(--line)" }}>·</span>
            <span className={`badge ${({ Product: "badge-brand", Analytics: "badge-green", Engineering: "badge-amber", Compliance: "badge-gray" } as Record<string, string>)[post.category] ?? "badge-gray"}`}>
              {post.category}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,42px)" }}>{post.title}</h1>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 18, fontSize: 13, color: "var(--muted)" }}>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} read</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 760, padding: "52px 24px 80px" }}>
        <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.7, marginBottom: 32 }}>
          {post.excerpt}
        </p>
        <hr className="divider" style={{ marginBottom: 32 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {content.map((para, i) => {
            const isBold = para.startsWith("**");
            if (isBold) {
              const parts = para.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={i} style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--body)" }}>
                  {parts.map((part, j) =>
                    j % 2 === 1 ? <strong key={j} style={{ color: "var(--ink)" }}>{part}</strong> : part
                  )}
                </p>
              );
            }
            return (
              <p key={i} style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--body)" }}>
                {para}
              </p>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--line)" }}>
          <button
            onClick={toggleLike}
            className={`btn ${liked ? "btn-primary" : "btn-ghost"}`}
          >
            {liked ? "♥ Liked" : "♡ Like this article"}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => (window as any).shubpy?.open?.()}
          >
            💬 Ask a question
          </button>
        </div>
      </div>

      {otherPosts.length > 0 && (
        <section style={{ background: "var(--bg-soft)", padding: "52px 0 80px" }}>
          <div className="container">
            <h2 style={{ fontSize: 22, marginBottom: 28 }}>More articles</h2>
            <div className="grid-3">
              {otherPosts.map((p) => (
                <a key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ height: "100%" }}>
                    <h3 style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.3 }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>{p.readTime} · {p.author}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
