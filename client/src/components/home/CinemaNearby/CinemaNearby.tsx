import { motion }       from "framer-motion";
import { useNavigate }  from "react-router-dom";
import type { Theatre } from "../../../types/movie.types.ts";
import { SectionHeader } from "../../common";
import "./CinemaNearby.css";

interface Props {
  cinemas:  Theatre[];
  loading?: boolean;
}

export default function CinemasNearby({ cinemas, loading }: Props) {
  const navigate = useNavigate();

  if (loading) return (
    <section className="section-sm">
      <SectionHeader eyebrow="Around You" title="CINEMAS NEARBY" cta="See All" />
      <div className="cinemas-grid">
        {[1,2,3].map(i => (
          <div key={i} className="cinema-card skeleton" style={{ height: 200 }} />
        ))}
      </div>
    </section>
  );

  if (!cinemas.length) return null;

  return (
    <section className="section-sm">
      <SectionHeader eyebrow="Around You" title="CINEMAS NEARBY" cta="See All" ctaHref="/theatres" />
      <div className="cinemas-grid">
        {cinemas.map((c, i) => (
          <motion.div key={c._id} className="cinema-card"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.55 }}
            whileHover={{ y: -6 }}
            onClick={() => navigate(`/theatres/${c._id}`)}>

            <div className="cinema-glow" />

            <div className="cinema-head">
              <div>
                <p className="cinema-name">🏛 {c.name}</p>
                <p className="cinema-loc">📍 {c.city}, {c.state}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="cinema-rating">4.8</p>
                <p className="cinema-rating-label">Rating</p>
              </div>
            </div>

            <div className="cinema-tags">
              {c.amenities?.slice(0, 4).map((a: string) => (
                <span key={a} className="cinema-tag">{a}</span>
              ))}
            </div>

            <div className="cinema-foot">
              <span className="cinema-screens">{c.totalScreens ?? 1} screens · {c.address}</span>
              <button className="btn-dir" onClick={e => { e.stopPropagation(); navigate(`/theatres/${c._id}`); }}>
                View →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}