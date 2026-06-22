"use client";

import { useState, useEffect } from "react";

type Step = 1 | 2 | 3;

const PLAN_LABELS: Record<string, { name: string; price: string; features: string[] }> = {
  starter: { name: "Starter", price: "Free", features: ["1M events/mo", "3 seats", "Community support"] },
  growth: { name: "Growth", price: "$99/mo", features: ["25M events/mo", "Unlimited seats", "Priority chat support"] },
  enterprise: { name: "Enterprise", price: "Custom", features: ["Unlimited events", "SSO", "Dedicated CSM"] },
};

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>(1);
  const [plan, setPlan] = useState("growth");
  const [billing, setBilling] = useState("monthly");
  const [form, setForm] = useState({ name: "", email: "", company: "", cardHolder: "", cardNumber: "", expiry: "", cvv: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const storedPlan = localStorage.getItem("lumio_plan");
    const storedBilling = localStorage.getItem("lumio_billing");
    if (storedPlan) setPlan(storedPlan);
    if (storedBilling) setBilling(storedBilling);

    const storedUser = localStorage.getItem("lumio_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setForm((f) => ({ ...f, name: u.name ?? "", email: u.email ?? "", company: u.company ?? "" }));
    }
    (window as any).shubpy?.track?.("checkout_started", { plan: storedPlan ?? "growth" });
  }, []);

  const planInfo = PLAN_LABELS[plan] ?? PLAN_LABELS.growth;

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.company.trim()) e.company = "Company is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    if (plan === "starter" || plan === "enterprise") return true;
    const e: Record<string, string> = {};
    if (!form.cardHolder.trim()) e.cardHolder = "Required";
    if (!form.cardNumber.trim()) e.cardNumber = "Required";
    if (!form.expiry.trim()) e.expiry = "Required";
    if (!form.cvv.trim()) e.cvv = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToStep2 = () => {
    if (!validate1()) return;
    setStep(2);
    (window as any).shubpy?.track?.("checkout_step2", { plan, billing });
    // Identify the visitor now we have their details
    (window as any).shubpy?.identify?.({ email: form.email, name: form.name, company: form.company });
    localStorage.setItem("lumio_user", JSON.stringify({ name: form.name, email: form.email, company: form.company, role: "", plan }));
  };

  const goToStep3 = () => {
    if (!validate2()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(3);
      setConfirmed(true);
      localStorage.setItem("lumio_plan", plan);
      (window as any).shubpy?.track?.("checkout_completed", { plan, billing });
    }, 1200);
  };

  const steps = [
    { num: 1, label: "Account details" },
    { num: 2, label: plan === "starter" ? "Confirm" : "Payment" },
    { num: 3, label: "All set!" },
  ];

  return (
    <>
      <div className="page-hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <h1 style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
            {step < 3 ? "Create your workspace" : "Welcome to Lumio!"}
          </h1>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: 0, alignItems: "center", marginTop: 24, maxWidth: 400 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                    background: step > s.num ? "var(--green)" : step === s.num ? "var(--brand)" : "var(--bg-soft)",
                    color: step >= s.num ? "#fff" : "var(--muted)",
                    border: `2px solid ${step > s.num ? "var(--green)" : step === s.num ? "var(--brand)" : "var(--line)"}`,
                    flexShrink: 0,
                  }}>
                    {step > s.num ? "✓" : s.num}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: step === s.num ? 600 : 400, color: step === s.num ? "var(--ink)" : "var(--muted)", whiteSpace: "nowrap" }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: step > s.num ? "var(--green)" : "var(--line)", margin: "0 10px" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px 80px", display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Main form */}
        <div style={{ flex: "1 1 420px", maxWidth: 520 }}>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ fontSize: 20 }}>Account details</h2>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Full name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Work email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Company name</label>
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Corp" />
                {errors.company && <span className="form-error">{errors.company}</span>}
              </div>

              <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                <button className="btn btn-primary btn-full" onClick={goToStep2}>Continue →</button>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                Already have an account?{" "}
                <a href="/account" style={{ color: "var(--brand)" }}>Sign in</a>
              </p>
            </div>
          )}

          {step === 2 && plan === "starter" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ fontSize: 20 }}>Confirm your free workspace</h2>
              <div className="alert alert-info">
                You&apos;re creating a <strong>Starter</strong> workspace — no card needed. You can upgrade at any time.
              </div>
              <div style={{ padding: "16px 20px", background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 14 }}>
                <p><strong>Email:</strong> {form.email}</p>
                <p style={{ marginTop: 6 }}><strong>Company:</strong> {form.company}</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-full" onClick={goToStep3} disabled={submitting}>
                  {submitting ? "Creating workspace…" : "Create workspace →"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && plan !== "starter" && plan !== "enterprise" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ fontSize: 20 }}>Payment details</h2>
              <div className="alert alert-warn" style={{ fontSize: 13 }}>
                This is a demo — no real payment is processed. Enter any values.
              </div>
              <div className="form-group">
                <label>Cardholder name</label>
                <input type="text" value={form.cardHolder} onChange={(e) => setForm({ ...form, cardHolder: e.target.value })} placeholder="Jane Doe" />
                {errors.cardHolder && <span className="form-error">{errors.cardHolder}</span>}
              </div>
              <div className="form-group">
                <label>Card number</label>
                <input type="text" value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} placeholder="4242 4242 4242 4242" maxLength={19} />
                {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Expiry</label>
                  <input type="text" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} placeholder="MM / YY" maxLength={7} />
                  {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} placeholder="123" maxLength={4} />
                  {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-full" onClick={goToStep3} disabled={submitting}>
                  {submitting ? "Processing…" : `Start 14-day trial →`}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                No charge until the trial ends. Cancel any time.
              </p>
            </div>
          )}

          {step === 3 && confirmed && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 24, marginBottom: 12 }}>Your workspace is ready.</h2>
              <p style={{ color: "var(--muted)", marginBottom: 28 }}>
                We&apos;ve sent a confirmation to <strong>{form.email}</strong>.
                {plan === "growth" ? " Your 14-day trial of Growth is now active." : ""}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a className="btn btn-primary" href="/docs">Read the quickstart →</a>
                <button className="btn btn-ghost" onClick={() => (window as any).shubpy?.open?.()}>
                  Chat with onboarding
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div style={{ flex: "0 0 280px" }}>
          <div style={{ background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: 16, padding: "24px 22px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em", marginBottom: 16 }}>
              Order summary
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 17 }}>{planInfo.name}</span>
              <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 20 }}>{planInfo.price}</span>
            </div>
            {plan !== "starter" && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {["monthly", "annual"].map((c) => (
                  <button
                    key={c}
                    onClick={() => { setBilling(c); localStorage.setItem("lumio_billing", c); }}
                    style={{
                      flex: 1, padding: "6px 0", borderRadius: 8, border: "1.5px solid",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: billing === c ? "var(--brand)" : "#fff",
                      color: billing === c ? "#fff" : "var(--muted)",
                      borderColor: billing === c ? "var(--brand)" : "var(--line)",
                    }}
                  >
                    {c === "monthly" ? "Monthly" : "Annual −20%"}
                  </button>
                ))}
              </div>
            )}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", fontSize: 13, color: "var(--body)", display: "flex", flexDirection: "column", gap: 8 }}>
              {planInfo.features.map((f) => (
                <li key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <hr className="divider" style={{ marginBottom: 14 }} />
            <button
              style={{ display: "flex", justifyContent: "space-between", width: "100%", background: "none", border: "none", fontSize: 13, color: "var(--muted)", cursor: "pointer", padding: 0 }}
              onClick={() => (window as any).shubpy?.open?.()}
            >
              <span>Questions about pricing?</span>
              <span style={{ color: "var(--brand)" }}>Chat →</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
