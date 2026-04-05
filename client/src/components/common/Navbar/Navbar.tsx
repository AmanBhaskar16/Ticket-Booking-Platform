// import { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../../context/AuthContext.tsx";
// import "./Navbar.css";

// export default function AppNavbar() {
//   const { user, logout } = useAuth();
//   const navigate  = useNavigate();
//   const location  = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const isActive  = (path: string) => location.pathname.startsWith(path);
//   const isAdmin   = user?.userRole === "ADMIN" || user?.userRole === "CLIENT";
//   const roleCls   = user?.userRole === "ADMIN" ? "red" : user?.userRole === "CLIENT" ? "purple" : "blue";

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//     setMenuOpen(false);
//   };

//   return (
//     <nav className="app-nav">
//       <div className="app-nav-inner">

//         {/* Logo */}
//         <Link to="/" className="app-nav-logo">
//           <div className="app-nav-logo-icon">🎬</div>
//           <span className="app-nav-logo-text">CINEVERSE</span>
//         </Link>

//         {/* Desktop links */}
//         <div className="app-nav-links">
//           <Link to="/movies"    className={`app-nav-link ${isActive("/movies")    ? "active" : ""}`}>Movies</Link>
//           <Link to="/theatres"  className={`app-nav-link ${isActive("/theatres")  ? "active" : ""}`}>Theatres</Link>
//           {user && (
//             <Link to="/my-bookings" className={`app-nav-link ${isActive("/my-bookings") ? "active" : ""}`}>
//               My Bookings
//             </Link>
//           )}
//           {isAdmin && (
//             <Link to="/dashboard" className={`app-nav-link app-nav-link-admin ${isActive("/dashboard") ? "active" : ""}`}>
//               Dashboard
//             </Link>
//           )}
//         </div>

//         {/* Right side */}
//         <div className="app-nav-right">
//           {user ? (
//             <div className="app-nav-user">
//               {/* Avatar — image if available, else initial */}
//               <div
//                 className="app-nav-avatar"
//                 onClick={() => setMenuOpen(p => !p)}
//                 title={user.name}
//               >
//                 {user.avatar
//                   ? <img
//                       src={user.avatar}
//                       alt={user.name}
//                       className="app-nav-avatar-img"
//                       onError={e => {
//                         (e.target as HTMLImageElement).style.display = "none";
//                         ((e.target as HTMLImageElement).parentElement as HTMLElement).innerText =
//                           user.name?.[0]?.toUpperCase() ?? "?";
//                       }}
//                     />
//                   : user.name?.[0]?.toUpperCase() ?? "?"
//                 }
//               </div>

//               {/* Dropdown */}
//               {menuOpen && (
//                 <>
//                   <div className="app-nav-overlay" onClick={() => setMenuOpen(false)} />
//                   <div className="app-nav-dropdown">
//                     {/* User info */}
//                     <div className="app-nav-dropdown-header">
//                       <div className="app-nav-dropdown-avatar">
//                         {user.avatar
//                           ? <img src={user.avatar} alt={user.name}
//                               onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
//                           : user.name?.[0]?.toUpperCase() ?? "?"
//                         }
//                       </div>
//                       <div>
//                         <p className="app-nav-dropdown-name">{user.name}</p>
//                         <p className="app-nav-dropdown-email">{user.email}</p>
//                         <span className={`badge badge-${roleCls}`}>{user.userRole}</span>
//                       </div>
//                     </div>

//                     <div className="app-nav-dropdown-divider" />

//                     <Link to="/profile"     className="app-nav-dropdown-item" onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
//                     <Link to="/my-bookings" className="app-nav-dropdown-item" onClick={() => setMenuOpen(false)}>🎟 My Bookings</Link>
//                     {isAdmin && (
//                       <Link to="/dashboard" className="app-nav-dropdown-item" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
//                     )}

//                     <div className="app-nav-dropdown-divider" />

