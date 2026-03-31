import StatCard   from "../../../common/StatCard/StatCard.tsx";
import StatusBadge from "../../../common/StatusBadge/StatusBadge.tsx";
import type { Movie, Theatre, Show, Booking } from "../../../../../types/movie.types.ts";

const fmtDT = (d: string) => new Date(d).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});

interface ClientOverviewTabProps {
  myTheatres:  Theatre[];
  myShows:     Show[];
  myBookings:  Booking[];
  movies:      Movie[];
  onTabChange: (tab: string) => void;
}

export default function ClientOverviewTab({
  myTheatres, myShows, myBookings, movies, onTabChange,
}: ClientOverviewTabProps) {
  const today = new Date().toDateString();

  const todayShows    = myShows.filter(s => new Date(s.showTime).toDateString() === today);
  const todayBookings = myBookings.filter(b => new Date(b.createdAt ?? "").toDateString() === today);
  const todayRevenue  = todayBookings
    .filter(b => b.status === "SUCCESSFUL")
    .reduce((a, b) => a + (b.seats?.length ?? 0) * ((b.showId as Show)?.price ?? 0), 0);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toDateString();
    const db = myBookings.filter(b => new Date(b.createdAt ?? "").toDateString() === ds);
    return {
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      count: db.length,
      rev:   db.filter(b => b.status === "SUCCESSFUL")
               .reduce((a, b) => a + (b.seats?.length ?? 0) * ((b.showId as Show)?.price ?? 0), 0),
    };
  });
  const maxC = Math.max(...last7.map(d => d.count), 1);
  const maxR = Math.max(...last7.map(d => d.rev), 1);

  const topShow = [...myShows].sort((a, b) => (b.bookedSeats?.length ?? 0) - (a.bookedSeats?.length ?? 0))[0] ?? null;

  return (
    <div className="anim-fadeup">
      <div className="dash-page-header">
        <p className="dash-eyebrow">Theatre Owner Panel</p>
        <h1 className="dash-page-title">OVERVIEW</h1>
        <p className="dash-page-sub">{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</p>
      </div>

      <div className="dash-stats-grid">
        <StatCard label="My Theatres"    value={myTheatres.length}                   icon="🏛"  color="#a855f7" onClick={() => onTabChange("theatres")} />
        <StatCard label="Shows Today"    value={todayShows.length}                   icon="🎥" color="#3b82f6" onClick={() => onTabChange("shows")} />
        <StatCard label="Bookings Today" value={todayBookings.length}                icon="🎟" color="#10b981" onClick={() => onTabChange("bookings")} />
        <StatCard label="Revenue Today"  value={`₹${todayRevenue.toLocaleString()}`} icon="💰" color="#f59e0b" onClick={() => onTabChange("analytics")} />
      </div>

      <div className="dash-chart-grid">
        <div className="dash-chart-card">
          <p className="dash-chart-title">Bookings Per Day — Last 7 Days</p>
          <div className="mini-bar-chart">
            {last7.map(d => (
              <div key={d.label} className="mini-bar-wrap">
                <span className="mini-bar-val">{d.count}</span>
                <div className="mini-bar" style={{ height: `${Math.max((d.count / maxC) * 72, 4)}px` }} />
                <span className="mini-bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-chart-card">
          <p className="dash-chart-title">Revenue Per Day — Last 7 Days</p>
          <div className="mini-bar-chart">
            {last7.map(d => (
              <div key={d.label} className="mini-bar-wrap">
                <span className="mini-bar-val">{d.rev > 0 ? `${(d.rev / 1000).toFixed(1)}k` : "0"}</span>
                <div className="mini-bar" style={{ height: `${Math.max((d.rev / maxR) * 72, 4)}px`, background: "linear-gradient(to top,rgba(168,85,247,.7),rgba(59,130,246,.3))" }} />
                <span className="mini-bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        {topShow && (() => {
          const mv     = typeof topShow.movieId   === "object" ? topShow.movieId   as Movie   : movies.find(m => m._id === topShow.movieId);
          const th     = typeof topShow.theatreId === "object" ? topShow.theatreId as Theatre : myTheatres.find(t => t._id === topShow.theatreId);
          const booked = topShow.bookedSeats?.length ?? 0;
          const pct    = Math.round((booked / Math.max(topShow.noOfSeats, 1)) * 100);
          return (
            <div className="dash-chart-card">
              <p className="dash-chart-title">🏆 Top Performing Show</p>
              <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>{mv?.name ?? "—"}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 10px" }}>{th?.name} · {fmtDT(topShow.showTime)}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "var(--brand-gradient)", borderRadius: 4 }} />
                </div>
                <span style={{ fontSize: 12, color: "var(--text-accent)", fontWeight: 700 }}>{booked}/{topShow.noOfSeats} ({pct}%)</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { label: "BOOKED",  value: booked,                                      color: "var(--green)" },
                  { label: "REVENUE", value: `₹${(booked * (topShow.price ?? 0)).toLocaleString()}`, color: "var(--text-accent)" },
                  { label: "FORMAT",  value: topShow.format,                               color: "#3b82f6" },
                ].map(item => (
                  <div key={item.label} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1 }}>{item.label}</p>
                    <p style={{ fontSize: 20, fontFamily: "'Bebas Neue',sans-serif", color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      <p className="dash-section-title">RECENT BOOKINGS</p>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead><tr><th>Movie</th><th>Show Time</th><th>Seats</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {myBookings.length === 0
              ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No bookings yet</td></tr>
              : myBookings.slice(0, 6).map(b => {
                  const show = b.showId as Show;
                  const mv   = typeof show?.movieId === "object" ? show.movieId as Movie : null;
                  return (
                    <tr key={b._id}>
                      <td><strong style={{ color: "var(--text-primary)" }}>{mv?.name ?? "—"}</strong></td>
                      <td style={{ fontSize: 12 }}>{show?.showTime ? fmtDT(show.showTime) : "—"}</td>
                      <td style={{ fontSize: 12 }}>{b.seats?.join(", ") ?? "—"}</td>
                      <td>₹{(b.seats?.length ?? 0) * (show?.price ?? 0)}</td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}