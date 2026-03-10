// import { useState, useEffect} from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import "./App.css";          // shared reset, navbar, grain, scanlines
// import "./movies.css";   // page-specific styles

// /* ─────────────── TYPES (matching movie.model.js exactly) ─────────────── */

// type ReleaseStatus = "COMING_SOON" | "RELEASED" | "BANNED";
// type Certificate   = "U" | "UA" | "A" | "R" | "PG-13";

// interface Movie {
//   _id:           string;
//   name:          string;
//   description:   string;
//   casts:         string[];       // array of strings from model
//   trailerUrl:    string;
//   languages:     string[];
//   releaseDate:   string;         // ISO date string from MongoDB
//   duration:      number;         // minutes
//   posterUrl:     string;
//   genre:         string[];
//   rating:        number;         // 0–10
//   certificate:   Certificate;
//   director:      string;
//   releaseStatus: ReleaseStatus;
//   isActive:      boolean;
//   createdAt:     string;
//   updatedAt:     string;
// }

// /* ─────────────── API CONFIG ─────────────── */
// // Change this to your actual base URL, e.g. "http://localhost:5000/api"
// const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

// async function fetchMovie(id: string): Promise<Movie> {
//   const res = await fetch(`${BASE_URL}/movies/${id}`);
//   if (!res.ok) {
//     const body = await res.json().catch(() => ({}));
//     throw new Error(body?.err ?? `HTTP ${res.status}`);
//   }
//   const body = await res.json();
//   // controller returns: { success, message, data: movie }
//   return body.data as Movie;
// }

// async function fetchAllMovies(params?: Record<string, string>): Promise<Movie[]> {
//   const qs = params ? "?" + new URLSearchParams(params).toString() : "";
//   const res = await fetch(`${BASE_URL}/movies${qs}`);
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   const body = await res.json();
//   return body.data as Movie[];
// }

// /* ─────────────── HELPERS ─────────────── */

// function formatDuration(mins: number): string {
//   const h = Math.floor(mins / 60);
//   const m = mins % 60;
//   return h > 0 ? `${h}h ${m}m` : `${m}m`;
// }

// function formatDate(iso: string): string {
//   return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
// }

// function getInitials(name: string): string {
//   return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
// }

// function statusClass(s: ReleaseStatus): string {
//   return s === "RELEASED" ? "released" : s === "COMING_SOON" ? "coming-soon" : "banned";
// }

// function statusLabel(s: ReleaseStatus): string {
//   return s === "RELEASED" ? "Now Showing" : s === "COMING_SOON" ? "Coming Soon" : "Banned";
// }

// function StarRow({ rating }: { rating: number }) {
//   // rating is 0-10, display as 5-star
//   const filled = Math.round(rating / 2);
//   return (
//     <span className="md-rating-stars">
//       {"★".repeat(filled)}
//       <span className="dim">{"★".repeat(5 - filled)}</span>
//     </span>
//   );
// }

// function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
//   useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); });
//   return (
//     <motion.div className="md-toast"
//       initial={{ opacity: 0, y: 20, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}>
//       <span className="md-toast-icon">✓</span>
//       <span className="md-toast-text">{msg}</span>
//     </motion.div>
//   );
// }

// /* ─────────────── SKELETON ─────────────── */
// function SkeletonHero() {
//   return (
//     <div className="md-hero" style={{ background: "#0e0e0e" }}>
//       <div className="md-hero-content">
//         <div className="md-hero-inner">
//           <div className="skeleton" style={{ width: 220, height: 320, borderRadius: 16, flexShrink: 0 }} />
//           <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, paddingBottom: 4 }}>
//             <div className="skeleton" style={{ width: 120, height: 16 }} />
//             <div className="skeleton" style={{ width: "60%", height: 72 }} />
//             <div className="skeleton" style={{ width: 180, height: 14 }} />
//             <div className="skeleton" style={{ width: "45%", height: 14 }} />
//             <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
//               {[130, 110, 44, 44].map((w, i) => <div key={i} className="skeleton" style={{ width: w, height: 48, borderRadius: 10 }} />)}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────── MAIN COMPONENT ─────────────── */

