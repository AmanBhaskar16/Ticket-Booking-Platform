// // import { useState, useRef, useEffect } from "react";
// // import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
// // import "./App.css";

// // /* ─────────────── DATA ─────────────── */

// // const MOVIES = [
// //   {
// //     id: 1, title: "Neon Requiem", genre: "Sci-Fi Thriller", rating: "9.1",
// //     duration: "2h 24m", year: "2026", badge: "NOW SHOWING",
// //     badgeBg: "#ef4444", accentColor: "#ff6b35", ratingColor: "#ff6b35",
// //     bookBg: "rgba(255,107,53,0.12)", bookBorder: "rgba(255,107,53,0.35)",
// //     poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80",
// //     bg: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1800&q=90",
// //     description: "In a city where memories are currency, a rogue detective hunts a thief who steals the past.",
// //     cast: ["A. Rivera", "J. Chen", "M. Okafor"], screens: 14, price: "₹280",
// //   },
// //   {
// //     id: 2, title: "Obsidian Sky", genre: "Epic Fantasy", rating: "8.7",
// //     duration: "3h 02m", year: "2026", badge: "TRENDING",
// //     badgeBg: "#a855f7", accentColor: "#c084fc", ratingColor: "#c084fc",
// //     bookBg: "rgba(192,132,252,0.12)", bookBorder: "rgba(192,132,252,0.35)",
// //     poster: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&q=80",
// //     bg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=90",
// //     description: "An ancient war erupts between realms as a forgotten heir reclaims a throne made of shadows.",
// //     cast: ["L. Fontaine", "R. Nakamura", "S. Adeyemi"], screens: 22, price: "₹320",
// //   },
// //   {
// //     id: 3, title: "Hollow Signal", genre: "Psychological Horror", rating: "8.4",
// //     duration: "1h 58m", year: "2026", badge: "NEW",
// //     badgeBg: "#22c55e", accentColor: "#4ade80", ratingColor: "#4ade80",
// //     bookBg: "rgba(74,222,128,0.12)", bookBorder: "rgba(74,222,128,0.35)",
// //     poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
// //     bg: "https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1800&q=90",
// //     description: "A radio operator receives transmissions from the future — all of them her own voice, screaming.",
// //     cast: ["P. Volkov", "T. Osei", "C. Laurent"], screens: 9, price: "₹240",
// //   },
// //   {
// //     id: 4, title: "Last Meridian", genre: "Action Drama", rating: "8.9",
// //     duration: "2h 15m", year: "2026", badge: "HOT",
// //     badgeBg: "#f59e0b", accentColor: "#fbbf24", ratingColor: "#fbbf24",
// //     bookBg: "rgba(251,191,36,0.12)", bookBorder: "rgba(251,191,36,0.35)",
// //     poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
// //     bg: "https://images.unsplash.com/photo-1475274047050-1d0c0975864c?w=1800&q=90",
// //     description: "A mercenary on her final mission discovers the city she's been hired to destroy is the one she built.",
// //     cast: ["D. Mercer", "A. Singh", "O. Johansson"], screens: 18, price: "₹300",
// //   },
// // ];

// // const UPCOMING = [
// //   { title: "Veil Protocol", genre: "Espionage", date: "Mar 21", hype: 94, img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80" },
// //   { title: "Carbon Ghost",  genre: "Sci-Fi",    date: "Apr 4",  hype: 88, img: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=500&q=80" },
// //   { title: "Savage Dawn",   genre: "Western",   date: "Apr 18", hype: 76, img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80" },
// //   { title: "Deep Red",      genre: "Thriller",  date: "May 2",  hype: 91, img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=500&q=80" },
// //   { title: "Static Hymn",   genre: "Drama",     date: "May 16", hype: 82, img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&q=80" },
// // ];

// // const CINEMAS = [
// //   { name: "CINEVERSE IMAX", location: "Connaught Place", dist: "2.1 km", screens: 8,  rating: "4.9", tags: ["IMAX","Dolby","4DX","Bar"] },
// //   { name: "GRAND CINEPLEX", location: "Cyber Hub",       dist: "4.7 km", screens: 12, rating: "4.7", tags: ["IMAX","Recliner","Dine-in"] },
// //   { name: "NEXUS CINEMAS",  location: "Vasant Kunj",     dist: "7.3 km", screens: 6,  rating: "4.5", tags: ["3D","Dolby","Parking"] },
// // ];

