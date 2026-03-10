import { motion } from "framer-motion";
import "./AppDownload.css";

export default function AppDownload() {
  return (
    <motion.section className="app-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}>

      <div className="app-glow" />

      <div>
        <p className="app-eyebrow">Take It With You</p>
        <h3 className="app-title">GET THE APP</h3>
        <p className="app-desc">
          Book tickets, track your watchlist, and get exclusive in-app deals. Available on iOS and Android.
        </p>
      </div>

      <div className="app-btns">
        {[{ label: "App Store", sub: "iOS" }, { label: "Google Play", sub: "Android" }].map(btn => (
          <motion.button key={btn.label} className="btn-store"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <p className="btn-store-sub">{btn.sub}</p>
            <p className="btn-store-name">{btn.label}</p>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}