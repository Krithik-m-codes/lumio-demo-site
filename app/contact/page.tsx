"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Draft {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

const EMPTY_DRAFT: Draft = { name: "", email: "", subject: "", message: "", category: "general" };

const CATEGORIES = [
  { value: "general", label: "General inquiry" },
  { value: "billing", label: "Billing & plans" },
  { value: "technical", label: "Technical support" },
  { value: "enterprise", label: "Enterprise sales" },
  { value: "partnership", label: "Partnership" },
  { value: "feedback", label: "Product feedback" },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [draftAge, setDraftAge] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const storedDraft = localStorage.getItem("lumio_contact_draft");
    const storedTime = localStorage.getItem("lumio_contact_draft_ts");
    if (storedDraft) {
      const parsed = JSON.parse(storedDraft) as Draft;
      setDraft(parsed);
      setCharCount(parsed.message.length);
      if (storedTime) {
        const mins = Math.round((Date.now() - Number(storedTime)) / 60000);
        setDraftAge(mins < 1 ? "just now" : mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`);
      }
    }

    const subjectParam = searchParams?.get("subject");
    if (subjectParam) {
      setDraft((d) => ({ ...d, subject: decodeURIComponent(subjectParam) }));
    }

    const storedUser = localStorage.getItem("lumio_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setDraft((d) => ({ ...d, name: d.name || u.name || "", email: d.email || u.email || "" }));
    }
  }, [searchParams]);

  const update = (field: keyof Draft, value: string) => {
    const next = { ...draft, [field]: value };
    setDraft(next);
    if (field === "message") setCharCount(value.length);
    localStorage.setItem("lumio_contact_draft", JSON.stringify(next));
    localStorage.setItem("lumio_contact_draft_ts", String(Date.now()));
    setDraftAge(null);
  };

  const clearDraft = () => {
    setDraft(EMPTY_DRAFT);
    setCharCount(0);
    setDraftAge(null);
    localStorage.removeItem("lumio_contact_draft");
    localStorage.removeItem("lumio_contact_draft_ts");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      clearDraft();
      (window as any).shubpy?.track?.("contact_form_submitted", { category: draft.category, subject: draft.subject });
      (window as any).shubpy?.identify?.({ name: draft.name, email: draft.email });
    }, 900);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Message sent!</h2>
        <p style={{ color: "var(--muted)", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
          We&apos;ll get back to you at <strong>{draft.email || "your email"}</strong> within one business day.
          For urgent issues, use the chat bubble in the corner.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => (window as any).shubpy?.open?.()}>
            Open live chat
          </button>
          <button className="btn btn-ghost" onClick={() => setSubmitted(false)}>
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {draftAge && (
        <div className="alert alert-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>↩ Draft restored from {draftAge}</span>
          <button type="button" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", textDecoration: "underline", fontSize: 13 }} onClick={clearDraft}>
            Clear
          </button>
        </div>
      )}

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="form-group">
          <label>Your name</label>
          <input type="text" value={draft.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Doe" required />
        </div>
        <div className="form-group">
          <label>Email address</label>
          <input type="email" value={draft.email} onChange={(e) => update("email", e.target.value)} placeholder="jane@company.com" required />
        </div>
      </div>

      <div className="form-group">
        <label>Category</label>
        <select value={draft.category} onChange={(e) => update("category", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Subject</label>
        <input type="text" value={draft.subject} onChange={(e) => update("subject", e.target.value)} placeholder="What can we help with?" required />
      </div>

      <div className="form-group">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label>Message</label>
          <span style={{ fontSize: 12, color: charCount > 2000 ? "var(--red)" : "var(--muted)" }}>
            {charCount} / 2000
          </span>
        </div>
        <textarea
          value={draft.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us more…"
          rows={7}
          required
          maxLength={2000}
        />
        <span className="hint">
          {draft.message.length > 0 && draftAge === null ? "✓ Draft saved automatically" : "Your draft is auto-saved as you type."}
        </span>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-primary" disabled={submitting || charCount > 2000}>
          {submitting ? "Sending…" : "Send message"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => (window as any).shubpy?.open?.()}>
          Or chat live instead →
        </button>
      </div>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Get in touch</h1>
          <p>We typically reply within one business day. For urgent questions, the chat bubble connects you to a human right now.</p>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 24px 80px", display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Form */}
        <div style={{ flex: "1 1 440px", maxWidth: 580 }}>
          <Suspense fallback={<p style={{ color: "var(--muted)" }}>Loading…</p>}>
            <ContactForm />
          </Suspense>
        </div>

        {/* Sidebar info */}
        <div style={{ flex: "0 0 240px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em", marginBottom: 10 }}>Live support</p>
              <button
                className="btn btn-outline btn-full"
                onClick={() => (window as any).shubpy?.open?.()}
              >
                💬 Open live chat
              </button>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                Usually under 2 minutes during business hours (Mon–Fri, 9–18 CET).
              </p>
            </div>

            <hr className="divider" />

            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em", marginBottom: 10 }}>Self-serve</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="/docs" style={{ fontSize: 14, color: "var(--brand)", textDecoration: "none" }}>→ Documentation</a>
                <a href="/blog" style={{ fontSize: 14, color: "var(--brand)", textDecoration: "none" }}>→ Blog & tutorials</a>
                <a href="/pricing" style={{ fontSize: 14, color: "var(--brand)", textDecoration: "none" }}>→ Pricing FAQ</a>
              </div>
            </div>

            <hr className="divider" />

            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.06em", marginBottom: 10 }}>Expected response times</p>
              {[
                ["General inquiry", "< 1 business day"],
                ["Technical support", "< 4 hours"],
                ["Billing", "< 2 hours"],
                ["Enterprise sales", "Same day"],
              ].map(([type, time]) => (
                <div key={type} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--body)" }}>{type}</span>
                  <span style={{ color: "var(--green)", fontWeight: 600 }}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