// // const REVIEWS = [
// //   { name: "Rahul M.",  movie: "Neon Requiem",  stars: 5, initials: "RM", ago: "2 days ago",  text: "Absolutely mind-blowing visuals. Best sci-fi I've seen in years. The ending left me speechless." },
// //   { name: "Priya K.",  movie: "Obsidian Sky",  stars: 5, initials: "PK", ago: "1 day ago",   text: "Epic world-building and stunning performances. Stayed for the second show immediately after." },
// //   { name: "Arjun S.",  movie: "Last Meridian", stars: 4, initials: "AS", ago: "3 hours ago", text: "Non-stop action with a surprisingly emotional core. A must-watch on the big screen." },
// // ];

// // const STATS   = [{ v: "2.4M+", l: "Tickets Sold" },{ v: "340+", l: "Screens Nationwide" },{ v: "98%", l: "Satisfaction Rate" },{ v: "4.9★", l: "App Rating" }];
// // const TIMES   = ["10:30 AM","1:15 PM","4:00 PM","7:45 PM","10:30 PM"];
// // const OCC     = [42, 67, 55, 81, 48];
// // const FORMATS = ["2D","3D","IMAX","4DX","Dolby Atmos"];
// // const DATES   = ["Today","Sat 7","Sun 8","Mon 9"];
// // const TICKER  = ["🎬 NOW BOOKING: NEON REQUIEM","⭐ TRENDING: OBSIDIAN SKY — 8.7","🔥 NEW: HOLLOW SIGNAL","🎟 PRIME PASS — ₹799/MO","📍 14 CINEMAS NEAR YOU","🏆 BEST PICTURE: LAST MERIDIAN"];
// // const FCOLS   = [
// //   { title: "Explore", links: ["Movies","Cinemas","Events","Coming Soon"] },
// //   { title: "Account", links: ["Sign In","Register","Prime Pass","My Tickets"] },
// //   { title: "Company", links: ["About Us","Careers","Press","Contact"] },
// // ];

// // /* ─────────────── HELPERS ─────────────── */

// // function Stars({ n }: { n: number }) {
// //   return (
// //     <span>
// //       <span className="stars-amber">{"★".repeat(n)}</span>
// //       <span className="stars-dim">{"★".repeat(5 - n)}</span>
// //     </span>
// //   );
// // }

// // function SectionHeader({ eyebrow, title, cta }: { eyebrow: string; title: string; cta?: string }) {
// //   return (
// //     <motion.div className="sec-head" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
// //       <div>
// //         <p className="sec-eyebrow">{eyebrow}</p>
// //         <h2 className="sec-title">{title}</h2>
// //       </div>
// //       {cta && <a href="#" className="sec-cta">{cta} →</a>}
// //     </motion.div>
// //   );
// // }

// // /* ─────────────── APP ─────────────── */

// // export default function App() {
// //   const [active,  setActive]  = useState(0);
// //   const [paused,  setPaused]  = useState(false);
// //   const [selTime, setSelTime] = useState<string | null>(null);
// //   const [selFmt,  setSelFmt]  = useState("IMAX");
// //   const [selDate, setSelDate] = useState("Today");
// //   const [wish,    setWish]    = useState<number[]>([]);
// //   const [hCard,   setHCard]   = useState<number | null>(null);
// //   const heroRef = useRef<HTMLDivElement>(null);

// //   const { scrollYProgress } = useScroll({ target: heroRef });
// //   const bgY      = useTransform(scrollYProgress, [0, 1],   ["0%", "20%"]);
// //   const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

// //   // Auto-rotate every 3 s
// //   useEffect(() => {
// //     if (paused) return;
// //     const t = setInterval(() => setActive(p => (p + 1) % MOVIES.length), 3000);
// //     return () => clearInterval(t);
// //   }, [paused]);

// //   const m = MOVIES[active];
// //   const pickMovie = (i: number) => { setActive(i); setPaused(true); setTimeout(() => setPaused(false), 8000); };
// //   const toggleWish = (id: number) => setWish(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

// //   return (
// //     <div className="page">
// //       <div className="grain" />
// //       <div className="scanlines" />

