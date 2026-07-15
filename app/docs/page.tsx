"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  {
    id: "getting-started",
    title: "Getting started",
    items: [
      {
        id: "quickstart",
        title: "Quickstart",
        content: `Install the SDK with npm install @lumio/browser, then call lumio.init('WRITE_KEY') as early as possible in your app. Send your first event with lumio.track('app_opened'). Open the Lumio Debugger in your workspace to verify it arrived.`,
      },
      {
        id: "identify",
        title: "Identifying users",
        content: `Call lumio.identify(userId, { email, name, plan }) after a user logs in. Properties passed here become available for segmentation across all events from that user. Use a stable, non-PII ID such as a UUID or database primary key.`,
      },
      {
        id: "track",
        title: "Tracking events",
        content: `lumio.track(eventName, properties) sends a single event. Event names should follow the noun_verb convention: dashboard_created, export_started, funnel_saved. Properties are arbitrary key-value pairs — keep them consistent across events.`,
      },
    ],
  },
  {
    id: "sdk-reference",
    title: "SDK reference",
    items: [
      {
        id: "browser-sdk",
        title: "Browser SDK",
        content: `The browser SDK (8kb gzipped) supports init, identify, track, page, group, reset, and opt-out. Events are batched in memory and flushed every 2 seconds or when the batch size exceeds 20 events. It handles offline buffering and retries automatically.`,
      },
      {
        id: "server-sdk",
        title: "Server SDK",
        content: `The Node.js server SDK is for tracking server-side events such as webhooks, background jobs, and payment confirmations. It uses the same write key as the browser SDK. Calls are synchronous and should be awaited in async contexts.`,
      },
      {
        id: "http-api",
        title: "HTTP API",
        content: `POST events directly to https://api.lumio.io/v1/track with a JSON body. The write key is sent as a Bearer token. Useful for languages without an official SDK or for backend systems that prefer HTTP over a library dependency.`,
      },
    ],
  },
  {
    id: "dashboards",
    title: "Dashboards",
    items: [
      {
        id: "create-dashboard",
        title: "Creating a dashboard",
        content: `Click + New dashboard in the sidebar. Give it a name that reflects the question it answers. Add charts using the + Add chart button. Charts can be line, bar, pie, number, or funnel type. Drag to reorder, click the resize handle to change size.`,
      },
      {
        id: "sharing",
        title: "Sharing & embeds",
        content: `Click Share on any dashboard to get a public link (read-only), a Slack digest schedule, or an embed code for Notion, Confluence, or any page that supports iframes. Public links don't require login.`,
      },
    ],
  },
  {
    id: "funnels",
    title: "Funnels",
    items: [
      {
        id: "build-funnel",
        title: "Building a funnel",
        content: `Open the Funnels section and click + New funnel. Define each step as an event name, optionally filtered by properties. Set the conversion window and click Compute. The funnel renders immediately using indexed data.`,
      },
      {
        id: "funnel-breakdown",
        title: "Breakdown by property",
        content: `Click Breakdown and select a property (e.g. plan, source, device). The funnel rerenders with one line per property value. This is the fastest way to find which segment has the highest or lowest drop rate.`,
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    items: [
      {
        id: "slack",
        title: "Slack",
        content: `Connect Slack in Workspace Settings → Integrations. You can then schedule digest messages (daily, weekly) for any dashboard and receive alerts when a metric crosses a threshold.`,
      },
      {
        id: "webhooks",
        title: "Webhooks",
        content: `Register a webhook URL in Integrations → Webhooks. Lumio will POST a JSON payload to your URL whenever a threshold alert triggers or a scheduled export completes.`,
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & compliance",
    items: [
      {
        id: "data-residency",
        title: "Data residency",
        content: `Enterprise plans can choose between EU (Frankfurt) and US (Virginia) data residency. Select your region during workspace creation — it cannot be changed after data is ingested.`,
      },
      {
        id: "deletion",
        title: "User data deletion",
        content: `To delete a user's data, call POST /v1/delete with the user_id. All events attributed to that ID will be permanently deleted within 30 days. This satisfies GDPR Article 17 right to erasure.`,
      },
    ],
  },
];

export default function DocsPage() {
  const [search, setSearch] = useState("");
  const [openSection, setOpenSection] = useState<string>("getting-started");
  const [openItem, setOpenItem] = useState<string>("quickstart");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("lumio_recent_docs");
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  const openDoc = (sectionId: string, itemId: string) => {
    setOpenSection(sectionId);
    setOpenItem(itemId);
    setRecent((prev) => {
      const key = `${sectionId}::${itemId}`;
      const updated = [key, ...prev.filter((k) => k !== key)].slice(0, 6);
      localStorage.setItem("lumio_recent_docs", JSON.stringify(updated));
      return updated;
    });
    (window as any).shubpy?.track?.("docs_viewed", { section: sectionId, item: itemId });
  };

  const activeItem = SECTIONS.flatMap((s) => s.items.map((i) => ({ ...i, sectionId: s.id }))).find(
    (i) => i.sectionId === openSection && i.id === openItem
  );

  const searchResults = search.length > 1
    ? SECTIONS.flatMap((s) =>
        s.items
          .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.content.toLowerCase().includes(search.toLowerCase()))
          .map((i) => ({ ...i, sectionTitle: s.title, sectionId: s.id }))
      )
    : [];

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Documentation</span>
          <h1>Lumio docs</h1>
          <p>Everything you need to integrate, build, and scale with Lumio.</p>
          <div style={{ marginTop: 20, maxWidth: 400 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search docs…"
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 24px 80px", display: "flex", gap: 40, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <nav style={{ width: 220, flexShrink: 0, position: "sticky", top: 80 }}>
          {recent.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Recently viewed
              </p>
              {recent.slice(0, 4).map((key) => {
                const [sId, iId] = key.split("::");
                const section = SECTIONS.find((s) => s.id === sId);
                const item = section?.items.find((i) => i.id === iId);
                if (!item) return null;
                return (
                  <button
                    key={key}
                    onClick={() => openDoc(sId, iId)}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "5px 0", background: "none", border: "none", fontSize: 13, color: openSection === sId && openItem === iId ? "var(--brand)" : "var(--muted)", cursor: "pointer" }}
                  >
                    {item.title}
                  </button>
                );
              })}
              <hr className="divider" style={{ margin: "12px 0" }} />
            </div>
          )}

          {SECTIONS.map((section) => (
            <div key={section.id} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                {section.title}
              </p>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openDoc(section.id, item.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "6px 10px",
                    background: openSection === section.id && openItem === item.id ? "var(--brand-soft)" : "none",
                    border: "none",
                    borderRadius: 7,
                    fontSize: 14,
                    color: openSection === section.id && openItem === item.id ? "var(--brand)" : "var(--body)",
                    fontWeight: openSection === section.id && openItem === item.id ? 600 : 400,
                    cursor: "pointer",
                    transition: "background .12s",
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {search.length > 1 ? (
            <div>
              <h2 style={{ fontSize: 20, marginBottom: 20 }}>
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
              </h2>
              {searchResults.length === 0 ? (
                <div style={{ padding: "32px 0", color: "var(--muted)" }}>
                  No results found.{" "}
                  <button
                    style={{ background: "none", border: "none", color: "var(--brand)", cursor: "pointer", fontWeight: 600 }}
                    onClick={() => (window as any).shubpy?.open?.()}
                  >
                    Ask in chat →
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {searchResults.map((r) => (
                    <div
                      key={r.id}
                      className="card"
                      style={{ cursor: "pointer" }}
                      onClick={() => { setSearch(""); openDoc(r.sectionId, r.id); }}
                    >
                      <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>{r.sectionTitle}</p>
                      <h3 style={{ fontSize: 16, marginBottom: 6 }}>{r.title}</h3>
                      <p style={{ fontSize: 13, color: "var(--muted)" }}>{r.content.slice(0, 120)}…</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeItem ? (
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
                {SECTIONS.find((s) => s.id === openSection)?.title} › {activeItem.title}
              </div>
              <h1 style={{ fontSize: "clamp(22px,3vw,32px)", marginBottom: 20 }}>{activeItem.title}</h1>
              <p style={{ fontSize: 15.5, lineHeight: 1.8, color: "var(--body)" }}>{activeItem.content}</p>

              <div style={{ marginTop: 40, padding: "20px 24px", background: "var(--brand-soft)", border: "1px solid #c7d2fe", borderRadius: 12 }}>
                <p style={{ fontSize: 14, color: "#3730a3", marginBottom: 10, fontWeight: 600 }}>
                  Something unclear?
                </p>
                <p style={{ fontSize: 13, color: "#4f46e5", marginBottom: 14 }}>
                  Our engineering support team is on chat — usually replies in under 2 minutes.
                </p>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                  onClick={() => (window as any).shubpy?.open?.()}
                >
                  Ask a question
                </button>
              </div>

              {/* Next / prev navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
                {(() => {
                  const allItems = SECTIONS.flatMap((s) => s.items.map((i) => ({ ...i, sectionId: s.id })));
                  const idx = allItems.findIndex((i) => i.sectionId === openSection && i.id === openItem);
                  const prev = allItems[idx - 1];
                  const next = allItems[idx + 1];
                  return (
                    <>
                      {prev ? (
                        <button className="btn btn-ghost btn-sm" onClick={() => openDoc(prev.sectionId, prev.id)}>
                          ← {prev.title}
                        </button>
                      ) : <div />}
                      {next ? (
                        <button className="btn btn-ghost btn-sm" onClick={() => openDoc(next.sectionId, next.id)}>
                          {next.title} →
                        </button>
                      ) : <div />}
                    </>
                  );
                })()}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
