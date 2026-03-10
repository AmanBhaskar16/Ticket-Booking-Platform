import { motion } from "framer-motion";
import "./PrimePass.css";

export default function PrimePass() {
  return (
    <motion.section className="prime-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}>

      <div className="prime-glow-r" />
      <div className="prime-glow-l" />
      <div className="prime-line" />

      <div className="prime-inner">
        <div>
          <p className="prime-eyebrow">Exclusive Membership</p>
          <h3 className="prime-title">
            CINEVERSE<br />
            <span className="prime-accent">PRIME</span> PASS
          </h3>
          <p className="prime-desc">
            Unlimited movies, zero booking fees, priority seating, exclusive screenings and member-only events.
          </p>
          <div className="prime-features">
            {["✓ Unlimited Tickets","✓ No Booking Fees","✓ Early Access","✓ Exclusive Events"].map(f => (
              <span key={f} className="prime-feature">{f}</span>
            ))}
          </div>
        </div>

        <div className="prime-price-box">
          <div className="prime-was">₹1,299 / month</div>
          <div className="prime-price">₹<span className="prime-accent">799</span></div>
          <div className="prime-period">per month · cancel anytime</div>
          <motion.button className="btn-prime"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            Get Prime Pass →
          </motion.button>
          <p className="prime-note">First month free · No commitment</p>
        </div>
      </div>
    </motion.section>
  );
}