// export default function MovieDetail() {
//   const { id }   = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [movie,       setMovie]       = useState<Movie | null>(null);
//   const [similar,     setSimilar]     = useState<Movie[]>([]);
//   const [loading,     setLoading]     = useState(true);
//   const [error,       setError]       = useState<string | null>(null);
//   const [wishlisted,  setWishlisted]  = useState(false);
//   const [showTrailer, setShowTrailer] = useState(false);
//   const [showShare,   setShowShare]   = useState(false);
//   const [toast,       setToast]       = useState<string | null>(null);
//   const [imgError,    setImgError]    = useState(false);

//   // Load movie + similar movies in parallel
//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     setError(null);
//     setImgError(false);

//     (async () => {
//       try {
//         const [movieData, allMovies] = await Promise.all([
//           fetchMovie(id),
//           fetchAllMovies({ limit: "10" }).catch(() => [] as Movie[]),
//         ]);
//         setMovie(movieData);

//         // Similar = same genre, exclude current
//         const sim = allMovies.filter(
//           m => m._id !== id && m.genre.some(g => movieData.genre.includes(g))
//         ).slice(0, 4);
//         setSimilar(sim);
//       } catch (err: any) {
//         setError(err?.message ?? "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   // Extract YouTube ID from trailerUrl (supports youtu.be and youtube.com)
//   function getYouTubeId(url: string): string | null {
//     const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?/\s]{11})/);
//     return match ? match[1] : null;
//   }

//   function copyLink() {
//     navigator.clipboard.writeText(window.location.href).then(() => {
//       setToast("Link copied to clipboard!");
//       setShowShare(false);
//     });
//   }

//   /* ── Loading ── */
//   if (loading) {
//     return (
//       <div className="page">
//         <div className="grain" /><div className="scanlines" />
//         <Navbar />
//         <SkeletonHero />
//         <div className="md-loading" style={{ minHeight: 300 }}>
//           <div className="md-loading-spinner" />
//           <p className="md-loading-text">Loading movie details…</p>
//         </div>
//       </div>
//     );
//   }

//   /* ── Error ── */
//   if (error || !movie) {
//     return (
//       <div className="page">
//         <div className="grain" /><div className="scanlines" />
//         <Navbar />
//         <div className="md-error">
//           <div className="md-error-code">404</div>
//           <p className="md-error-msg">Movie not found</p>
//           <p className="md-error-sub">{error}</p>
//           <button className="btn-back" onClick={() => navigate(-1)}>← Go Back</button>
//         </div>
//       </div>
//     );
//   }

//   const ytId        = getYouTubeId(movie.trailerUrl);
//   const thumbUrl    = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : movie.posterUrl;
//   const releasedYet = movie.releaseStatus === "RELEASED";

//   return (
//     <div className="page">
//       <div className="grain" /><div className="scanlines" />
//       <Navbar />

//       {/* ══ HERO BACKDROP ══ */}
//       <motion.div className="md-hero"
//         initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }}>

//         {/* Background — posterUrl blurred */}
//         <motion.div
//           className="md-hero-bg"
//           style={{
//             backgroundImage: imgError
//               ? "linear-gradient(135deg, #160800, #0d0d0d)"
//               : `url(${movie.posterUrl})`,
//           }}
//           initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [.22,1,.36,1] }}
//         />
//         <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)" }} />
//         <div className="md-hero-grad-l" />
//         <div className="md-hero-grad-b" />
//         <div className="md-hero-grid" />
//         <div className="md-hero-vignette" />

//         <div className="md-hero-content">
//           <div className="md-hero-inner">

//             {/* Poster */}
//             <motion.div className="md-poster-wrap"
//               initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }}>
//               <img
//                 className="md-poster"
//                 src={movie.posterUrl}
//                 alt={movie.name}
//                 onError={() => setImgError(true)}
//               />
//               <div className="md-poster-shine" />
//               <div className="md-cert-badge">{movie.certificate}</div>
//             </motion.div>

//             {/* Text */}
//             <motion.div className="md-hero-text"
//               initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .3, ease: [.22,1,.36,1] }}>

//               {/* Breadcrumb */}
//               <div className="md-breadcrumb">
//                 <Link to="/" className="">Home</Link>
//                 <span className="md-breadcrumb-sep">›</span>
//                 <Link to="/movies" className="">Movies</Link>
//                 <span className="md-breadcrumb-sep">›</span>
//                 <span className="md-breadcrumb-cur">{movie.name}</span>
//               </div>