// //       {/* ══ TICKER ══ */}
// //       <div className="ticker-bar">
// //         <div className="anim-ticker" style={{ display: "flex", whiteSpace: "nowrap" }}>
// //           {[0, 1].map(ri => (
// //             <div key={ri} style={{ display: "flex" }}>
// //               {TICKER.map((t, i) => <span key={i} className="ticker-text">{t}</span>)}
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* ══ NAVBAR ══ */}
// //       <motion.nav className="navbar" initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
// //         <div className="navbar-logo">
// //           <motion.div className="navbar-logo-icon" whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>🎬</motion.div>
// //           <span className="navbar-logo-text">CINEVERSE</span>
// //         </div>

// //         <div className="navbar-links">
// //           {["Movies","Cinemas","Events","Offers","My Tickets"].map((item, i) => (
// //             <motion.a key={item} href="#" className="navbar-link"
// //               initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 * i + 0.3 }}>
// //               {item}
// //             </motion.a>
// //           ))}
// //         </div>

// //         <div className="navbar-actions">
// //           <div className="navbar-search">
// //             <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(232,228,220,0.35)" strokeWidth="2.2">
// //               <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
// //             </svg>
// //             <span>Search…</span>
// //           </div>
// //           <motion.button className="btn-signin" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Sign In</motion.button>
// //           <motion.button className="btn-join"   whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Join Now</motion.button>
// //         </div>
// //       </motion.nav>

// //       {/* ══ HERO ══ */}
// //       <div ref={heroRef} className="hero">
// //         {/* BG */}
// //         <AnimatePresence mode="wait">
// //           <motion.div key={`bg-${active}`} className="hero-bg"
// //             style={{ backgroundImage: `url(${m.bg})`, y: bgY }}
// //             initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
// //             transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
// //           />
// //         </AnimatePresence>

// //         <motion.div className="hero-overlay" style={{ opacity: heroFade }}>
// //           <div className="hero-overlay-l" />
// //           <div className="hero-overlay-b" />
// //         </motion.div>
// //         <div className="hero-grid" />

// //         {/* Content */}
// //         <div className="hero-content">
// //           <div className="hero-text">

// //             <AnimatePresence mode="wait">
// //               <motion.div key={`badge-${active}`} className="hero-badge-row"
// //                 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
// //                 <span className="hero-badge" style={{ background: m.badgeBg }}>{m.badge}</span>
// //                 <span className="hero-genre">{m.genre} · {m.year}</span>
// //                 <span className="hero-live">
// //                   <span className="hero-live-dot anim-pdot" />
// //                   <span className="hero-live-text">LIVE BOOKING</span>
// //                 </span>
// //               </motion.div>
// //             </AnimatePresence>

// //             <AnimatePresence mode="wait">
// //               <motion.h1 key={`title-${active}`} className="hero-title"
// //                 style={{ textShadow: `0 0 120px ${m.accentColor}22` }}
// //                 initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
// //                 transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
// //                 {m.title}
// //               </motion.h1>
// //             </AnimatePresence>

// //             <AnimatePresence mode="wait">
// //               <motion.div key={`meta-${active}`}
// //                 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>
// //                 <div className="hero-meta">
// //                   <Stars n={Math.round(parseFloat(m.rating) / 2)} />
// //                   <strong style={{ color: "#fbbf24", fontSize: 15 }}>{m.rating}</strong>
// //                   {[`⏱ ${m.duration}`, `🎭 ${m.screens} screens`, `🎫 From ${m.price}`].map((t, i) => (
// //                     <span key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //                       <span className="hero-sep" />
// //                       <span className="hero-meta-item">{t}</span>
// //                     </span>
// //                   ))}
// //                 </div>
// //                 <p className="hero-desc">"{m.description}"</p>
// //                 <div className="hero-cast">
// //                   {m.cast.map(c => <span key={c} className="hero-cast-tag">{c}</span>)}
// //                 </div>
// //               </motion.div>
// //             </AnimatePresence>

// //             <motion.div className="hero-btns" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
// //               <motion.button className="btn-book" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
// //                 onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 44px ${m.accentColor}55`)}
// //                 onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
// //                 🎟 Book Tickets
// //               </motion.button>
// //               <motion.button className="btn-trailer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>▶ Trailer</motion.button>
// //               <motion.button className={`btn-wish ${wish.includes(m.id) ? "active" : "inactive"}`}
// //                 whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
// //                 onClick={() => toggleWish(m.id)}>
// //                 {wish.includes(m.id) ? "♥" : "♡"}
// //               </motion.button>
// //             </motion.div>
// //           </div>
// //         </div>

