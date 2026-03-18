import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar      from "../../../components/common/Navbar/Navbar.tsx";
import { PageSpinner, showToast } from "../../../components/common/SharedUI/SharedUI.tsx";
import SeatGrid       from "../../../components/booking/SeatGrid/SeatGrid.tsx";
import BookingSummary from "../../../components/booking/BookingSummary/BookingSummary.tsx";
import { showsApi, bookingsApi } from "../../../api/index.api.ts";
import { useAuth }    from "../../../context/AuthContext.tsx";
import { useShowSocket } from "../../../hooks/useShowSocket.ts";
import type { Show, Movie, Theatre } from "../../../types/movie.types.ts";
import "./SeatSelectionPage.css";

const ROWS = ["A","B","C","D","E","F","G","H"];
const COLS = [1,2,3,4,5,6,7,8,9,10];

export default function SeatSelectionPage() {
  const { showId } = useParams<{ showId: string }>();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [show,      setShow]      = useState<Show | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<string[]>([]);
  const [initiating, setInitiating] = useState(false);

  // Real-time seat state via socket
  const { bookedSeats, tempBlocked, selectSeats, deselectSeats, isSeatTaken } = useShowSocket(
    showId,
    user?.id ?? user?._id,
    show?.bookedSeats ?? []
  );

  useEffect(() => {
    if (!showId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const s = await showsApi.getById(showId);
        if (!cancelled) setShow(s);
      } catch {
        if (!cancelled) showToast("Failed to load show", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [showId]);

  const handleSeatClick = useCallback((seat: string) => {
    if (isSeatTaken(seat)) return;

    setSelected(prev => {
      if (prev.includes(seat)) {
        // Deselect — notify others
        deselectSeats([seat]);
        return prev.filter(s => s !== seat);
      } else {
        // Select — notify others
        selectSeats([seat]);
        return [...prev, seat];
      }
    });
  }, [isSeatTaken, selectSeats, deselectSeats]);

  const handleProceed = async () => {
    if (selected.length === 0) { showToast("Please select at least one seat", "error"); return; }
    if (!showId) return;

    setInitiating(true);
    try {
      const result = await bookingsApi.initiate(showId, selected);
      // Navigate to payment with booking data
      navigate("/payment", { state: { booking: result } });
    } catch (e: any) {
      showToast(e.message ?? "Failed to initiate booking", "error");
      // Re-fetch show to get updated seat state
      const updated = await showsApi.getById(showId!);
      setShow(updated);
      setSelected([]);
    } finally {
      setInitiating(false);
    }
  };

  if (loading) return <div className="page-wrapper"><AppNavbar /><PageSpinner /></div>;

  if (!show) return (
    <div className="page-wrapper">
      <AppNavbar />
      <div className="empty-state" style={{ marginTop: 80 }}>
        <div className="empty-state-icon">🎬</div>
        <p className="empty-state-title">Show Not Found</p>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    </div>
  );

  const movie   = typeof show.movieId   === "object" ? show.movieId   as Movie   : null;
  const theatre = typeof show.theatreId === "object" ? show.theatreId as Theatre : null;

  const showInfo = {
    movieName: movie?.name    ?? "Movie",
    poster:    movie?.posterUrl,
    theatre:   theatre?.name  ?? "Theatre",
    showTime:  show.showTime,
    format:    show.format,
    language:  show.language,
    screen:    show.screen,
    price:     show.price,
  };

  return (
    <div className="page-wrapper">
      <div className="grain" />
      <AppNavbar />

      <div className="ssp-container container">
        {/* Header */}
        <div className="ssp-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <h1 className="ssp-title">{movie?.name ?? "Select Seats"}</h1>
            <p className="ssp-sub">
              {theatre?.name} · {new Date(show.showTime).toLocaleString("en-IN", {
                weekday: "short", day: "numeric", month: "short",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="ssp-layout">
          {/* Seat Grid */}
          <div className="ssp-grid-wrap">
            <SeatGrid
              rows={ROWS}
              cols={COLS}
              selectedSeats={selected}
              bookedSeats={bookedSeats}
              tempBlocked={tempBlocked}
              onSeatClick={handleSeatClick}
            />
          </div>

          {/* Booking Summary */}
          <div className="ssp-summary-wrap">
            <BookingSummary
              show={showInfo}
              selectedSeats={selected}
              onConfirm={handleProceed}
              confirming={initiating}
              disabled={initiating}
              ctaLabel="Proceed to Pay"
            />
          </div>
        </div>
      </div>
    </div>
  );
}