//               {/* Badges */}
//               <div className="md-badge-row">
//                 <span className={`md-status-badge ${statusClass(movie.releaseStatus)}`}>
//                   {statusLabel(movie.releaseStatus)}
//                 </span>
//                 {movie.genre.map(g => <span key={g} className="md-genre-pill">{g}</span>)}
//                 <span className="md-cert-pill">{movie.certificate}</span>
//               </div>

//               {/* Title */}
//               <h1 className="md-title">{movie.name}</h1>

//               {/* Director */}
//               <p className="md-director">Directed by <span>{movie.director}</span></p>

//               {/* Rating + meta */}
//               <div className="md-meta-row">
//                 <div className="md-rating-box">
//                   <div>
//                     <StarRow rating={movie.rating} />
//                     <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
//                       <span className="md-rating-num">{movie.rating.toFixed(1)}</span>
//                       <span className="md-rating-max">/10</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="md-meta-sep" />
//                 <div className="md-meta-item">
//                   <span className="md-meta-label">Duration</span>
//                   <span className="md-meta-value">{formatDuration(movie.duration)}</span>
//                 </div>

//                 <div className="md-meta-sep" />
//                 <div className="md-meta-item">
//                   <span className="md-meta-label">Release Date</span>
//                   <span className="md-meta-value">{formatDate(movie.releaseDate)}</span>
//                 </div>

//                 <div className="md-meta-sep" />
//                 <div className="md-meta-item">
//                   <span className="md-meta-label">Certificate</span>
//                   <span className="md-meta-value">{movie.certificate}</span>
//                 </div>
//               </div>

//               {/* Languages */}
//               <div className="md-lang-row">
//                 {movie.languages.map(l => <span key={l} className="md-lang-chip">{l}</span>)}
//               </div>

//               {/* CTAs */}
//               <div className="md-cta-row">
//                 {releasedYet ? (
//                   <motion.button className="btn-book-main"
//                     whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
//                     onClick={() => navigate(`/movies/${movie._id}/book`)}>
//                     🎟 Book Tickets
//                   </motion.button>
//                 ) : (
//                   <motion.button className="btn-book-main"
//                     whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
//                     style={{ background: "linear-gradient(135deg,#6b21a8,#a855f7)" }}
//                     onClick={() => { setToast("You'll be notified when tickets go live!"); }}>
//                     🔔 Notify Me
//                   </motion.button>
//                 )}

//                 <motion.button className="btn-trailer-main"
//                   whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
//                   onClick={() => setShowTrailer(true)}>
//                   ▶ Watch Trailer
//                 </motion.button>

//                 <motion.button
//                   className={`btn-wishlist ${wishlisted ? "active" : ""}`}
//                   whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }}
//                   onClick={() => { setWishlisted(w => !w); setToast(wishlisted ? "Removed from wishlist" : "Added to wishlist!"); }}>
//                   {wishlisted ? "♥" : "♡"}
//                 </motion.button>

//                 <motion.button className="btn-share"
//                   whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }}
//                   onClick={() => setShowShare(true)}>
//                   ↗
//                 </motion.button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>

//       {/* ══ BODY ══ */}
//       <div className="md-body">

//         {/* ── LEFT COLUMN ── */}
//         <div>

//           {/* Description */}
//           <motion.div className="md-section"
//             initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55 }}>
//             <h2 className="md-section-title">About the Film</h2>
//             <p className="md-description">{movie.description}</p>
//           </motion.div>

//           {/* Cast */}
//           <motion.div className="md-section"
//             initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .05 }}>
//             <h2 className="md-section-title">Cast</h2>
//             <div className="md-cast-grid">
//               {movie.casts.map((name, i) => (
//                 <motion.div key={i} className="md-cast-card"
//                   initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }} transition={{ delay: i * .05 }}>
//                   <div className="md-cast-avatar">{getInitials(name)}</div>
//                   <span className="md-cast-name">{name}</span>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Genre */}
//           <motion.div className="md-section"
//             initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .1 }}>
//             <h2 className="md-section-title">Genre</h2>
//             <div className="md-genre-grid">
//               {movie.genre.map(g => (
//                 <motion.span key={g} className="md-genre-tag" whileHover={{ scale: 1.05 }}>{g}</motion.span>
//               ))}
//             </div>
//           </motion.div>

