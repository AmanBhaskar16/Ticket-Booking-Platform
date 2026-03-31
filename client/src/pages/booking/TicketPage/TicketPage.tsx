import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AppNavbar   from "../../../components/common/Navbar/Navbar.tsx";
import { PageSpinner } from "../../../components/common/SharedUI/SharedUI.tsx";
import TicketCard  from "../../../components/booking/TicketCard/TicketCard.tsx";
import { bookingsApi } from "../../../api/index.api.ts";
import type { Movie, Theatre, Show, Booking } from "../../../types/movie.types.ts";
import "./TicketPage.css";


export default function TicketPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate      = useNavigate();
  const location      = useLocation();

  const [booking,  setBooking]  = useState<Booking | null>(location.state?.booking ?? null);
  const [loading,  setLoading]  = useState(!location.state?.booking);

  useEffect(() => {
    if (booking || !bookingId) return;
    bookingsApi.getById(bookingId)
      .then(setBooking)
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [bookingId,booking]);

  if (loading) return <div className="page-wrapper"><AppNavbar /><PageSpinner /></div>;

  if (!booking) return (
    <div className="page-wrapper">
      <AppNavbar />
      <div className="empty-state" style={{ marginTop: 80 }}>
        <div className="empty-state-icon">🎟</div>
        <p className="empty-state-title">Ticket Not Found</p>
        <button className="btn btn-ghost" onClick={() => navigate("/my-bookings")}>← My Bookings</button>
      </div>
    </div>
  );

  const show    = booking.showId as Show;
  const movie   = typeof show?.movieId   === "object" ? show.movieId   as Movie   : null;
  const theatre = typeof show?.theatreId === "object" ? show.theatreId as Theatre : null;

  const ticketData = {
    ticketCode:  booking.ticketCode ?? "Ticket",
    movieName:   movie?.name        ?? "Movie",
    poster:      movie?.posterUrl,
    theatre:     theatre?.name      ?? "Theatre",
    city:        theatre?.city      ?? "",
    address:     theatre?.address   ?? "",
    showTime:    show?.showTime     ?? "",
    format:      show?.format       ?? "",
    language:    show?.language     ?? "",
    screen:      show?.screen       ?? "",
    seats:       booking.seats      ?? [],
    totalAmount: booking.totalAmount ?? 0,
    bookingId:   booking._id,
  };

  return (
    <div className="page-wrapper">
      <div className="grain" />
      <AppNavbar />

      <div className="tp-container container">
        <TicketCard ticket={ticketData} />

        <div className="tp-actions">
          <button className="btn btn-primary" onClick={() => navigate("/my-bookings")}>
            🎟 My Bookings
          </button>
          <button className="btn btn-ghost" onClick={() => window.print()}>
            🖨 Print Ticket
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/movies")}>
            🎬 Book Another
          </button>
        </div>
      </div>
    </div>
  );
}