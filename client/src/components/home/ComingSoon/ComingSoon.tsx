import { motion }      from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Movie }  from "../../../types/movie.types.ts";
import { SectionHeader } from "../../common";
import "./ComingSoon.css";

interface Props {
  movies:  Movie[];
  loading?: boolean;
}

export default function ComingSoon({ movies, loading }: Props) {
  const navigate = useNavigate();

  if (loading) return (
    <section className="section-sm">
      <SectionHeader eyebrow="On The Horizon" title="COMING SOON" cta="Full Calendar" />
      <div className="upcoming-row">
        {[1,2,3].map(i => (
          <div key={i} className="upcoming-card skeleton" style={{ height: 280, borderRadius: 14 }} />
        ))}
      </div>
    </section>
  );

  if (!movies.length) return null;

  return (
    <section className="section-sm">
      <SectionHeader eyebrow="On The Horizon" title="COMING SOON" cta="Full Calendar" ctaHref="/movies" />
      <div className="upcoming-row">
        {movies.map((u, i) => (
          <motion.div key={u._id} className="upcoming-card"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            whileHover={{ y: -8 }}
            onClick={() => navigate(`/movies/${u._id}`)}>

            <div className="upcoming-img-wrap">
              <img src={u.posterUrl} alt={u.name} />
              <div className="upcoming-overlay">
                <span className="upcoming-badge">COMING SOON</span>
              </div>
            </div>

            <div className="upcoming-info">
              <h4 className="upcoming-title">{u.name}</h4>
              <p className="upcoming-meta">
                {u.genre?.slice(0, 2).join(" · ")}
              </p>
              {u.releaseDate && (
                <p className="upcoming-date">
                  {new Date(u.releaseDate).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}