//           {/* Trailer */}
//           <motion.div className="md-section"
//             initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .12 }}>
//             <h2 className="md-section-title">Trailer</h2>
//             <div className="md-trailer-wrap">
//               <img className="md-trailer-thumb" src={thumbUrl} alt="Trailer thumbnail"
//                 onError={e => { (e.target as HTMLImageElement).src = movie.posterUrl; }} />
//               <div className="md-trailer-overlay" onClick={() => setShowTrailer(true)}>
//                 <motion.div className="md-play-circle" whileHover={{ scale: 1.1 }}>▶</motion.div>
//               </div>
//               <span className="md-trailer-label">Official Trailer</span>
//             </div>
//           </motion.div>

//           {/* Similar Movies */}
//           {similar.length > 0 && (
//             <motion.div className="md-section"
//               initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .15 }}>
//               <h2 className="md-section-title">You May Also Like</h2>
//               <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                 {similar.map((sm, i) => (
//                   <motion.div key={sm._id} className="md-similar-card"
//                     initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true }} transition={{ delay: i * .06 }}
//                     onClick={() => navigate(`/movies/${sm._id}`)}>
//                     <img className="md-similar-poster" src={sm.posterUrl} alt={sm.name}
//                       onError={e => { (e.target as HTMLImageElement).style.background = "#1a1a1a"; }} />
//                     <div className="md-similar-info">
//                       <span className="md-similar-title">{sm.name}</span>
//                       <span className="md-similar-genre">{sm.genre.join(", ")}</span>
//                       <span className="md-similar-rating">★ {sm.rating.toFixed(1)}/10</span>
//                       <span className={`md-similar-status ${statusClass(sm.releaseStatus)}`}>{statusLabel(sm.releaseStatus)}</span>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* ── RIGHT SIDEBAR ── */}
//         <motion.div className="md-sidebar"
//           initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .65, delay: .4, ease: [.22,1,.36,1] }}>

//           {/* Book Now Card */}
//           <div className="md-book-card">
//             <h3 className="md-book-title">
//               {releasedYet ? "Book Your Seats" : "Coming Soon"}
//             </h3>
//             <p className="md-book-sub">
//               {releasedYet ? "Select your preferred showtime and seats." : `Releases on ${formatDate(movie.releaseDate)}`}
//             </p>
//             {releasedYet && (
//               <>
//                 <div className="md-price-row">
//                   <span className="md-price-from">From</span>
//                   <span className="md-price-num">₹200</span>
//                   <span className="md-price-period">/ ticket</span>
//                 </div>
//                 <p className="md-book-note">Price varies by format & seat type</p>
//               </>
//             )}
//             <motion.button
//               className={releasedYet ? "btn-book-sidebar" : "btn-notify-sidebar"}
//               whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
//               onClick={() => releasedYet ? navigate(`/movies/${movie._id}/book`) : setToast("You'll be notified when tickets go live!")}>
//               {releasedYet ? "🎟 Book Tickets" : "🔔 Notify Me"}
//             </motion.button>
//             {!releasedYet && (
//               <button className="btn-notify-sidebar" style={{ marginTop: 8 }}
//                 onClick={() => setShowTrailer(true)}>▶ Watch Trailer</button>
//             )}
//           </div>

