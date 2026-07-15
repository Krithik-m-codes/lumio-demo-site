import type { Metadata } from "next";
import "./globals.css";
import WidgetScriptManager from "./WidgetScriptManager";

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

        <footer>
          <div className="container foot-inner">
            <div className="brand" style={{ fontSize: 16 }}>
              <span className="logo-mark" style={{ width: 26, height: 26 }}>
                L
              </span>
              Lumio
            </div>
            <div className="foot-links">
              <a href="/">Home</a>
              <a href="/pricing">Pricing</a>
              <a href="/blog">Blog</a>
              <a href="/docs">Docs</a>
              <a href="/contact">Contact</a>
              <a href="/account">Account</a>
              <a href="/app">Open app</a>
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              © {new Date().getFullYear()} Lumio Analytics · demo site powered by Shubpy
            </div>
          </div>
        </footer>

        <WidgetScriptManager />
      </body>
    </html >
  );
}
