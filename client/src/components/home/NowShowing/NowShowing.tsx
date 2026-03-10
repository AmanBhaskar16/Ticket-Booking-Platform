import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { MockMovie } from "../../../types/movie.types.ts";
import { SectionHeader, StarsFive } from "../../common/index.tsx";
import "./NowShowing.css";

interface Props {
  movies: MockMovie[];
}

export default function NowShowing({ movies }: Props) {
  const [hCard, setHCard] = useState<number | null>(null);
  const [wish,  setWish]  = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleWish = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWish(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  return (
    <section className="section-sm">
      <SectionHeader eyebrow="In Theatres Now" title="NOW SHOWING" cta="View All" />

      <div className="movies-grid">
        {movies.map((mv, i) => (
          <motion.div key={mv.id} className="movie-card"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onHoverStart={() => setHCard(mv.id)}
            onHoverEnd={() => setHCard(null)}
            whileHover={{ y: -10 }}
            onClick={() => navigate(`/movies/${mv.id}`)}>

            {/* Poster */}
            <div className="movie-poster">
              <motion.img src={mv.poster} alt={mv.title}
                animate={{ scale: hCard === mv.id ? 1.08 : 1 }}
                transition={{ duration: 0.55 }} />
              <div className="movie-poster-grad" />
              <span className="movie-badge" style={{ background: mv.badgeBg }}>{mv.badge}</span>

              <motion.button className={`movie-wish-btn ${wish.includes(mv.id) ? "active" : ""}`}
                onClick={e => toggleWish(mv.id, e)}
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                {wish.includes(mv.id) ? "♥" : "♡"}
              </motion.button>

              <AnimatePresence>
                {hCard === mv.id && (
                  <motion.div className="movie-play-overlay"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="movie-play-btn"
                      initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
                      ▶
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Info */}
            <div className="movie-info">
              <h3 className="movie-title">{mv.title}</h3>
              <p className="movie-genre">{mv.genre} · {mv.duration}</p>
              <div className="movie-row">
                <StarsFive n={Math.round(parseFloat(mv.rating) / 2)} />
                <strong className="movie-rating" style={{ color: mv.ratingColor }}>{mv.rating}</strong>
              </div>
              <div className="movie-card-btns">
                <motion.button className="btn-book-sm"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={e => { e.stopPropagation(); navigate(`/movies/${mv.id}`); }}
                  style={{ background: mv.bookBg, border: `1px solid ${mv.bookBorder}`, color: mv.accentColor }}>
                  Book Now
                </motion.button>
                <motion.button className="btn-info"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={e => { e.stopPropagation(); navigate(`/movies/${mv.id}`); }}>
                  ℹ
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}