"use client";

import { useState, useEffect } from "react";

type PlanKey = "starter" | "growth" | "enterprise";
type BillingCycle = "monthly" | "annual";

const PLANS = [
  {
    key: "starter" as PlanKey,
    name: "Starter",
    monthly: 0,
    annual: 0,
    tag: null,
    features: [
      "Up to 1M events / mo",
      "3 seats",
      "Dashboards & funnels",
      "7-day data retention",
      "Community support",
    ],
  },
  {
    key: "growth" as PlanKey,
    name: "Growth",
    monthly: 99,
    annual: 79,
    tag: "Most popular",
    features: [
      "Up to 25M events / mo",
      "Unlimited seats",
      "Retention & cohorts",
      "90-day data retention",
      "Priority chat support",
      "Custom dashboards",
    ],
  },
  {
    key: "enterprise" as PlanKey,
    name: "Enterprise",
    monthly: null,
    annual: null,
    tag: null,
    features: [
      "Unlimited events",
      "Unlimited data retention",
      "Data residency & SSO",
      "Dedicated success manager",
      "SLA: 99.95% uptime",
      "Custom contracts",
    ],
  },
];

const FAQS = [
  { q: "Can I change plans later?", a: "Yes — upgrade or downgrade any time from your workspace settings. Changes take effect immediately." },
  { q: "How are events counted?", a: "Any call to .track() or .page() counts as one event. Identify calls and API reads don't count against your quota." },
  { q: "Is there a free trial on Growth?", a: "Yes — 14 days, no card required. You'll get the full Growth feature set and we'll remind you before the trial ends." },
  { q: "What happens if I exceed my event quota?", a: "We'll email you at 80% and 100%. Events are not dropped — you're billed at a small per-event overage rate." },
  { q: "Do you offer discounts for nonprofits or startups?", a: "Yes — reach out via the chat bubble with proof of status and we'll sort something out." },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [selected, setSelected] = useState<PlanKey | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lumio_plan") as PlanKey | null;
    if (stored) setSelected(stored);
    const storedBilling = localStorage.getItem("lumio_billing") as BillingCycle | null;
    if (storedBilling) setBilling(storedBilling);
  }, []);

  const selectPlan = (key: PlanKey) => {
    setSelected(key);
    localStorage.setItem("lumio_plan", key);
    localStorage.setItem("lumio_billing", billing);
    (window as any).shubpy?.track?.("plan_selected", { plan: key, billing });
  };

  const toggleBilling = (cycle: BillingCycle) => {
    setBilling(cycle);
    localStorage.setItem("lumio_billing", cycle);
  };

  const priceFor = (plan: typeof PLANS[0]) => {
    if (plan.monthly === null) return null;
    return billing === "annual" ? plan.annual : plan.monthly;
  };

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Pricing</span>
          <h1>Simple, usage-based pricing</h1>
          <p>Start free. Scale when your event volume does. No surprise bills.</p>
        </div>
      </div>

      <section className="block">
        <div className="container">
          {/* Billing toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 44, gap: 0 }}>
            <div style={{ display: "inline-flex", background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: 12, padding: 4 }}>
              {(["monthly", "annual"] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => toggleBilling(cycle)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 9,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: billing === cycle ? "#fff" : "transparent",
                    color: billing === cycle ? "var(--ink)" : "var(--muted)",
                    boxShadow: billing === cycle ? "0 1px 4px rgba(0,0,0,.1)" : "none",
                    transition: "all .15s",
                  }}
                >
                  {cycle === "monthly" ? "Monthly" : "Annual"}{cycle === "annual" ? " · save 20%" : ""}
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="alert alert-info" style={{ marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
              ✓ You previously selected <strong style={{ textTransform: "capitalize" }}>{selected}</strong>.{" "}
              <a href="/checkout" style={{ color: "inherit", textDecoration: "underline" }}>Continue to checkout →</a>
            </div>
          )}

          <div className="pricing">
            {PLANS.map((plan) => {
              const price = priceFor(plan);
              const isSelected = selected === plan.key;
              return (
                <div
                  key={plan.key}
                  className={`price${plan.tag ? " featured" : ""}`}
                  style={isSelected ? { outline: "2px solid var(--brand)", outlineOffset: 3 } : {}}
                >
                  {plan.tag && <span className="tag">{plan.tag}</span>}
                  {isSelected && (
                    <span className="badge badge-brand" style={{ marginBottom: 10, display: "inline-flex" }}>
                      ✓ Selected
                    </span>
                  )}
                  <h3>{plan.name}</h3>
                  <div className="amt">
                    {price === null ? "Custom" : price === 0 ? "Free" : `$${price}`}
                    {price !== null && price > 0 && <span> /mo</span>}
                    {billing === "annual" && price !== null && price > 0 && (
                      <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, marginTop: 2 }}>
                        billed ${price * 12}/yr
                      </div>
                    )}
                  </div>
                  <ul>
                    {plan.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  {plan.key === "enterprise" ? (
                    <a className="btn btn-ghost" href="/contact?subject=Enterprise+inquiry">Talk to sales</a>
                  ) : (
                    <button
                      className={`btn ${isSelected ? "btn-green" : plan.tag ? "btn-primary" : "btn-outline"}`}
                      onClick={() => selectPlan(plan.key)}
                    >
                      {isSelected ? "✓ Selected" : plan.key === "starter" ? "Get started free" : "Start 14-day trial"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {selected && selected !== "enterprise" && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <a className="btn btn-primary btn-lg" href="/checkout">
                Continue with {selected} plan →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Feature comparison */}
      <section className="block" style={{ background: "var(--bg-soft)", paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2>What&apos;s included</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)" }}>
                  <th style={{ textAlign: "left", padding: "10px 16px", color: "var(--muted)", fontWeight: 600 }}>Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.key} style={{ padding: "10px 16px", textAlign: "center", color: "var(--ink)", fontWeight: 700 }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Event ingestion", "1M/mo", "25M/mo", "Unlimited"],
                  ["Seats", "3", "Unlimited", "Unlimited"],
                  ["Data retention", "7 days", "90 days", "Custom"],
                  ["Dashboards", "✓", "✓", "✓"],
                  ["Funnels", "✓", "✓", "✓"],
                  ["Retention cohorts", "—", "✓", "✓"],
                  ["Custom events", "✓", "✓", "✓"],
                  ["SSO / SAML", "—", "—", "✓"],
                  ["Data residency", "—", "—", "✓"],
                  ["SLA", "—", "—", "99.95%"],
                  ["Support", "Community", "Priority chat", "Dedicated CSM"],
                ].map(([feature, ...values]) => (
                  <tr key={feature} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "11px 16px", color: "var(--body)", fontWeight: 500 }}>{feature}</td>
                    {values.map((v, i) => (
                      <td key={i} style={{ padding: "11px 16px", textAlign: "center", color: v === "—" ? "var(--muted)" : "var(--ink)" }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="block">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="section-head">
            <h2>Frequently asked questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    background: openFaq === i ? "var(--bg-soft)" : "#fff",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--ink)",
                    gap: 12,
                  }}
                >
                  {faq.q}
                  <span style={{ fontSize: 18, color: "var(--muted)", flexShrink: 0 }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 16px", fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, textAlign: "center" }}>
            <p style={{ color: "var(--muted)", marginBottom: 14 }}>
              Still have questions? Chat with us — we usually reply in under 2 minutes.
            </p>
            <button
              className="btn btn-outline"
              onClick={() => (window as any).shubpy?.open?.()}
            >
              Open chat →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
