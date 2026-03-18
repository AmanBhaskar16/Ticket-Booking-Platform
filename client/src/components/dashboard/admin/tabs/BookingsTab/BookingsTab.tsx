import { useState, useMemo } from "react";
import UserAvatar  from "../../../common/UserAvatar/UserAvatar.tsx";
import StatusBadge from "../../../common/StatusBadge/StatusBadge.tsx";
import type { Booking, Show, Movie, User } from "../../../../../types/movie.types.ts";

const fmtDT = (d: string) => new Date(d).toLocaleString("en-IN", {
  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
});

interface BookingsTabProps {
  bookings: Booking[];
}

export default function BookingsTab({ bookings }: BookingsTabProps) {
  const [filter, setFilter] = useState({ movie: "", theatre: "", date: "" });

  const revenue = bookings
    .filter(b => b.status === "SUCCESSFUL")
    .reduce((a, b) => a + (b.seat?.length ?? 0) * ((b.showId as Show)?.price ?? 0), 0);

  const filtered = useMemo(() => bookings.filter(b => {
    const show = b.showId as Show;
    const mv   = typeof show?.movieId   === "object" ? (show.movieId   as Movie).name  : "";
    const th   = typeof show?.theatreId === "object" ? (show.theatreId as any).name    : "";
    if (filter.movie   && !mv.toLowerCase().includes(filter.movie.toLowerCase()))   return false;
    if (filter.theatre && !th.toLowerCase().includes(filter.theatre.toLowerCase())) return false;
    if (filter.date) {
      const bd = new Date(b.createdAt ?? "").toDateString();
      const fd = new Date(filter.date).toDateString();
      if (bd !== fd) return false;
    }
    return true;
  }), [bookings, filter]);

  return (
    <div className="anim-fadeup">
      <div className="dash-tab-header">
        <div>
          <h1 className="dash-page-title">ALL BOOKINGS</h1>
          <p className="dash-page-sub">{bookings.length} total · ₹{revenue.toLocaleString()} revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="dash-filters">
        <input className="dash-filter-input" placeholder="🎬 Movie…"
          value={filter.movie} onChange={e => setFilter(p => ({ ...p, movie: e.target.value }))} />
        <input className="dash-filter-input" placeholder="🏛 Theatre…"
          value={filter.theatre} onChange={e => setFilter(p => ({ ...p, theatre: e.target.value }))} />
        <input className="dash-filter-input" type="date" style={{ colorScheme: "dark" }}
          value={filter.date} onChange={e => setFilter(p => ({ ...p, date: e.target.value }))} />
        {(filter.movie || filter.theatre || filter.date) && (
          <button className="btn btn-ghost btn-sm"
            onClick={() => setFilter({ movie: "", theatre: "", date: "" })}>
            Clear ✕
          </button>
        )}
      </div>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr><th>User</th><th>Movie</th><th>Show Time</th><th>Seats</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No bookings match</td></tr>
            )}
            {filtered.map(b => {
              const show = b.showId as Show;
              const mv   = typeof show?.movieId === "object" ? show.movieId as Movie : null;
              const usr  = typeof b.user        === "object" ? b.user        as User : null;
              return (
                <tr key={b._id}>
                  <td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <UserAvatar name={usr?.name ?? "?"} size="sm" />
                      {usr?.name ?? "—"}
                    </div>
                  </td>
                  <td><strong style={{ color: "var(--text-primary)" }}>{mv?.name ?? "—"}</strong></td>
                  <td style={{ fontSize: 12 }}>{show?.showTime ? fmtDT(show.showTime) : "—"}</td>
                  <td style={{ fontSize: 12 }}>{b.seat?.join(", ") ?? "—"}</td>
                  <td>₹{(b.seat?.length ?? 0) * (show?.price ?? 0)}</td>
                  <td><StatusBadge status={b.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}