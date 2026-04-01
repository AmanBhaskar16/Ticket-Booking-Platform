import { useState } from "react";
import { motion }   from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../../types/movie.types.ts";
import { SectionHeader } from "../../common";
import "./NowShowing.css";

interface Props {
  movies:   Movie[];
  loading?: boolean;
}

export default function NowShowing({ movies, loading }: Props) {
  const [hCard, setHCard] = useState<string | null>(null);
  const [wish,  setWish]  = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleWish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWish(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  if (loading) return (
    <section className="section-sm">
      <SectionHeader eyebrow="In Theatres Now" title="NOW SHOWING" cta="View All" ctaHref="/movies" />
      <div className="movies-grid">
        {[1,2,3,4].map(i => (
          <div key={i} className="movie-card skeleton" style={{ height: 420, borderRadius: 14 }} />
        ))}
      </div>
    </section>
  );

  if (!movies.length) return null;

  return (
    <section className="section-sm">
      <SectionHeader eyebrow="In Theatres Now" title="NOW SHOWING" cta="View All" ctaHref="/movies" />
      <div className="movies-grid">
        {movies.map((mv, i) => (
          <motion.div key={mv._id} className="movie-card"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            onHoverStart={() => setHCard(mv._id)}
            onHoverEnd={() => setHCard(null)}
            onClick={() => navigate(`/movies/${mv._id}`)}>

            <div className="movie-poster">
              <motion.img src={mv.posterUrl} alt={mv.name}
                animate={{ scale: hCard === mv._id ? 1.07 : 1 }}
                transition={{ duration: 0.4 }} />
              <div className="movie-poster-grad" />
              <span className="movie-badge" style={{ background: "#ef4444" }}>NOW SHOWING</span>
              <button
                className={`movie-wish-btn ${wish.includes(mv._id) ? "active" : ""}`}
                onClick={e => toggleWish(mv._id, e)}>
                {wish.includes(mv._id) ? "♥" : "♡"}
              </button>
              {hCard === mv._id && (
                <motion.div className="movie-play-overlay"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="movie-play-btn">▶</div>
                </motion.div>
              )}
            </div>

            <div className="movie-info">
              <h3 className="movie-title">{mv.name}</h3>
              <p className="movie-genre">
                {mv.genre?.join(", ")} · {mv.duration}m
              </p>
              <div className="movie-row">
                <span className="movie-rating" style={{ color: "#f97316" }}>
                  {mv.rating && mv.rating > 0 ? `${mv.rating}/10` : ""}
                </span>
                <span style={{ fontSize: 10, color: "rgba(232,228,220,.4)", fontWeight: 700 }}>
                  {mv.certificate}
                </span>
              </div>
              <div className="movie-card-btns">
                <button className="btn-book-sm"
                  style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color: "#fff", border: "none" }}
                  onClick={e => { e.stopPropagation(); navigate(`/movies/${mv._id}`); }}>
                  Book Tickets
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}