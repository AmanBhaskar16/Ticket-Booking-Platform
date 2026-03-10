import { motion } from "framer-motion";
import type { UpcomingMovie } from "../../../types/movie.types.ts";
import { SectionHeader } from "../../common/index.tsx";
import "./ComingSoon.css";

interface Props { movies: UpcomingMovie[]; }

export default function ComingSoon({ movies }: Props) {
  return (
    <section className="section-sm">
      <SectionHeader eyebrow="On The Horizon" title="COMING SOON" cta="Full Calendar" />
      <div className="upcoming-row">
        {movies.map((u, i) => (
          <motion.div key={u.title} className="upcoming-card"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            whileHover={{ y: -8 }}>

            <div className="upcoming-poster">
              <img src={u.img} alt={u.title} />
              <div className="upcoming-grad" />
              <div className="upcoming-date">{u.date}</div>
              <div className="hype-box">
                <div className="hype-row">
                  <span className="hype-label">Hype</span>
                  <span className="hype-pct">{u.hype}%</span>
                </div>
                <div className="hype-bar">
                  <motion.div className="hype-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${u.hype}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }} />
                </div>
              </div>
            </div>

            <div className="upcoming-info">
              <p className="upcoming-title">{u.title}</p>
              <div className="upcoming-foot">
                <span className="upcoming-genre">{u.genre}</span>
                <motion.button className="btn-notify" whileHover={{ scale: 1.05 }}>
                  Notify
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}