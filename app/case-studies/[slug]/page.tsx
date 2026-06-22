"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

const CASES: Record<string, {
  company: string; industry: string; founded: string; size: string;
  challenge: string; solution: string;
  results: { n: string; l: string }[];
  quote: string; quoteAuthor: string;
  sections: { h: string; body: string }[];
}> = {
  brightfin: {
    company: "Brightfin",
    industry: "Fintech",
    founded: "2019",
    size: "150 employees",
    challenge: "Brightfin's product team spent three weeks setting up analytics for every new experiment. Every funnel, every cohort, every dashboard required a data engineering ticket — slowing experiments to a crawl.",
    solution: "Lumio's SDK took one afternoon to instrument. Dashboard templates covered 90% of their standard experiment reports. Funnel and cohort analysis became self-serve for PMs without SQL.",
    results: [
      { n: "34%", l: "Conversion lift in 6 months" },
      { n: "3 weeks → afternoon", l: "Analytics setup time" },
      { n: "2.2x", l: "Experiment velocity" },
    ],
    quote: "We replaced a warehouse, three dbt models, and a BI seat with Lumio in a week. Our PMs finally answer their own questions.",
    quoteAuthor: "Priya Nair · VP Product, Brightfin",
    sections: [
      { h: "The problem", body: "Brightfin's data team was bottlenecked. Every product question — 'what's the funnel for new users on mobile?', 'which cohort has the best retention?' — required a data request ticket, a 2-week wait, and a Looker dashboard that was already outdated by the time it shipped. The product team was flying blind." },
      { h: "Why Lumio", body: "After evaluating Amplitude, Mixpanel, and building a custom solution, Brightfin chose Lumio because of the SDK simplicity and the dashboard template library. The engineering team instrumented the product in a single sprint. No warehouse setup. No pipeline project." },
      { h: "The results", body: "Within three months, Brightfin's PMs were running their own funnel analyses daily. Experiment setup time fell from three weeks to an afternoon. Conversion rate improved 34% as the team identified and fixed three major drop-off points that had been invisible in aggregate data. Today, the team runs 4x more experiments per quarter than before Lumio." },
    ],
  },
  aerolab: {
    company: "Aerolab",
    industry: "B2B SaaS",
    founded: "2021",
    size: "45 employees",
    challenge: "Aerolab was growing top-of-funnel quickly but couldn't explain why 60% of users churned within 90 days. The team had no retention cohort analysis and no way to identify what distinguished retained users from churned ones.",
    solution: "Lumio's cohort retention charts revealed two distinct aha moments — users who hit both within 14 days retained at 3x the rate of those who didn't. Aerolab redesigned onboarding to drive both behaviors.",
    results: [
      { n: "28%", l: "Churn reduction in 4 months" },
      { n: "2", l: "Aha moments discovered" },
      { n: "6 weeks", l: "Time to payback" },
    ],
    quote: "We found our activation event on day one and doubled our onboarding completion rate within a month.",
    quoteAuthor: "Dev Kim · Head of Growth, Aerolab",
    sections: [
      { h: "The problem", body: "Aerolab had a churn problem they couldn't see clearly. Their dashboard showed MAU trending up, but NRR was stuck at 82%. The problem was invisible in aggregate — they needed to understand behavior at the user level, across cohorts, over time." },
      { h: "What Lumio revealed", body: "After instrumenting with Lumio, the cohort analysis told a clear story: users who invited a teammate AND completed their first integration within 14 days had 3-month retention of 78%. Users who did neither retained at 24%. Two behaviors, a 3x difference. The data was always there — Lumio made it visible." },
      { h: "The fix", body: "Aerolab redesigned their onboarding to explicitly drive both behaviors: a mandatory team invite step and a one-click integration connector. Onboarding completion went from 34% to 61%. Churn dropped 28% in four months. NRR is now 108%." },
    ],
  },
  quanta: {
    company: "Quanta",
    industry: "Fintech Payments",
    founded: "2018",
    size: "220 employees",
    challenge: "Quanta's checkout funnel was converting at 61% — well below industry benchmarks. Aggregate funnel data showed drop-off after step 3, but couldn't explain why or for whom.",
    solution: "Lumio's segmented funnel analysis revealed that enterprise users on IE11 were hitting a rendering bug, mobile users in Germany were blocked by a missing payment method, and first-time card users were confused by CVV validation error messaging.",
    results: [
      { n: "3", l: "Critical drop-offs identified" },
      { n: "+19%", l: "Checkout completion" },
      { n: "$2M", l: "ARR recovered" },
    ],
    quote: "The funnel segmentation feature alone paid for three years of Lumio in the first quarter.",
    quoteAuthor: "Sara Chen · Head of Data, Quanta",
    sections: [
      { h: "The problem", body: "Quanta's aggregate funnel showed a 39% drop-off at step 3 of checkout. But the team couldn't reproduce the issue in testing and couldn't explain who was dropping or why. The aggregate number was useless without segment context." },
      { h: "Segmenting the funnel", body: "With Lumio, the team split the funnel by browser, device, country, payment method, and user type simultaneously. The segment-level data told three distinct stories: a rendering bug affecting 12% of enterprise users, a missing payment method blocking German mobile users, and a confusing error message causing first-time users to abandon after a failed CVV entry." },
      { h: "The outcome", body: "Three targeted fixes — a browser polyfill, a payment method addition for Germany, and improved error messaging — took two sprints to ship. Checkout completion improved from 61% to 80%. At Quanta's transaction volume, that 19-point improvement translated to $2M in additional ARR in the first year." },
    ],
  },
  hoverboard: {
    company: "Hoverboard",
    industry: "E-commerce",
    founded: "2020",
    size: "80 employees",
    challenge: "Hoverboard was burning CAC budget on generic email campaigns that converted poorly. Their demographic segments (age, location) weren't predicting purchase behavior, and ROAS was declining quarter over quarter.",
    solution: "Lumio's behavioral segmentation replaced demographic targeting. Segments based on product page views, cart behavior, and past purchase patterns became the foundation for all email personalization.",
    results: [
      { n: "2x", l: "Revenue from email" },
      { n: "41%", l: "CAC reduction" },
      { n: "3.1x", l: "ROAS improvement" },
    ],
    quote: "We stopped guessing which customers would buy and started knowing. Lumio's behavioral segments are our most valuable marketing asset.",
    quoteAuthor: "Maya Patel · VP Marketing, Hoverboard",
    sections: [
      { h: "The problem", body: "Hoverboard was sending the same email campaigns to everyone and wondering why conversion was low. Their age-and-location demographic segments didn't predict buying behavior. CAC was rising, ROAS was falling, and the team was stuck." },
      { h: "Building behavioral segments", body: "With Lumio, Hoverboard created segments based on actual behavior: high-intent browsers (viewed the same product 3+ times), cart abandoners (added to cart in last 7 days, no purchase), repeat buyers (2+ purchases in 90 days), and win-back candidates (purchased 6+ months ago, no recent activity). Each segment got a distinct campaign with messaging calibrated to their specific intent signal." },
      { h: "The results", body: "Email revenue doubled in the first quarter. CAC dropped 41% as the team concentrated budget on high-intent behavioral segments rather than broad demographic sprays. ROAS improved from 1.4x to 3.1x. The team now runs 12 distinct behavioral segments and attributes 65% of email revenue to Lumio-derived insights." },
    ],
  },
};

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const cs = CASES[slug];

  useEffect(() => {
    if (cs) {
      (window as any).shubpy?.track?.("case_study_viewed", { company: cs.company, industry: cs.industry });
    }
  }, [cs]);

  if (!cs) {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h1>Story not found</h1>
        <a href="/case-studies" className="btn btn-ghost" style={{ marginTop: 20 }}>← All stories</a>
      </div>
    );
  }

  return (
    <>
      <div className="page-hero">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
            <a href="/case-studies" style={{ color: "var(--muted)", fontSize: 13 }}>← Customer stories</a>
            <span style={{ color: "var(--line)" }}>·</span>
            <span className="badge badge-gray">{cs.industry}</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px,4vw,46px)" }}>{cs.company}</h1>
          <p style={{ fontSize: 18, color: "var(--muted)", marginTop: 14, lineHeight: 1.6 }}>{cs.challenge}</p>
          <div style={{ display: "flex", gap: 20, marginTop: 24, fontSize: 13, color: "var(--muted)", flexWrap: "wrap" }}>
            <span>Founded: {cs.founded}</span>
            <span>·</span>
            <span>{cs.size}</span>
            <span>·</span>
            <span>{cs.industry}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <section style={{ background: "var(--brand)", padding: "48px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 700, margin: "0 auto" }}>
            {cs.results.map((r) => (
              <div key={r.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{r.n}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>{r.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story sections */}
      <section className="block">
        <div className="container" style={{ maxWidth: 760 }}>
          {cs.sections.map((s) => (
            <div key={s.h} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 22, marginBottom: 16 }}>{s.h}</h2>
              <p style={{ fontSize: 16, color: "var(--body)", lineHeight: 1.8 }}>{s.body}</p>
            </div>
          ))}

          <div className="quote" style={{ marginTop: 48 }}>
            <blockquote>&ldquo;{cs.quote}&rdquo;</blockquote>
            <div className="who">{cs.quoteAuthor}</div>
          </div>
        </div>
      </section>

      <section className="block cta">
        <div className="container">
          <h2>Ready for results like {cs.company}?</h2>
          <p>Start a free workspace in two minutes. No card required.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn btn-primary btn-lg" href="/checkout">Start free</a>
            <a className="btn btn-ghost btn-lg" href="/case-studies">More stories</a>
          </div>
        </div>
      </section>
    </>
  );
}