// //         {/* Poster strip */}
// //         <div className="poster-strip">
// //           {MOVIES.map((mv, i) => (
// //             <motion.div key={mv.id} className="poster-thumb" onClick={() => pickMovie(i)}
// //               animate={{ opacity: i === active ? 1 : 0.38, x: i === active ? -12 : 0, width: i === active ? 82 : 62, height: i === active ? 118 : 88 }}
// //               transition={{ duration: 0.35 }}
// //               whileHover={{ scale: 1.06, x: -6 }} whileTap={{ scale: 0.95 }}
// //               style={{ border: `2px solid ${i === active ? mv.accentColor : "rgba(255,255,255,0.07)"}`, boxShadow: i === active ? `0 0 28px ${mv.accentColor}55, 0 12px 36px rgba(0,0,0,0.7)` : "0 4px 20px rgba(0,0,0,0.6)" }}>
// //               <img src={mv.poster} alt={mv.title} />
// //             </motion.div>
// //           ))}
// //         </div>

// //         {/* Progress dots */}
// //         <div className="progress-dots">
// //           {MOVIES.map((mv, i) => (
// //             <motion.div key={i} className="progress-dot" onClick={() => pickMovie(i)}
// //               animate={{ width: i === active ? 34 : 8, backgroundColor: i === active ? mv.accentColor : "rgba(255,255,255,0.18)" }}
// //               transition={{ duration: 0.3 }}>
// //               {i === active && !paused && (
// //                 <motion.div className="progress-fill" key={`fill-${active}`}
// //                   initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3, ease: "linear" }} />
// //               )}
// //             </motion.div>
// //           ))}
// //         </div>

// //         {/* Scroll hint */}
// //         <motion.div className="scroll-hint" animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
// //           <span>Scroll</span>
// //           <div className="scroll-hint-line" />
// //         </motion.div>
// //       </div>

// //       {/* ══ STATS ══ */}
// //       <motion.div className="stats-strip" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
// //         {STATS.map((s, i) => (
// //           <motion.div key={i} className="stat-item"
// //             initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
// //             <div className="stat-value">{s.v}</div>
// //             <div className="stat-label">{s.l}</div>
// //           </motion.div>
// //         ))}
// //       </motion.div>

// //       {/* ══ SHOWTIME ══ */}
// //       <section className="section">
// //         <SectionHeader eyebrow="Today · Friday, March 6" title="PICK YOUR SHOWTIME" />

// //         <div className="format-row">
// //           {FORMATS.map(f => (
// //             <button key={f} onClick={() => setSelFmt(f)}
// //               className={`format-btn ${selFmt === f ? "active" : "inactive"}`}>{f}</button>
// //           ))}
// //           <div className="date-row">
// //             {DATES.map(d => (
// //               <button key={d} onClick={() => setSelDate(d)}
// //                 className={`date-btn ${selDate === d ? "active" : "inactive"}`}>{d}</button>
// //             ))}
// //           </div>
// //         </div>

// //         <div className="slots-row">
// //           {TIMES.map((time, i) => (
// //             <motion.div key={time} className={`slot ${selTime === time ? "active" : "inactive"}`}
// //               onClick={() => setSelTime(time)}
// //               initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
// //               whileHover={{ y: -5, boxShadow: "0 20px 52px rgba(249,115,22,0.16)" }} whileTap={{ scale: 0.97 }}>
// //               <div className={`slot-time ${selTime === time ? "active" : "inactive"}`}>{time}</div>
// //               <div className="slot-sub">{selFmt} · {OCC[i]}% filled</div>
// //               <div className="slot-status">{OCC[i] > 75 ? "⚡ Filling fast" : OCC[i] > 55 ? "🟡 Moderate" : "✅ Available"}</div>
// //               <div className="slot-bar">
// //                 <div className="slot-fill" style={{ width: `${OCC[i]}%`, background: selTime === time ? "#f97316" : OCC[i] > 75 ? "#ef4444" : "rgba(255,255,255,0.2)" }} />
// //               </div>
// //             </motion.div>
// //           ))}
// //         </div>

// //         <AnimatePresence>
// //           {selTime && (
// //             <motion.div className="confirm-bar"
// //               initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
// //               <span>Selected: <strong>{m.title}</strong> · {selTime} · {selFmt}</span>
// //               <motion.button className="btn-continue" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Continue →</motion.button>
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </section>

