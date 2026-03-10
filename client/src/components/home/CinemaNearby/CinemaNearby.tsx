import { motion } from "framer-motion";
import type { Cinema } from "../../../types/movie.types.ts";
import { SectionHeader } from "../../common/index.tsx";
import "./CinemaNearby.css";

interface Props { cinemas: Cinema[]; }

export default function CinemasNearby({ cinemas }: Props) {
  return (
    <section className="section-sm">
      <SectionHeader eyebrow="Around You" title="CINEMAS NEARBY" cta="See All" />
      <div className="cinemas-grid">
        {cinemas.map((c, i) => (
          <motion.div key={c.name} className="cinema-card"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.55 }}
            whileHover={{ y: -6 }}>

            <div className="cinema-glow" />

            <div className="cinema-head">
              <div>
                <h3 className="cinema-name">{c.name}</h3>
                <p className="cinema-loc">📍 {c.location} · {c.dist}</p>
              </div>
              <div>
                <div className="cinema-rating">{c.rating}</div>
                <div className="cinema-rating-label">Rating</div>
              </div>
            </div>

            <div className="cinema-tags">
              {c.tags.map(t => <span key={t} className="cinema-tag">{t}</span>)}
            </div>

            <div className="cinema-foot">
              <span className="cinema-screens">{c.screens} screens available</span>
              <motion.button className="btn-dir"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(249,115,22,.3)" }}
                whileTap={{ scale: 0.97 }}>
                Directions
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}