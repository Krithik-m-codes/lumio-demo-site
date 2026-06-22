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
  "product-market-fit-analytics": [
    "Product-market fit is the inflection point where your product stops feeling like an experiment and starts feeling inevitable. Analytics changes that — it makes fit measurable, not just sensed.",
    "**The 40% rule revisited.** Sean Ellis's famous benchmark is a survey proxy. A more durable version is retention-based: if your 3-month retention curve flattens above 25-30% for a given cohort, you likely have fit with that segment.",
    "**Track engagement depth, not breadth.** MAU is a breadth metric. What you want is depth: how many users are hitting your core value action at least once a week? Define your core value action precisely — for an analytics tool it might be 'dashboard_viewed'.",
    "**Cohort the cohorts.** PMF is rarely universal. Split your retention cohorts by acquisition channel, company size, or job role. The segment with strong retention is your beachhead — find it and double down.",
    "**Measure time-to-value.** How long does it take a new user to first hit your core value action? Users who reach value within 24 hours retain at dramatically higher rates. If the median time-to-value is more than 3 days, your onboarding is destroying potential PMF.",
    "**Qualitative signal check.** Complement quantitative data with a simple survey triggered after the 4th session: 'How would you feel if you could no longer use this product?' Cross-reference responses with behavioral segments. The users who say 'very disappointed' and show strong retention are your PMF signal.",
    "PMF is not a binary state. It's a gradient, and analytics is how you find where you sit on it and how to move toward it deliberately.",
  ],
  "a-b-testing-best-practices": [
    "A/B testing is the gold standard for product decisions — but only when done correctly. Most teams run experiments that are too small, too short, or measure the wrong thing.",
    "**Start with a hypothesis, not a variation.** Before building anything, write: 'We believe that [change] will cause [metric] to increase because [reason].' The 'because' forces you to think about the mechanism, not just the outcome.",
    "**Calculate sample size before you start.** Use a power calculator. Enter your baseline conversion rate, minimum detectable effect (usually 10-20% relative), 95% significance, and 80% power. Run until you hit that number — not until it 'looks good'.",
    "**Run one change at a time.** Multi-variate tests require exponentially more traffic and produce harder-to-interpret results. For most teams, sequential A/B tests are more practical and more educational.",
    "**Beware the peeking problem.** Checking results daily and stopping when p < 0.05 inflates your false-positive rate dramatically. Commit to a fixed test duration upfront and don't look at results until it's over.",
    "**Measure guardrail metrics alongside your primary metric.** A change that improves sign-up conversion but tanks 7-day retention is not a win. Include at least one downstream health metric in every experiment scorecard.",
    "Statistical rigor is not bureaucracy. It's the difference between learning from your experiments and fooling yourself.",
  ],
  "feature-flags-analytics": [
    "Feature flags and analytics are more powerful together than either is alone. Flags let you control who sees a feature; analytics tells you what effect it's having. Together they give you a continuous deployment loop with full observability.",
    "**The basic pattern.** When you evaluate a flag, fire an event: `feature_flag_evaluated` with properties `flag_name`, `variant`, `user_id`, and `context`. This creates a permanent record of which users were exposed to which variant.",
    "**Exposure logging matters.** The most common mistake is measuring outcomes on all users rather than only exposed users. Always filter to exposed users — otherwise your experiment results are diluted by users who never saw the change.",
    "**Connecting flags to funnels.** Create a funnel segment for each flag variant. Compare funnel completion rates between control and treatment groups. Use the exposure event as a funnel entry point and measure everything downstream.",
    "**Gradual rollouts with monitoring.** Use flags to roll out to 1%, then 10%, then 50%, then 100%. At each step, check your key metrics dashboard — error rates, core action completion, retention.",
    "**Clean up dead flags.** Flags that are permanently on or off become technical debt. Schedule a quarterly flag audit and use analytics to confirm a flag hasn't been evaluated in 30 days before removing it.",
    "The teams with the best deployment velocity are almost always the ones who have deeply integrated flags with their analytics pipeline.",
  ],
  "north-star-metric": [
    "Every company claims to have a north star metric. Most of them have picked the wrong one. A north star metric is not your revenue target or MAU count — it's the single metric that best captures the value your product delivers to users and predicts long-term business success.",
    "**The two criteria.** A good north star must satisfy two conditions: it must reflect genuine user value (not just business extraction), and it must be a leading indicator of revenue. Spotify's 'time spent listening' satisfies both.",
    "**Common anti-patterns.** Revenue itself is a lagging indicator — by the time it drops, you've already failed users. Page views measure presence, not value. Sign-ups measure top-of-funnel, not retention. These are useful metrics, but none is a north star.",
    "**How to find yours.** Start with your best retained users — the ones active for 12+ months. What do they do in your product that new users don't? What action taken in the first 30 days most strongly predicts 12-month retention? That action is likely your north star.",
    "**Setting up the measurement.** Once identified, instrument it precisely. Define what counts as one unit. Build a dedicated dashboard showing the metric daily, weekly, and as a cohort curve. Make it visible to the entire company.",
    "**Breaking it down into input metrics.** The north star alone is too high-level to act on. Decompose it into 3-5 input metrics that drive it. These are the metrics your teams own. Weekly reviews focus on inputs; monthly reviews verify the north star is moving.",
    "A north star metric is only as good as the alignment it creates. If product, marketing, and engineering can all explain how their work moves the number, you've chosen well.",
  ],
  "activation-rate-guide": [
    "Activation is the moment your product first delivers on its core promise. It's not sign-up — sign-up is just a user handing you their email. Activation is when they experience genuine value for the first time.",
    "**Defining your activation event.** The activation event is the first action that strongly correlates with long-term retention. Run a correlation analysis: which first-30-day actions best predict 90-day retention? That's your activation event.",
    "**Measuring activation rate.** Activation rate = users who completed activation event within N days / total new users in the same cohort. The window matters — typically 7 or 14 days. Track this as a cohort metric so you can see improvement over time.",
    "**Finding the activation gap.** Build a funnel from sign-up to activation. Where do users drop? Are they failing to complete setup? Not discovering the key feature? Hitting a technical error? Each drop-off is a specific problem you can fix.",
    "**The onboarding-activation loop.** Onboarding exists to drive activation. Every step should be evaluated by one criterion: does it increase the probability a user reaches the activation event? If a step doesn't contribute, cut it.",
    "**Segmenting activation.** Break down activation rate by acquisition channel, signup source, and user persona. Enterprise users activating at 80% while self-serve users activate at 20% tells you where to focus.",
    "Improving activation rate by 10 percentage points often has more impact on long-term revenue than any top-of-funnel growth initiative. It's the highest-leverage onboarding metric you have.",
  ],
  "data-warehouse-vs-product-analytics": [
    "The data warehouse vs. product analytics debate is one of the most common architecture questions growing companies face. The short answer: you probably need both, but for different jobs.",
    "**What a data warehouse is good for.** Warehouses — Snowflake, BigQuery, Redshift — excel when you need to join product events with CRM data, billing data, and support tickets to answer complex cross-system questions.",
    "**What product analytics tools are good for.** Product analytics platforms are optimized for behavioral queries: funnels, retention cohorts, user-level journeys. A PM can answer questions in 30 seconds without writing SQL.",
    "**The key difference: iteration speed.** Warehouse queries can take hours to write and run. Product analytics queries take seconds. For high-cadence product decisions — daily standup, live experiment monitoring — the speed of a dedicated tool is critical.",
    "**The architectural mistake.** Teams often think 'we'll just use the warehouse' because they already have it. This works for the data team but fails PMs who need to move fast. Every product question becomes a data request ticket.",
    "**When to add a product analytics tool.** Once your team submits more than 2-3 data requests per week that could be self-served, the ROI on a dedicated tool is immediate.",
    "**The modern stack.** Stream events to both your product analytics tool (fast behavioral queries) and your warehouse (cross-system analysis and ML). They serve different masters — don't force one to do both jobs.",
  ],
  "user-segmentation-strategies": [
    "Most product teams segment by demographics: company size, industry, geography. These segments are easy to build but rarely actionable. Behavioral segmentation — built from what users actually do — is where you find the real levers.",
    "**What behavioral segmentation is.** A behavioral segment is a group of users defined by actions they have or haven't taken. 'Users who invited a teammate in their first week' is behavioral. 'Enterprise users in North America' is demographic. The behavioral one almost always has higher predictive power.",
    "**The power users segment.** Identify your most engaged users — the top 10% by core action frequency in the last 30 days. Analyze what they have in common. Which acquisition channel? What did they do in their first session? This profile is your ideal user.",
    "**The at-risk segment.** Users who were active 30-60 days ago but haven't logged in for 14 days are your at-risk cohort. This segment is time-sensitive — reach out before they fully churn.",
    "**The 'never activated' segment.** Users who signed up more than 7 days ago but never hit your activation event represent wasted acquisition spend. Analyze what they did in their first session and build a targeted win-back sequence.",
    "**Building segments in Lumio.** Use the Segments feature to define behavioral conditions using event history, property values, and time windows. Segments update in real time as behavior changes. Connect to your messaging tool via Lumio Destinations to trigger personalized outreach automatically.",
    "The best behavioral segments are ones where the defining action has a strong causal story — you can explain *why* users who did X retain better, not just that they do.",
  ],
  "product-led-growth-analytics": [
    "Product-led growth companies use the product itself as the primary acquisition, activation, and expansion channel. This changes what you measure — traditional SaaS metrics don't capture PLG dynamics.",
    "**The PLG funnel.** Visitor → Sign-up → Activated → Power User → Expansion → Referral. The most critical transition is Activated → Power User, because power users drive expansion revenue and word-of-mouth.",
    "**Product Qualified Leads (PQLs).** In PLG, sales follows up with product-qualified leads: users who hit a defined usage threshold. Define your PQL criteria using behavioral data: 'created more than 5 projects and invited at least 2 teammates within 14 days'.",
    "**Viral coefficient tracking.** PLG companies grow through in-product virality. Track your viral coefficient (invites sent per user × acceptance rate). A coefficient above 1 means organic growth is compounding.",
    "**Expansion analytics.** In PLG, expansion revenue often exceeds new logo revenue within 24 months. Track seat expansion and plan upgrade rates by cohort. Which activation paths lead to expansion?",
    "**Time-to-PQL.** How long does it take a new sign-up to reach PQL status? This is your PLG velocity metric. Shortening time-to-PQL through better onboarding directly increases your expansion revenue pipeline.",
    "PLG analytics requires deep in-product instrumentation. The companies that win at PLG are the ones with the best event tracking, not the best salespeople.",
  ],
  "revenue-analytics-saas": [
    "Revenue metrics in SaaS look simple on the surface. The complexity emerges when you try to calculate them consistently across different billing models, trial structures, and expansion scenarios.",
    "**MRR: the foundation.** Monthly Recurring Revenue is the normalised monthly value of all active subscriptions. Annual plans count as MRR/12. Exclude one-time payments, setup fees, and professional services — these are not recurring.",
    "**ARR and its limits.** ARR = MRR × 12. Useful as an annualised view but can be misleading for companies with lumpy contract timing. Always show underlying MRR movement alongside ARR.",
    "**Net Revenue Retention: the growth metric.** NRR measures how much revenue you retain and expand from existing customers. NRR > 100% means your existing customers are growing faster than they churn. Best-in-class SaaS companies have NRR of 120-130%.",
    "**MRR movement decomposition.** Break MRR change into: New MRR (new customers), Expansion MRR (upgrades and seat adds), Contraction MRR (downgrades), and Churned MRR (cancellations). This decomposition tells you where growth is coming from and where it's leaking.",
    "**Connecting product analytics to revenue.** The most valuable analysis is correlating product behavior with revenue outcomes. Which onboarding paths produce customers with the lowest churn? Which features are used by customers with the highest NRR?",
    "Revenue analytics is a team sport between finance, product, and data. Teams that align on definitions and build shared dashboards make faster, more confident decisions.",
  ],
  "mobile-analytics-guide": [
    "Mobile analytics is harder than web analytics. Sessions are fragmented by app lifecycle, events can be lost when users go offline, and attribution is complicated by app stores.",
    "**The mobile event lifecycle.** Mobile events don't always fire when they happen. If a user is offline, events queue locally and flush when connectivity returns — sometimes hours or days later. Your pipeline must handle out-of-order events gracefully.",
    "**Session definition.** On mobile, a 'session' is typically defined as activity with no gap longer than 30 minutes. Define your session explicitly in your SDK configuration and be consistent — changing the definition mid-flight breaks all session-based metrics retroactively.",
    "**App version as a first-class property.** Always attach `app_version` and `os_version` to every event. Mobile users update at wildly different rates — you may have users on 6 different versions simultaneously.",
    "**Push notification analytics.** Track the full push funnel: `push_sent`, `push_delivered`, `push_opened`, and the downstream action you intended to drive. High delivery rates with low open rates point to messaging problems.",
    "**Screen tracking vs. event tracking.** Automatic screen tracking produces huge event volumes with low signal. Be selective: track screens that represent meaningful user intent. Combine with interaction events for a complete picture without the noise.",
    "Mobile analytics rewards teams who design their tracking plan before they write SDK calls. Retrofitting tracking into a shipped app is far harder than building it in from the start.",
  ],
  "dashboard-design-principles": [
    "You've learned the basics: one question per dashboard, put the answer first, add context. Here are the advanced principles that separate dashboards used by high-performing teams from those that collect dust.",
    "**Design for the decision, not the data.** Before adding any chart, ask: 'What decision will this chart inform, and what would someone do differently if this number were high vs. low?' If you can't answer that, don't add the chart.",
    "**The three-layer hierarchy.** Every dashboard: a headline KPI at the top (one number, trend, vs. goal), supporting metrics in the middle (the 3-4 that explain the KPI), and diagnostic deep-dives at the bottom (segmented breakdowns for investigation).",
    "**Use small multiples for comparison.** Instead of one chart with 8 colored lines, use 8 small identical charts — one per segment. Humans compare shapes more accurately than they decode colors. Small multiples reveal outliers that a single busy chart obscures.",
    "**Encode your benchmarks visually.** Add a goal line or reference band to every trend chart. Color-code chart titles: green when above goal, amber when close, red when below. Make status scannable in under 3 seconds.",
    "**Version your dashboards.** When you make significant changes, note the date and what changed in a text card. Treat your dashboard like code — changes should be visible and reversible.",
    "The best product dashboards feel less like reporting tools and more like decision support systems. Every element earns its place by accelerating a specific judgment the team makes regularly.",
  ],
  "real-time-vs-batch-analytics": [
    "Real-time analytics is one of the most frequently over-specified requirements in data infrastructure. 'We need real-time' often turns out to mean 'we need data that's less than 4 hours old'.",
    "**Defining latency tiers.** Sub-second is true real-time — fraud detection, live monitoring. Sub-minute covers operational dashboards and alerting. Sub-hour covers most product analytics. Daily batch covers reporting and BI. Know which tier you actually need.",
    "**The cost curve.** Real-time streaming infrastructure costs roughly 5-10x more to build and operate than equivalent batch pipelines — not just in infrastructure, but in engineering complexity and operational burden.",
    "**When real-time is genuinely required.** You need true real-time when user-facing features depend on it: personalized recommendations, fraud scoring, live leaderboards. Also for operational alerting — if checkout conversion drops 30% in 15 minutes, you want to know immediately.",
    "**The lambda architecture trap.** Many teams build lambda architectures — streaming for real-time and batch for accurate historical data. Maintaining two code paths that must produce identical results is a maintenance nightmare.",
    "**Practical recommendation.** For most product analytics workloads, a micro-batch architecture with 5-15 minute latency hits the sweet spot: near-real-time enough for operational monitoring, simple enough for reliable operation.",
    "Match your architecture to your actual requirements, not your aspirational requirements. The simplest pipeline that meets your latency needs is almost always the right choice.",
  ],
  "customer-journey-mapping": [
    "Traditional customer journey maps are built in workshops based on what teams believe users do. Event-based journey maps are built from what users actually do. The gap between the two is usually surprising and always instructive.",
    "**The raw material: event streams.** Every user interaction in your product is an event with a timestamp and user ID. Ordered by time, these events form a journey. The job of journey mapping is to find patterns across thousands of individual journeys.",
    "**Path analysis: finding common routes.** Path analysis visualises the most common sequences of events across your user base. You'll typically find that 70-80% of traffic follows 3-4 dominant paths, with a long tail of variations.",
    "**Identifying journey breakpoints.** A breakpoint is a place where users frequently exit or loop back. Look for high drop-off rates on specific pages, repeated attempts at the same action (indicating confusion), or sessions that end immediately after an error event.",
    "**The multi-session journey.** Most meaningful product journeys span multiple sessions over days or weeks. Use Lumio's user-level event history to trace the complete journey from first touch to conversion, including the sessions where nothing 'important' happened.",
    "**Cross-channel journeys.** Users switch between mobile, web, and email. Stitching these together requires a consistent user identity across channels — the same `user_id` in every environment.",
    "Journey maps built from event data are living documents — they update as user behavior changes. Build them once, then set up alerts for when the dominant paths shift significantly.",
  ],
  "onboarding-analytics": [
    "Onboarding is the highest-leverage surface in any SaaS product. A 10% improvement in onboarding completion typically has more impact on 12-month revenue than a 10% improvement in almost any other metric.",
    "**The onboarding funnel.** Map every step a new user takes from sign-up to first value. Build this as an explicit funnel in your analytics tool. Measure conversion rate and time between steps. The step with the largest drop-off is your first priority.",
    "**Time-in-step analysis.** Conversion rate tells you where users drop. Time-in-step tells you where they get stuck. A step with high conversion but an 8-minute median completion time indicates friction — users are getting through, but it's hard.",
    "**Separating skip from abandon.** Some users skip onboarding steps intentionally; others abandon because they got confused. Distinguish these with behavioral signals: a user who completes 5 subsequent actions after skipping was probably fine to skip it.",
    "**The activation moment.** Identify the specific action in onboarding most predictive of 30-day retention. This is your activation event. Redesign onboarding to get every new user to that moment as quickly as possible.",
    "**Cohort onboarding analysis.** Run a cohort analysis where the cohort is 'week of sign-up' and the metric is 'completed onboarding within 7 days'. This shows whether your onboarding is improving over time as you ship changes.",
    "Treat onboarding like a product within your product — with its own roadmap, dedicated analytics, and improvement targets. The teams that do this compound their activation rates quarter over quarter.",
  ],
};

const categoryColors: Record<string, string> = {
  Product: "badge-brand",
  Analytics: "badge-green",
  Engineering: "badge-amber",
  Compliance: "badge-gray",
  Growth: "badge-green",
  Strategy: "badge-brand",
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
            <span className={`badge ${categoryColors[post.category] ?? "badge-gray"}`}>
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