// //       {/* ══ NOW SHOWING ══ */}
// //       <section className="section-sm">
// //         <SectionHeader eyebrow="In Theatres Now" title="NOW SHOWING" cta="View All" />
// //         <div className="movies-grid">
// //           {MOVIES.map((mv, i) => (
// //             <motion.div key={mv.id} className="movie-card"
// //               initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
// //               transition={{ delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
// //               onHoverStart={() => setHCard(mv.id)} onHoverEnd={() => setHCard(null)}
// //               whileHover={{ y: -10 }}>

// //               <div className="movie-poster">
// //                 <motion.img src={mv.poster} alt={mv.title} animate={{ scale: hCard === mv.id ? 1.08 : 1 }} transition={{ duration: 0.55 }} />
// //                 <div className="movie-poster-grad" />
// //                 <span className="movie-badge" style={{ background: mv.badgeBg }}>{mv.badge}</span>
// //                 <motion.button className="movie-wish-btn"
// //                   onClick={e => { e.stopPropagation(); toggleWish(mv.id); }}
// //                   whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
// //                   style={{ color: wish.includes(mv.id) ? "#f97316" : "rgba(255,255,255,0.5)" }}>
// //                   {wish.includes(mv.id) ? "♥" : "♡"}
// //                 </motion.button>
// //                 <AnimatePresence>
// //                   {hCard === mv.id && (
// //                     <motion.div className="movie-play-overlay"
// //                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
// //                       <motion.div className="movie-play-btn"
// //                         initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>▶</motion.div>
// //                     </motion.div>
// //                   )}
// //                 </AnimatePresence>
// //               </div>

