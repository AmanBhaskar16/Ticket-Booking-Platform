import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { MockMovie } from "../../../types/movie.types.ts";
import "./HeroSection.css";

interface Props {
  movies: MockMovie[];
}

export default function HeroSection({ movies }: Props) {
  const [active,  setActive]  = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [wish,    setWish]    = useState<number[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({ target: heroRef });
  const bgY      = useTransform(scrollYProgress, [0, 1],   ["0%", "20%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive(p => (p + 1) % movies.length), 3000);
    return () => clearInterval(t);
  }, [paused, movies.length]);

  const pickMovie = (i: number) => {
    setActive(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 8000);
  };

  const toggleWish = (id: number) =>
    setWish(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const m = movies[active];

  return (
    <div ref={heroRef} className="hero">
      {/* BG with parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${active}`}
          className="hero-bg"
          style={{ backgroundImage: `url(${m.bg})`, y: bgY }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1,  scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      <motion.div className="hero-overlay" style={{ opacity: heroFade }}>
        <div className="hero-overlay-l" />
        <div className="hero-overlay-b" />
      </motion.div>
      <div className="hero-grid" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-text">

          {/* Badge row */}
          <AnimatePresence mode="wait">
            <motion.div key={`badge-${active}`} className="hero-badge-row"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <span className="hero-badge" style={{ background: m.badgeBg }}>{m.badge}</span>
              <span className="hero-genre">{m.genre} · {m.year}</span>
              <span className="hero-live">
                <span className="hero-live-dot anim-pdot" />
                <span className="hero-live-text">LIVE BOOKING</span>
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h1 key={`title-${active}`} className="hero-title"
              style={{ textShadow: `0 0 120px ${m.accentColor}22` }}
              initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              {m.title}
            </motion.h1>
          </AnimatePresence>

          {/* Meta */}
          <AnimatePresence mode="wait">
            <motion.div key={`meta-${active}`}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>

              <div className="hero-meta">
                <span className="stars-amber">{"★".repeat(Math.round(parseFloat(m.rating) / 2))}</span>
                <strong style={{ color: "#fbbf24", fontSize: 15 }}>{m.rating}</strong>
                {[`⏱ ${m.duration}`, `🎭 ${m.screens} screens`, `🎫 From ${m.price}`].map((t, i) => (
                  <span key={i} className="hero-meta-item-wrap">
                    <span className="hero-sep" />
                    <span className="hero-meta-item">{t}</span>
                  </span>
                ))}
              </div>

              <p className="hero-desc">"{m.description}"</p>

              <div className="hero-cast">
                {m.cast.map(c => <span key={c} className="hero-cast-tag">{c}</span>)}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div className="hero-btns"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <motion.button className="btn-primary"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 44px ${m.accentColor}55`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              onClick={() => navigate(`/movies/${m.id}`)}>
              🎟 Book Tickets
            </motion.button>
            <motion.button className="btn-ghost"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              ▶ Trailer
            </motion.button>
            <motion.button
              className={`btn-icon ${wish.includes(m.id) ? "wish-active" : "wish-inactive"}`}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              onClick={() => toggleWish(m.id)}>
              {wish.includes(m.id) ? "♥" : "♡"}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Poster strip */}
      <div className="poster-strip">
        {movies.map((mv, i) => (
          <motion.div key={mv.id} className="poster-thumb"
            onClick={() => pickMovie(i)}
            animate={{
              opacity: i === active ? 1    : 0.38,
              x:       i === active ? -12  : 0,
              width:   i === active ? 82   : 62,
              height:  i === active ? 118  : 88,
            }}
            transition={{ duration: 0.35 }}
            whileHover={{ scale: 1.06, x: -6 }} whileTap={{ scale: 0.95 }}
            style={{
              border: `2px solid ${i === active ? mv.accentColor : "rgba(255,255,255,0.07)"}`,
              boxShadow: i === active
                ? `0 0 28px ${mv.accentColor}55, 0 12px 36px rgba(0,0,0,0.7)`
                : "0 4px 20px rgba(0,0,0,0.6)",
            }}>
            <img src={mv.poster} alt={mv.title} />
          </motion.div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="progress-dots">
        {movies.map((mv, i) => (
          <motion.div key={i} className="progress-dot"
            onClick={() => pickMovie(i)}
            animate={{
              width:           i === active ? 34 : 8,
              backgroundColor: i === active ? mv.accentColor : "rgba(255,255,255,0.18)",
            }}
            transition={{ duration: 0.3 }}>
            {i === active && !paused && (
              <motion.div className="progress-fill"
                key={`fill-${active}`}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 3, ease: "linear" }} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div className="scroll-hint"
        animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
        <span>Scroll</span>
        <div className="scroll-hint-line" />
      </motion.div>
    </div>
  );
}