//                     <button className="app-nav-dropdown-item app-nav-dropdown-logout" onClick={handleLogout}>
//                       ← Logout
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : (
//             <div className="app-nav-auth-btns">
//               <Link to="/login"  className="btn btn-ghost btn-sm">Sign In</Link>
//               <Link to="/signup" className="btn btn-primary btn-sm">Join Now</Link>
//             </div>
//           )}

//           {/* Mobile hamburger */}
//           <button className="app-nav-hamburger" onClick={() => setMenuOpen(p => !p)}>
//             <span /><span /><span />
//           </button>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {menuOpen && (
//         <div className="app-nav-mobile-menu">
//           <Link to="/movies"    className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Movies</Link>
//           <Link to="/theatres"  className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Theatres</Link>
//           {user && (
//             <>
//               <Link to="/my-bookings" className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>My Bookings</Link>
//               <Link to="/profile"     className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>My Profile</Link>
//             </>
//           )}
//           {isAdmin && (
//             <Link to="/dashboard" className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
//           )}
//           {!user && (
//             <>
//               <Link to="/login"  className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
//               <Link to="/signup" className="app-nav-mobile-link" onClick={() => setMenuOpen(false)}>Join Now</Link>
//             </>
//           )}
//           {user && (
//             <button className="app-nav-mobile-link app-nav-mobile-logout" onClick={handleLogout}>
//               Logout
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// }


import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.tsx";
import "./Navbar.css";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  const isActive  = (path: string) => location.pathname.startsWith(path);
  const isAdmin   = user?.userRole === "ADMIN" || user?.userRole === "CLIENT";
  const roleCls   = user?.userRole === "ADMIN" ? "red" : user?.userRole === "CLIENT" ? "purple" : "blue";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
    setMobileOpen(false);
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
          <Link to="/movies"    className={`app-nav-link ${isActive("/movies")    ? "active" : ""}`}>Movies</Link>
          <Link to="/theatres"  className={`app-nav-link ${isActive("/theatres")  ? "active" : ""}`}>Theatres</Link>
          {user && (
            <Link to="/my-bookings" className={`app-nav-link ${isActive("/my-bookings") ? "active" : ""}`}>
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/dashboard" className={`app-nav-link app-nav-link-admin ${isActive("/dashboard") ? "active" : ""}`}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="app-nav-right">
          {user ? (
            <div className="app-nav-user">
              {/* Avatar — image if available, else initial */}
              <div
                className="app-nav-avatar"
                onClick={() => setDropdownOpen(p => !p)}
                title={user.name}
              >
                {user.avatar
                  ? <img
                      src={user.avatar}
                      alt={user.name}
                      className="app-nav-avatar-img"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = "none";
                        ((e.target as HTMLImageElement).parentElement as HTMLElement).innerText =
                          user.name?.[0]?.toUpperCase() ?? "?";
                      }}
                    />
                  : user.name?.[0]?.toUpperCase() ?? "?"
                }
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <>
                  <div className="app-nav-overlay" onClick={() => setDropdownOpen(false)} />
                  <div className="app-nav-dropdown">
                    {/* User info */}
                    <div className="app-nav-dropdown-header">
                      <div className="app-nav-dropdown-avatar">
                        {user.avatar
                          ? <img src={user.avatar} alt={user.name}
                              onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
                          : user.name?.[0]?.toUpperCase() ?? "?"
                        }
                      </div>
                      <div>
                        <p className="app-nav-dropdown-name">{user.name}</p>
                        <p className="app-nav-dropdown-email">{user.email}</p>
                        <span className={`badge badge-${roleCls}`}>{user.userRole}</span>
                      </div>
                    </div>

                    <div className="app-nav-dropdown-divider" />

                    <Link to="/profile"     className="app-nav-dropdown-item" onClick={() => setDropdownOpen(false)}>👤 My Profile</Link>
                    <Link to="/my-bookings" className="app-nav-dropdown-item" onClick={() => setDropdownOpen(false)}>🎟 My Bookings</Link>
                    {isAdmin && (
                      <Link to="/dashboard" className="app-nav-dropdown-item" onClick={() => setDropdownOpen(false)}>📊 Dashboard</Link>
                    )}

                    <div className="app-nav-dropdown-divider" />

                    <button className="app-nav-dropdown-item app-nav-dropdown-logout" onClick={handleLogout}>
                      ← Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="app-nav-auth-btns">
              <Link to="/login"  className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Join Now</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="app-nav-hamburger" onClick={() => setMobileOpen(p => !p)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="app-nav-mobile-menu">
          <Link to="/movies"    className="app-nav-mobile-link" onClick={() => setMobileOpen(false)}>Movies</Link>
          <Link to="/theatres"  className="app-nav-mobile-link" onClick={() => setMobileOpen(false)}>Theatres</Link>
          {user && (
            <>
              <Link to="/my-bookings" className="app-nav-mobile-link" onClick={() => setMobileOpen(false)}>My Bookings</Link>
              <Link to="/profile"     className="app-nav-mobile-link" onClick={() => setMobileOpen(false)}>My Profile</Link>
            </>
          )}
          {isAdmin && (
            <Link to="/dashboard" className="app-nav-mobile-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          )}
          {!user && (
            <>
              <Link to="/login"  className="app-nav-mobile-link" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/signup" className="app-nav-mobile-link" onClick={() => setMobileOpen(false)}>Join Now</Link>
            </>
          )}
          {user && (
            <button className="app-nav-mobile-link app-nav-mobile-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}