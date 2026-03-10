import { motion } from "framer-motion";
import type { Review } from "../../../types/movie.types.ts";
import { SectionHeader } from "../../common/index.tsx";
import "./AudienceReview.css";

interface Props { reviews: Review[]; }

export default function AudienceReviews({ reviews }: Props) {
  return (
    <section className="section-sm">
      <SectionHeader eyebrow="What Audiences Say" title="AUDIENCE REVIEWS" cta="Read More" />
      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <motion.div key={i} className="review-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}>

            <div className="review-head">
              <div className="review-avatar">{r.initials}</div>
              <div>
                <p className="review-name">{r.name}</p>
                <p className="review-sub">on {r.movie} · {r.ago}</p>
              </div>
            </div>

            <span className="review-stars">
              {"★".repeat(r.stars)}
              <span style={{ color: "#3f3f46" }}>{"★".repeat(5 - r.stars)}</span>
            </span>

            <p className="review-text">"{r.text}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}