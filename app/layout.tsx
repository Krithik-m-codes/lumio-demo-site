import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumio — Cloud analytics for product teams",
  description:
    "Lumio turns raw product events into clear answers. Demo site for the Shubpy embeddable chat + bot integration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <div className="container nav-inner">
            <a href="/" className="brand">
              <span className="logo-mark">L</span>
              Lumio
            </a>
            <nav className="nav-links">
              <a href="/pricing">Pricing</a>
              <a href="/blog">Blog</a>
              <a href="/docs">Docs</a>
              <a href="/resources">Resources</a>
              <a href="/about">Company</a>
              <a href="/contact">Contact</a>
              <a href="/app" style={{ color: "var(--brand)", fontWeight: 600 }}>Open app →</a>
            </nav>
            <div className="nav-cta">
              <a className="btn btn-ghost" href="/account">
                Account
              </a>
              <a className="btn btn-primary" href="/checkout">
                Start free
              </a>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer style={{ borderTop: "1px solid var(--line)", background: "var(--bg-soft)" }}>
          <div className="container">
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "2.5rem",
              padding: "48px 0 40px",
              borderBottom: "1px solid var(--line)",
            }}>
              {/* Brand + tagline */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <a href="/" className="brand" style={{ fontSize: 17, textDecoration: "none" }}>
                  <span className="logo-mark" style={{ width: 28, height: 28 }}>L</span>
                  Lumio
                </a>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 240 }}>
                  Cloud analytics for product teams. Turn raw events into clear answers — no warehouse required.
                </p>
              </div>

              {/* Product */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink)", marginBottom: "0.4rem" }}>
                  Product
                </div>
                {[
                  { label: "Pricing", href: "/pricing" },
                  { label: "Integrations", href: "/integrations" },
                  { label: "Changelog", href: "/changelog" },
                  { label: "Docs", href: "/docs" },
                  { label: "Open app", href: "/app" },
                ].map((l) => (
                  <a key={l.href} href={l.href} style={{ fontSize: 14, color: "var(--muted)", textDecoration: "none" }}>{l.label}</a>
                ))}
              </div>

              {/* Company */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink)", marginBottom: "0.4rem" }}>
                  Company
                </div>
                {[
                  { label: "About", href: "/about" },
                  { label: "Team", href: "/team" },
                  { label: "Careers", href: "/careers" },
                  { label: "Blog", href: "/blog" },
                  { label: "Contact", href: "/contact" },
                ].map((l) => (
                  <a key={l.href} href={l.href} style={{ fontSize: 14, color: "var(--muted)", textDecoration: "none" }}>{l.label}</a>
                ))}
              </div>

              {/* Resources */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink)", marginBottom: "0.4rem" }}>
                  Resources
                </div>
                {[
                  { label: "Case Studies", href: "/case-studies" },
                  { label: "Resources", href: "/resources" },
                  { label: "Account", href: "/account" },
                  { label: "Checkout", href: "/checkout" },
                ].map((l) => (
                  <a key={l.href} href={l.href} style={{ fontSize: 14, color: "var(--muted)", textDecoration: "none" }}>{l.label}</a>
                ))}
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 0",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                © {new Date().getFullYear()} Lumio Analytics · demo site powered by Shubpy
              </div>
              <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Twitter</span>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>LinkedIn</span>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>GitHub</span>
              </div>
            </div>
          </div>
        </footer>

        <script
          src="https://chat.shubpy.com/widget.js"
          data-workspace-key="7ea9573b-0055-4fcf-843d-3d9fcd97d6f3"
          data-modules='["chat", "bots", "knowledge"]'
          async
        ></script>
      </body>
    </html>
  );
}
