import "./BookingSummary.css";

interface ShowInfo {
  movieName:  string;
  poster?:    string;
  theatre:    string;
  showTime:   string;
  format:     string;
  language:   string;
  screen:     string;
  price:      number;
}

interface BookingSummaryProps {
  show:          ShowInfo;
  selectedSeats: string[];
  onConfirm:     () => void;
  confirming:    boolean;
  disabled:      boolean;
  ctaLabel?:     string;
}

export default function BookingSummary({
  show, selectedSeats, onConfirm, confirming, disabled, ctaLabel = "Proceed to Pay",
}: BookingSummaryProps) {
  const total = selectedSeats.length * show.price;

  const fmt = (d: string) => new Date(d).toLocaleString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="bs-card">
      <p className="bs-heading">BOOKING SUMMARY</p>

      {/* Movie */}
      <div className="bs-movie">
        {show.poster && (
          <img src={show.poster} alt={show.movieName} className="bs-poster"
            onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
        )}
        <div className="bs-movie-info">
          <p className="bs-movie-name">{show.movieName}</p>
          <p className="bs-theatre">{show.theatre}</p>
          <p className="bs-time">{fmt(show.showTime)}</p>
          <div className="bs-tags">
            <span className="bs-tag">{show.format}</span>
            <span className="bs-tag">{show.language}</span>
            <span className="bs-tag">{show.screen}</span>
          </div>
        </div>
      </div>

      <div className="bs-divider" />

      {/* Seats */}
      <div className="bs-row">
        <span className="bs-label">Selected Seats</span>
      </div>
      {selectedSeats.length === 0 ? (
        <p className="bs-no-seats">No seats selected yet</p>
      ) : (
        <div className="bs-seat-tags">
          {selectedSeats.map(s => (
            <span key={s} className="bs-seat-tag">{s}</span>
          ))}
        </div>
      )}

      <div className="bs-divider" />

      {/* Price breakdown */}
      <div className="bs-row">
        <span className="bs-label">{selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""} × ₹{show.price}</span>
        <span className="bs-amount">₹{total}</span>
      </div>
      <div className="bs-row bs-total">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        className="bs-cta"
        onClick={onConfirm}
        disabled={disabled || confirming || selectedSeats.length === 0}
      >
        {confirming
          ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
          : `${ctaLabel} · ₹${total}`
        }
      </button>

      <p className="bs-note">Cancellation available up to 30 min before show</p>
    </div>
  );
}