// //               <div className="movie-info">
// //                 <h3 className="movie-title">{mv.title}</h3>
// //                 <p className="movie-genre">{mv.genre} · {mv.duration}</p>
// //                 <div className="movie-row">
// //                   <Stars n={Math.round(parseFloat(mv.rating) / 2)} />
// //                   <strong className="movie-rating" style={{ color: mv.ratingColor }}>{mv.rating}</strong>
// //                 </div>
// //                 <div className="movie-card-btns">
// //                   <motion.button className="btn-book-sm"
// //                     onClick={() => setActive(i)}
// //                     whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
// //                     style={{ background: mv.bookBg, border: `1px solid ${mv.bookBorder}`, color: mv.accentColor }}>
// //                     Book Now
// //                   </motion.button>
// //                   <motion.button className="btn-info" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>ℹ</motion.button>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* ══ COMING SOON ══ */}
// //       <section className="section-sm">
// //         <SectionHeader eyebrow="On The Horizon" title="COMING SOON" cta="Full Calendar" />
// //         <div className="upcoming-row">
// //           {UPCOMING.map((u, i) => (
// //             <motion.div key={u.title} className="upcoming-card"
// //               initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
// //               transition={{ delay: i * 0.07, duration: 0.5 }}>
// //               <div className="upcoming-poster">
// //                 <img src={u.img} alt={u.title} />
// //                 <div className="upcoming-grad" />
// //                 <div className="upcoming-date">{u.date}</div>
// //                 <div className="hype-box">
// //                   <div className="hype-row">
// //                     <span className="hype-label">Hype</span>
// //                     <span className="hype-pct">{u.hype}%</span>
// //                   </div>
// //                   <div className="hype-bar">
// //                     <motion.div className="hype-fill"
// //                       initial={{ width: 0 }} whileInView={{ width: `${u.hype}%` }}
// //                       viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }} />
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="upcoming-info">
// //                 <p className="upcoming-title">{u.title}</p>
// //                 <div className="upcoming-foot">
// //                   <span className="upcoming-genre">{u.genre}</span>
// //                   <motion.button className="btn-notify" whileHover={{ scale: 1.05 }}>Notify</motion.button>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* ══ CINEMAS NEARBY ══ */}
// //       <section className="section-sm">
// //         <SectionHeader eyebrow="Around You" title="CINEMAS NEARBY" cta="See All" />
// //         <div className="cinemas-grid">
// //           {CINEMAS.map((c, i) => (
// //             <motion.div key={c.name} className="cinema-card"
// //               initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
// //               transition={{ delay: i * 0.1, duration: 0.55 }}>
// //               <div className="cinema-glow" />
// //               <div className="cinema-head">
// //                 <div>
// //                   <h3 className="cinema-name">{c.name}</h3>
// //                   <p className="cinema-loc">📍 {c.location} · {c.dist}</p>
// //                 </div>
// //                 <div>
// //                   <div className="cinema-rating">{c.rating}</div>
// //                   <div className="cinema-rating-l">Rating</div>
// //                 </div>
// //               </div>
// //               <div className="cinema-tags">
// //                 {c.tags.map(t => <span key={t} className="cinema-tag">{t}</span>)}
// //               </div>
// //               <div className="cinema-foot">
// //                 <span className="cinema-screens">{c.screens} screens available</span>
// //                 <motion.button className="btn-dir" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>Directions</motion.button>
// //               </div>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* ══ REVIEWS ══ */}
// //       <section className="section-sm">
// //         <SectionHeader eyebrow="What Audiences Say" title="AUDIENCE REVIEWS" cta="Read More" />
// //         <div className="reviews-grid">
// //           {REVIEWS.map((r, i) => (
// //             <motion.div key={i} className="review-card"
// //               initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
// //               transition={{ delay: i * 0.1, duration: 0.5 }}>
// //               <div className="review-head">
// //                 <div className="review-avatar">{r.initials}</div>
// //                 <div>
// //                   <p className="review-name">{r.name}</p>
// //                   <p className="review-sub">on {r.movie} · {r.ago}</p>
// //                 </div>
// //               </div>
// //               <span className="review-stars">{"★".repeat(r.stars)}<span style={{ color: "#3f3f46" }}>{"★".repeat(5 - r.stars)}</span></span>
// //               <p className="review-text">"{r.text}"</p>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* ══ PRIME PASS ══ */}
// //       <motion.section className="prime-section"
// //         initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
// //         <div className="prime-glow-r" /><div className="prime-glow-l" /><div className="prime-line" />
// //         <div className="prime-inner">
// //           <div>
// //             <p className="prime-eyebrow">Exclusive Membership</p>
// //             <h3 className="prime-title">CINEVERSE<br /><span className="prime-accent">PRIME</span> PASS</h3>
// //             <p className="prime-desc">Unlimited movies, zero booking fees, priority seating, exclusive screenings and member-only events.</p>
// //             <div className="prime-features">
// //               {["✓ Unlimited Tickets","✓ No Booking Fees","✓ Early Access","✓ Exclusive Events"].map(f => (
// //                 <span key={f} className="prime-feature">{f}</span>
// //               ))}
// //             </div>
// //           </div>
// //           <div className="prime-price-box">
// //             <div className="prime-was">₹1,299 / month</div>
// //             <div className="prime-price">₹<span className="prime-accent">799</span></div>
// //             <div className="prime-period">per month · cancel anytime</div>
// //             <motion.button className="btn-prime" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>Get Prime Pass →</motion.button>
// //             <p className="prime-note">First month free · No commitment</p>
// //           </div>
// //         </div>
// //       </motion.section>

// //       {/* ══ APP DOWNLOAD ══ */}
// //       <motion.section className="app-section"
// //         initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
// //         <div className="app-glow" />
// //         <div>
// //           <p className="app-eyebrow">Take It With You</p>
// //           <h3 className="app-title">GET THE APP</h3>
// //           <p className="app-desc">Book tickets, track your watchlist, and get exclusive in-app deals. Available on iOS and Android.</p>
// //         </div>
// //         <div className="app-btns">
// //           {[{ l: "App Store", s: "iOS" },{ l: "Google Play", s: "Android" }].map(btn => (
// //             <motion.button key={btn.l} className="btn-store" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
// //               <p className="btn-store-sub">{btn.s}</p>
// //               <p className="btn-store-name">{btn.l}</p>
// //             </motion.button>
// //           ))}
// //         </div>
// //       </motion.section>

// //       {/* ══ FOOTER ══ */}
// //       <footer className="footer">
// //         <div className="footer-top">
// //           <div>
// //             <div className="footer-logo">
// //               <div className="footer-logo-icon">🎬</div>
// //               <span className="footer-logo-text">CINEVERSE</span>
// //             </div>
// //             <p className="footer-about">India's premier cinematic experience platform. Bringing you the best of world cinema.</p>
// //           </div>
// //           {FCOLS.map(col => (
// //             <div key={col.title}>
// //               <p className="footer-col-title">{col.title}</p>
// //               {col.links.map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
// //             </div>
// //           ))}
// //         </div>
// //         <div className="footer-bottom">
// //           <p className="footer-copy">© 2026 Cineverse Entertainment Pvt. Ltd. All rights reserved.</p>
// //           <div className="footer-legal">
// //             {["Privacy Policy","Terms of Use","Cookie Settings"].map(l => <a key={l} href="#">{l}</a>)}
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // }

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./styles/global.css";
// import HomePage from "../src/pages/HomePage/HomePage.tsx";

