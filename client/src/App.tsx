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
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));

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
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

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