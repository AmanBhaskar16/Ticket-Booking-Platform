// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import "./Navbar.css";

// const NAV_LINKS = ["Movies", "Cinemas", "Events", "Offers", "My Tickets"];

// export default function Navbar() {
//   return (
//     <motion.nav
//       className="navbar"
//       initial={{ y: -60, opacity: 0 }}
//       animate={{ y: 0,   opacity: 1 }}
//       transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//     >
//       {/* Logo */}
//       <Link to="/" className="navbar-logo">
//         <motion.div
//           className="navbar-logo-icon"
//           whileHover={{ rotate: 15, scale: 1.1 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           🎬
//         </motion.div>
//         <span className="navbar-logo-text">CINEVERSE</span>
//       </Link>

//       {/* Links */}
//       <div className="navbar-links">
//         {NAV_LINKS.map((item, i) => (
//           <motion.div
//             key={item}
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.07 * i + 0.3 }}
//           >
//             <Link to={`/${item.toLowerCase().replace(" ", "-")}`} className="navbar-link">
//               {item}
//             </Link>
//           </motion.div>
//         ))}
//       </div>

//       {/* Actions */}
//       <div className="navbar-actions">
//         <div className="navbar-search">
//           <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//             stroke="rgba(232,228,220,0.35)" strokeWidth="2.2">
//             <circle cx="11" cy="11" r="8" />
//             <path d="m21 21-4.35-4.35" />
//           </svg>
//           <span>Search…</span>
//         </div>
//         <motion.button className="btn-signin" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
//           Sign In
//         </motion.button>
//         <motion.button className="btn-join" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
//           Join Now
//         </motion.button>
//       </div>
//     </motion.nav>
//   );
// }

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.tsx";
import "./Navbar.css";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        {/* Logo */}
        <Link to="/" className="app-nav-logo">
          <div className="app-nav-logo-icon">🎬</div>
          <span className="app-nav-logo-text">CINEVERSE</span>
        </Link>

        {/* Desktop links */}
        <div className="app-nav-links">
          <Link to="/movies" className={`app-nav-link ${isActive("/movies") ? "active" : ""}`}>Movies</Link>
          <Link to="/theatres" className={`app-nav-link ${isActive("/theatres") ? "active" : ""}`}>Theatres</Link>
          {user && (
            <Link to="/my-bookings" className={`app-nav-link ${isActive("/my-bookings") ? "active" : ""}`}>My Bookings</Link>
          )}
          {(user?.userRole === "ADMIN" || user?.userRole === "CLIENT") && (
            <Link to="/dashboard" className={`app-nav-link app-nav-link-admin ${isActive("/dashboard") ? "active" : ""}`}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="app-nav-right">
          {user ? (
            <div className="app-nav-user">
              <div className="app-nav-avatar" onClick={() => setMenuOpen(p => !p)}>
                {user.name[0].toUpperCase()}
              </div>
              {menuOpen && (
                <div className="app-nav-dropdown">
                  <div className="app-nav-dropdown-header">
                    <p className="app-nav-dropdown-name">{user.name}</p>
                    <p className="app-nav-dropdown-email">{user.email}</p>
                    <span className={`badge badge-${user.userRole === "ADMIN" ? "red" : user.userRole === "CLIENT" ? "purple" : "blue"}`}>
                      {user.userRole}
                    </span>
                  </div>
                  <div className="app-nav-dropdown-divider" />
                  <Link to="/my-bookings" className="app-nav-dropdown-item" onClick={() => setMenuOpen(false)}>🎟 My Bookings</Link>
                  <Link to="/reset-password" className="app-nav-dropdown-item" onClick={() => setMenuOpen(false)}>🔑 Reset Password</Link>
                  <div className="app-nav-dropdown-divider" />
                  <button className="app-nav-dropdown-item app-nav-dropdown-logout" onClick={handleLogout}>
                    ← Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="app-nav-auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Join Now</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="app-nav-hamburger" onClick={() => setMenuOpen(p => !p)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="app-nav-mobile-menu">
          <Link to="/movies"    className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link to="/theatres"  className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Theatres</Link>
          {user && <Link to="/my-bookings" className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
          {(user?.userRole === "ADMIN" || user?.userRole === "CLIENT") && (
            <Link to="/dashboard" className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          {!user && <>
            <Link to="/login"  className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/signup" className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Join Now</Link>
          </>}
          {user && (
            <button className="app-nav-mobile-link app-nav-mobile-logout" onClick={handleLogout}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}