// // Lazy-load heavy pages so the homepage bundle stays small
// import { lazy, Suspense } from "react";
// const MovieDetailPage = lazy(() => import("../src/pages/MovieDetailPage/MovieDetailPage.tsx"));

// function PageLoader() {
//   return (
//     <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
//       <div className="anim-spin" style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(255,255,255,.06)", borderTopColor: "#f97316" }} />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Suspense fallback={<PageLoader />}>
//         <Routes>
//           <Route path="/"            element={<HomePage />} />
//           <Route path="/movies/:id"  element={<MovieDetailPage />} />
//         </Routes>
//       </Suspense>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route} from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ProtectedRoute, ToastProvider } from "./components/common/SharedUI/SharedUI.tsx";
import "./styles/global.css";

const LoginPage         = lazy(() => import("./pages/auth/LoginPage.tsx"));
const SignupPage        = lazy(() => import("./pages/auth/SignUpPage.tsx").then(m => ({ default: m.SignupPage })));
const ResetPasswordPage = lazy(() => import("./pages/auth/SignUpPage.tsx").then(m => ({ default: m.ResetPasswordPage })));
const MoviesPage           = lazy(() => import("./pages/movies/MoviePage/MoviePage.tsx"));
const UserMovieDetailPage  = lazy(() => import("./pages/movies/UserMovieDetail/UserMovieDetailPage.tsx"));
const TheatresPage         = lazy(() => import("./pages/movies/TheatresPage/TheatresPage.tsx"));
const TheatreDetailPage = lazy(() => import("./pages/movies/UserMovieDetail/TheatreDetailPage.tsx"));
const PaymentPage  = lazy(() => import("./pages/booking/PaymentPage/PaymentPage.tsx"));
const TicketPage   = lazy(() => import("./pages/booking/TicketPage/TicketPage.tsx"));
const SeatSelectionPage = lazy(() => import("./pages/booking/SeatSelectionPage/SeatSelectionPage.tsx"));
const MyBookingsPage = lazy(()=>import("./pages/booking/MyBookingsPage/MyBookingsPage.tsx"));
const AdminDashboard    = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const HomePage          = lazy(() => import("./pages/HomePage/HomePage.tsx"));

function PageLoader() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#080808" }}>
      <div className="spinner" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
      <BrowserRouter>
        <ToastProvider />
        <div className="grain" />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Landing (cinematic homepage) */}
            <Route path="/"             element={<HomePage />} />

            {/* Auth */}
            <Route path="/login"        element={<LoginPage />} />
            <Route path="/signup"       element={<SignupPage />} />

            {/* Movies */}
            <Route path="/movies"       element={<MoviesPage />} />
            <Route path="/movies/:id"   element={<UserMovieDetailPage />} />
            <Route path="/theatres"     element={<TheatresPage />} />
            <Route path="/theatres/:id" element={<TheatreDetailPage />} />

            {/* Protected user */}
            <Route path="/reset-password" element={<ProtectedRoute><ResetPasswordPage /></ProtectedRoute>} />
            <Route path="/shows/:showId/seats" element={<ProtectedRoute><SeatSelectionPage /></ProtectedRoute>} />
            <Route path="/payment"             element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
            <Route path="/ticket/:bookingId"   element={<ProtectedRoute><TicketPage /></ProtectedRoute>} />
            <Route path="/my-bookings"  element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />

            {/* Admin / Client */}
            <Route path="/dashboard"    element={<ProtectedRoute roles={["ADMIN","CLIENT"]}><AdminDashboard /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,background:"#080808" }}>
                <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:96,color:"rgba(239,68,68,.2)" }}>404</p>
                <p style={{ color:"rgba(255,255,255,.3)",fontSize:16 }}>Page not found</p>
                <a href="/movies" style={{ padding:"12px 28px",background:"linear-gradient(135deg,#ef4444,#f97316)",borderRadius:10,color:"#fff",fontWeight:700,fontSize:13,letterSpacing:2,textTransform:"uppercase",textDecoration:"none" }}>Go to Movies</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}