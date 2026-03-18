import "./BookingCard.css";
import type { Movie, Theatre, Show } from "../../../types/movie.types.ts";

export type BookingStatus = "IN_PROCESS" | "SUCCESSFUL" | "CANCELLED" | "EXPIRED";

interface BookingCardProps {
  booking: {
    _id:         string;
    seats:       string[];
    totalAmount: number;
    status:      BookingStatus;
    ticketCode?: string;
    createdAt:   string;
    showId:      Show & {
      movieId?:   Movie;
      theatreId?: Theatre;
    };
  };
  onView:   (id: string) => void;
  onCancel: (id: string) => void;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; cls: string }> = {
  SUCCESSFUL: { label: "Confirmed",  cls: "green"  },
  IN_PROCESS: { label: "Processing", cls: "yellow" },
  CANCELLED:  { label: "Cancelled",  cls: "red"    },
  EXPIRED:    { label: "Expired",    cls: "red"    },
};

export default function BookingCard({ booking, onView, onCancel }: BookingCardProps) {
  const show    = booking.showId;
  const movie   = show?.movieId;
  const theatre = show?.theatreId;
  const status  = STATUS_CONFIG[booking.status] ?? { label: booking.status, cls: "yellow" };

  const showTime = show?.showTime
    ? new Date(show.showTime).toLocaleString("en-IN", {
        weekday: "short", day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  const canCancel = booking.status === "SUCCESSFUL" || booking.status === "IN_PROCESS";

  return (
    <div className={`bkc bkc--${status.cls}`}>
      {/* Left — poster */}
      <div className="bkc-poster-wrap">
        {movie?.posterUrl
          ? <img src={movie.posterUrl} alt={movie.name} className="bkc-poster"
              onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
          : <div className="bkc-poster-fallback">🎬</div>
        }
      </div>

      {/* Center — info */}
      <div className="bkc-info">
        <div className="bkc-top">
          <h3 className="bkc-movie">{movie?.name ?? "—"}</h3>
          <span className={`badge badge-${status.cls}`}>{status.label}</span>
        </div>

        <p className="bkc-theatre">
          {theatre?.name ?? "—"}
          {theatre?.city ? ` · ${theatre.city}` : ""}
        </p>

        <div className="bkc-meta">
          <span>🕐 {showTime}</span>
          {show?.format   && <span className="bkc-sep" />}
          {show?.format   && <span>{show.format}</span>}
          {show?.language && <span className="bkc-sep" />}
          {show?.language && <span>{show.language}</span>}
        </div>

        <div className="bkc-seats">
          {booking.seats.map(s => (
            <span key={s} className="bkc-seat-tag">{s}</span>
          ))}
        </div>

        {booking.ticketCode && (
          <p className="bkc-ticket-code">🎟 {booking.ticketCode}</p>
        )}
      </div>

      {/* Right — amount + actions */}
      <div className="bkc-right">
        <p className="bkc-amount">₹{booking.totalAmount}</p>
        <p className="bkc-date">
          {new Date(booking.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </p>

        <div className="bkc-actions">
          {booking.status === "SUCCESSFUL" && (
            <button className="btn btn-primary btn-sm"
              onClick={() => onView(booking._id)}>
              View Ticket
            </button>
          )}
          {canCancel && (
            <button className="btn btn-ghost btn-sm bkc-cancel-btn"
              onClick={() => onCancel(booking._id)}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}