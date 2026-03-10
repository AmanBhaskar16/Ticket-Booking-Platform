import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FOOTER_COLS } from "../../../constants/movies.data.ts";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand */}
        <div>
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">🎬</div>
            <span className="footer-logo-text">CINEVERSE</span>
          </Link>
          <p className="footer-about">
            India's premier cinematic experience platform. Bringing you the best of world cinema.
          </p>
        </div>

        {/* Link columns */}
        {FOOTER_COLS.map(col => (
          <div key={col.title}>
            <p className="footer-col-title">{col.title}</p>
            {col.links.map(l => (
              <motion.a key={l} href="#" className="footer-link" whileHover={{ x: 3 }}>
                {l}
              </motion.a>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">© 2026 Cineverse Entertainment Pvt. Ltd. All rights reserved.</p>
        <div className="footer-legal">
          {["Privacy Policy", "Terms of Use", "Cookie Settings"].map(l => (
            <a key={l} href="#">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}