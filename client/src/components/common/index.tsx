import { useEffect } from "react";
import { motion } from "framer-motion";

/* ── STARS ── */
interface StarsProps {
  /** Value out of 10 (from your model) */
  ratingOutOf10: number;
  size?: number;
}
export function Stars({ ratingOutOf10, size = 13 }: StarsProps) {
  const filled = Math.round(ratingOutOf10 / 2);
  return (
    <span style={{ fontSize: size }}>
      <span className="stars-amber">{"★".repeat(filled)}</span>
      <span className="stars-dim">{"★".repeat(5 - filled)}</span>
    </span>
  );
}

/* ── STARS (string rating, e.g. "9.1") ── */
export function StarsFive({ n }: { n: number }) {
  return (
    <span>
      <span className="stars-amber">{"★".repeat(n)}</span>
      <span className="stars-dim">{"★".repeat(5 - n)}</span>
    </span>
  );
}

/* ── SECTION HEADER ── */
interface SectionHeaderProps {
  eyebrow: string;
  title:   string;
  cta?:    string;
  ctaHref?: string;
}
export function SectionHeader({ eyebrow, title, cta, ctaHref = "#" }: SectionHeaderProps) {
  return (
    <motion.div
      className="sec-head"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <p className="sec-eyebrow">{eyebrow}</p>
        <h2 className="sec-title">{title}</h2>
      </div>
      {cta && <a href={ctaHref} className="sec-cta">{cta} →</a>}
    </motion.div>
  );
}

/* ── TICKER BAR ── */
interface TickerBarProps { items: string[]; }
export function TickerBar({ items }: TickerBarProps) {
  return (
    <div className="ticker-bar">
      <div className="anim-ticker" style={{ display: "flex", whiteSpace: "nowrap" }}>
        {[0, 1].map(ri => (
          <div key={ri} style={{ display: "flex" }}>
            {items.map((t, i) => (
              <span key={i} className="ticker-text">{t}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TOAST ── */
interface ToastProps { message: string; onDone: () => void; }
export function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="toast"
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <span className="toast-icon">✓</span>
      <span className="toast-text">{message}</span>
    </motion.div>
  );
}

/* ── TICKER CSS (injected here to keep common styles together) ── */
// Put this in global.css if you prefer — kept here for co-location
const tickerStyle = `
.ticker-bar  { height:32px; overflow:hidden; display:flex; align-items:center; background:linear-gradient(90deg,#ef4444,#f97316); position:relative; z-index:200; }
.ticker-text { font-size:10px; font-weight:700; color:#fff; padding:0 36px; text-transform:uppercase; letter-spacing:2.5px; opacity:.92; white-space:nowrap; }
`;
if (typeof document !== "undefined" && !document.getElementById("ticker-css")) {
  const s = document.createElement("style");
  s.id = "ticker-css";
  s.textContent = tickerStyle;
  document.head.appendChild(s);
}