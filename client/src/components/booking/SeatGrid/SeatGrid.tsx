import "./SeatGrid.css";

export type SeatStatus = "available" | "selected" | "booked" | "temp-blocked";

interface SeatGridProps {
  rows:         string[];
  cols:         number[];
  selectedSeats:  string[];
  bookedSeats:    string[];
  tempBlocked:    string[];
  onSeatClick:  (seat: string) => void;
}

export default function SeatGrid({
  rows, cols, selectedSeats, bookedSeats, tempBlocked, onSeatClick,
}: SeatGridProps) {

  const getStatus = (seat: string): SeatStatus => {
    if (bookedSeats.includes(seat))   return "booked";
    if (tempBlocked.includes(seat))   return "temp-blocked";
    if (selectedSeats.includes(seat)) return "selected";
    return "available";
  };

  return (
    <div className="sg-wrap">
      {/* Screen */}
      <div className="sg-screen-wrap">
        <div className="sg-screen" />
        <p className="sg-screen-label">SCREEN</p>
      </div>

      {/* Seat grid */}
      <div className="sg-grid">
        {rows.map(row => (
          <div key={row} className="sg-row">
            <span className="sg-row-label">{row}</span>
            <div className="sg-seats">
              {cols.map(col => {
                const seat   = `${row}${col}`;
                const status = getStatus(seat);
                const disabled = status === "booked" || status === "temp-blocked";
                return (
                  <button
                    key={seat}
                    className={`sg-seat sg-seat--${status}`}
                    onClick={() => !disabled && onSeatClick(seat)}
                    disabled={disabled}
                    title={
                      status === "booked"       ? `${seat} — Booked` :
                      status === "temp-blocked" ? `${seat} — Someone is selecting this` :
                      status === "selected"     ? `${seat} — Selected (click to deselect)` :
                      seat
                    }
                  />
                );
              })}
            </div>
            <span className="sg-row-label">{row}</span>
          </div>
        ))}

        {/* Column numbers */}
        <div className="sg-col-nums">
          <span className="sg-row-label" />
          {cols.map(c => (
            <span key={c} className="sg-col-num">{c}</span>
          ))}
          <span className="sg-row-label" />
        </div>
      </div>

      {/* Legend */}
      <div className="sg-legend">
        {(["available","selected","temp-blocked","booked"] as SeatStatus[]).map(s => (
          <div key={s} className="sg-legend-item">
            <div className={`sg-seat sg-seat--${s} sg-legend-dot`} />
            <span className="sg-legend-label">
              {s === "temp-blocked" ? "Being selected" : s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}