import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import "./TicketCard.css";

interface TicketData {
  ticketCode:   string;
  movieName:    string;
  poster?:      string;
  theatre:      string;
  city:         string;
  address:      string;
  showTime:     string;
  format:       string;
  language:     string;
  screen:       string;
  seats:        string[];
  totalAmount:  number;
  bookingId:    string;
}

interface TicketCardProps {
  ticket: TicketData;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!qrRef.current) return;
    QRCode.toCanvas(qrRef.current, ticket.ticketCode, {
      width:           160,
      margin:          2,
      color: { dark: "#ffffff", light: "#00000000" },
    });
  }, [ticket.ticketCode]);

  const fmt = (d: string) => new Date(d).toLocaleString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="tc-wrap">
      {/* Success banner */}
      <div className="tc-success-banner">
        <span className="tc-success-icon">✓</span>
        <div>
          <p className="tc-success-title">Booking Confirmed!</p>
          <p className="tc-success-sub">Your tickets are ready</p>
        </div>
      </div>

      {/* Ticket */}
      <div className="tc-ticket">
        {/* Left — movie info */}
        <div className="tc-left">
          {ticket.poster && (
            <img src={ticket.poster} alt={ticket.movieName} className="tc-poster"
              onError={e => ((e.target as HTMLImageElement).style.display = "none")} />
          )}
          <div className="tc-movie-info">
            <h2 className="tc-movie-name">{ticket.movieName}</h2>
            <div className="tc-tags">
              <span className="tc-tag">{ticket.format}</span>
              <span className="tc-tag">{ticket.language}</span>
            </div>
            <p className="tc-theatre">{ticket.theatre}</p>
            <p className="tc-address">📍 {ticket.address}, {ticket.city}</p>
            <p className="tc-time">🕐 {fmt(ticket.showTime)}</p>
            <p className="tc-screen">📽 {ticket.screen}</p>
          </div>
        </div>

        {/* Perforated divider */}
        <div className="tc-divider">
          <div className="tc-notch tc-notch--top" />
          <div className="tc-dotted" />
          <div className="tc-notch tc-notch--bottom" />
        </div>

        {/* Right — seats + QR */}
        <div className="tc-right">
          <div className="tc-seats-section">
            <p className="tc-label">Seats</p>
            <div className="tc-seat-tags">
              {ticket.seats.map(s => (
                <span key={s} className="tc-seat-tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="tc-amount-row">
            <span className="tc-label">Total Paid</span>
            <span className="tc-amount">₹{ticket.totalAmount}</span>
          </div>

          <div className="tc-qr-wrap">
            <canvas ref={qrRef} className="tc-qr" />
            <p className="tc-ticket-code">{ticket.ticketCode}</p>
          </div>
        </div>
      </div>

      {/* Booking ID */}
      <p className="tc-booking-id">Booking ID: {ticket.bookingId}</p>
    </div>
  );
}