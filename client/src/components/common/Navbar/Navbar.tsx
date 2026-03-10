import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = ["Movies", "Cinemas", "Events", "Offers", "My Tickets"];

export default function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <motion.div
          className="navbar-logo-icon"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          🎬
        </motion.div>
        <span className="navbar-logo-text">CINEVERSE</span>
      </Link>

      {/* Links */}
      <div className="navbar-links">
        {NAV_LINKS.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 * i + 0.3 }}
          >
            <Link to={`/${item.toLowerCase().replace(" ", "-")}`} className="navbar-link">
              {item}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        <div className="navbar-search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="rgba(232,228,220,0.35)" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span>Search…</span>
        </div>
        <motion.button className="btn-signin" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Sign In
        </motion.button>
        <motion.button className="btn-join" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Join Now
        </motion.button>
      </div>
    </motion.nav>
  );
}