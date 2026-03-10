import { motion } from "framer-motion";
// import type { MockMovie } from "../../../types/movie.types.ts";
import { STATS } from "../../../constants/movies.data.ts";
import "./StatsStrip.css";

export default function StatsStrip() {
  return (
    <motion.div
      className="stats-strip"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {STATS.map((s, i) => (
        <motion.div key={i} className="stat-item"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}>
          <div className="stat-value">{s.v}</div>
          <div className="stat-label">{s.l}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}