//           {/* Movie Info Card */}
//           <div className="md-info-card">
//             {[
//               { key: "Status",        val: statusLabel(movie.releaseStatus), cls: movie.releaseStatus === "RELEASED" ? "green" : movie.releaseStatus === "COMING_SOON" ? "orange" : "red" },
//               { key: "Director",      val: movie.director,          cls: "" },
//               { key: "Duration",      val: formatDuration(movie.duration), cls: "" },
//               { key: "Release Date",  val: formatDate(movie.releaseDate),  cls: "" },
//               { key: "Certificate",   val: movie.certificate,       cls: "orange" },
//               { key: "Rating",        val: `${movie.rating.toFixed(1)} / 10`, cls: "orange" },
//               { key: "Languages",     val: movie.languages.join(", "), cls: "" },
//               { key: "Genres",        val: movie.genre.join(", "),  cls: "" },
//             ].map(row => (
//               <div key={row.key} className="md-info-row">
//                 <span className="md-info-key">{row.key}</span>
//                 <span className={`md-info-val ${row.cls}`}>{row.val}</span>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       {/* ══ TRAILER MODAL ══ */}
//       <AnimatePresence>
//         {showTrailer && (
//           <motion.div className="md-trailer-modal-backdrop"
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={() => setShowTrailer(false)}>
//             <motion.div className="md-trailer-modal-inner"
//               initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .9, opacity: 0 }}
//               transition={{ duration: .3, ease: [.22,1,.36,1] }}
//               onClick={e => e.stopPropagation()}>
//               <button className="md-trailer-modal-close" onClick={() => setShowTrailer(false)}>✕</button>
//               <div className="md-trailer-iframe-wrap">
//                 {ytId ? (
//                   <iframe
//                     src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
//                     title={`${movie.name} Trailer`}
//                     allow="autoplay; encrypted-media"
//                     allowFullScreen
//                   />
//                 ) : (
//                   /* Non-YouTube: open in new tab */
//                   <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#0e0e0e" }}>
//                     <p style={{ color: "rgba(232,228,220,.5)", fontSize: 14 }}>Cannot embed this trailer directly.</p>
//                     <a href={movie.trailerUrl} target="_blank" rel="noreferrer"
//                       style={{ padding: "12px 28px", background: "linear-gradient(135deg,#ef4444,#f97316)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textDecoration: "none" }}>
//                       Open Trailer ↗
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ══ SHARE MODAL ══ */}
//       <AnimatePresence>
//         {showShare && (
//           <motion.div className="md-share-backdrop"
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={() => setShowShare(false)}>
//             <motion.div className="md-share-modal"
//               initial={{ scale: .9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .9, opacity: 0 }}
//               transition={{ duration: .25, ease: [.22,1,.36,1] }}
//               onClick={e => e.stopPropagation()}>
//               <button className="md-share-close" onClick={() => setShowShare(false)}>✕</button>
//               <h3 className="md-share-title">Share Movie</h3>
//               <p className="md-share-sub">Share "{movie.name}" with friends</p>
//               <div className="md-share-btns">
//                 {[
//                   { icon: "🔗", label: "Copy Link",   action: copyLink },
//                   { icon: "🐦", label: "Share on X",  action: () => window.open(`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(movie.name)} on Cineverse!&url=${encodeURIComponent(window.location.href)}`) },
//                   { icon: "💬", label: "WhatsApp",    action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${movie.name} - ${window.location.href}`)}`) },
//                 ].map(b => (
//                   <motion.button key={b.label} className="md-share-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }} onClick={b.action}>
//                     <span style={{ fontSize: 20 }}>{b.icon}</span>
//                     {b.label}
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ══ TOAST ══ */}
//       <AnimatePresence>
//         {toast && <Toast key={toast} msg={toast} onDone={() => setToast(null)} />}
//       </AnimatePresence>
//     </div>
//   );
// }

// /* ─────────────── SHARED NAVBAR (same as App.tsx) ─────────────── */
// function Navbar() {
//   return (
//     <motion.nav className="navbar"
//       initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .8, ease: [.22,1,.36,1] }}>
//       <Link to="/" style={{ textDecoration: "none" }}>
//         <div className="navbar-logo">
//           <motion.div className="navbar-logo-icon" whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>🎬</motion.div>
//           <span className="navbar-logo-text">CINEVERSE</span>
//         </div>
//       </Link>
//       <div className="navbar-links">
//         {["Movies","Cinemas","Events","Offers","My Tickets"].map(item => (
//           <Link key={item} to="#" className="navbar-link">{item}</Link>
//         ))}
//       </div>
//       <div className="navbar-actions">
//         <div className="navbar-search">
//           <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(232,228,220,0.35)" strokeWidth="2.2">
//             <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
//           </svg>
//           <span style={{ fontSize: 12, color: "rgba(232,228,220,.32)" }}>Search…</span>
//         </div>
//         <motion.button className="btn-signin" whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}>Sign In</motion.button>
//         <motion.button className="btn-join"   whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}>Join Now</motion.button>
//       </div>
//     </motion.nav>
//   );
// }