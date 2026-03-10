import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MockMovie } from "../../../types/movie.types.ts";
import { SHOWTIMES, OCCUPANCY, FORMATS, SHOW_DATES } from "../../../constants/movies.data.ts";
import { SectionHeader } from "../../common/index.tsx";
import "./ShowtimePicker.css";

interface Props {
  activeMovie: MockMovie;
}

export default function ShowtimePicker({ activeMovie }: Props) {
  const [selFmt,  setSelFmt]  = useState("IMAX");
  const [selDate, setSelDate] = useState("Today");
  const [selTime, setSelTime] = useState<string | null>(null);

  return (
    <section className="section">
      <SectionHeader eyebrow="Today · Friday, March 6" title="PICK YOUR SHOWTIME" />

      {/* Format + Date row */}
      <div className="format-row">
        {FORMATS.map(f => (
          <button key={f}
            className={`format-btn ${selFmt === f ? "active" : ""}`}
            onClick={() => setSelFmt(f)}>
            {f}
          </button>
        ))}
        <div className="date-row">
          {SHOW_DATES.map(d => (
            <button key={d}
              className={`date-btn ${selDate === d ? "active" : ""}`}
              onClick={() => setSelDate(d)}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div className="slots-row">
        {SHOWTIMES.map((time, i) => (
          <motion.div key={time}
            className={`slot ${selTime === time ? "active" : ""}`}
            onClick={() => setSelTime(time)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -5, boxShadow: "0 20px 52px rgba(249,115,22,0.16)" }}
            whileTap={{ scale: 0.97 }}>
            <div className={`slot-time ${selTime === time ? "active" : ""}`}>{time}</div>
            <div className="slot-sub">{selFmt} · {OCCUPANCY[i]}% filled</div>
            <div className="slot-status">
              {OCCUPANCY[i] > 75 ? "⚡ Filling fast" : OCCUPANCY[i] > 55 ? "🟡 Moderate" : "✅ Available"}
            </div>
            <div className="slot-bar">
              <div className="slot-fill" style={{
                width: `${OCCUPANCY[i]}%`,
                background: selTime === time ? "#f97316" : OCCUPANCY[i] > 75 ? "#ef4444" : "rgba(255,255,255,0.2)",
              }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirm banner */}
      <AnimatePresence>
        {selTime && (
          <motion.div className="confirm-bar"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span>
              Selected: <strong>{activeMovie.title}</strong> · {selTime} · {selFmt}
            </span>
            <motion.button className="btn-continue"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              Continue →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}