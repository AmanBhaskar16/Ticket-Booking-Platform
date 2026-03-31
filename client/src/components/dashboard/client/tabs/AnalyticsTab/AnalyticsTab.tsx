import StatCard from "../../../common/StatCard/StatCard.tsx";
import type { Booking, Show, Movie } from "../../../../../types/movie.types.ts";

interface ClientAnalyticsTabProps {
  myBookings: Booking[];
  myShows:    Show[];
  movies:     Movie[];
}

export default function ClientAnalyticsTab({ myBookings, myShows, movies }: ClientAnalyticsTabProps) {
  const today = new Date().toDateString();

  const totalRevenue  = myBookings.filter(b => b.status === "SUCCESSFUL").reduce((a, b) => a + (b.seats?.length ?? 0) * ((b.showId as Show)?.price ?? 0), 0);
  const todayBookings = myBookings.filter(b => new Date(b.createdAt ?? "").toDateString() === today).length;
  const totalSeats    = myShows.reduce((a, s) => a + (s.noOfSeats ?? 0), 0);
  const bookedSeats   = myShows.reduce((a, s) => a + (s.bookedSeats?.length ?? 0), 0);
  const occupancy     = totalSeats ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toDateString();
    const db = myBookings.filter(b => new Date(b.createdAt ?? "").toDateString() === ds);
    return {
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      count: db.length,
      rev:   db.filter(b => b.status === "SUCCESSFUL").reduce((a, b) => a + (b.seats?.length ?? 0) * ((b.showId as Show)?.price ?? 0), 0),
    };
  });
  const maxR = Math.max(...last7.map(d => d.rev), 1);

  const revenueByMovie = (() => {
    const map: Record<string, { name: string; rev: number }> = {};
    myBookings.filter(b => b.status === "SUCCESSFUL").forEach(b => {
      const show = b.showId as Show;
      const mv   = typeof show?.movieId === "object" ? show.movieId as Movie : null;
      if (mv) map[mv._id] = { name: mv.name, rev: (map[mv._id]?.rev ?? 0) + (b.seats?.length ?? 0) * (show?.price ?? 0) };
    });
    return Object.values(map).sort((a, b) => b.rev - a.rev).slice(0, 6);
  })();

  const occupancyData = myShows
    .filter(s => s.noOfSeats > 0)
    .map(s => {
      const mv  = typeof s.movieId === "object" ? s.movieId as Movie : movies.find(m => m._id === s.movieId);
      return { label: mv?.name ?? s._id.slice(-4), pct: Math.round(((s.bookedSeats?.length ?? 0) / s.noOfSeats) * 100) };
    })
    .sort((a, b) => b.pct - a.pct).slice(0, 6);

  return (
    <div className="anim-fadeup">
      <div className="dash-page-header">
        <h1 className="dash-page-title">MY ANALYTICS</h1>
        <p className="dash-page-sub">Revenue, occupancy & booking trends</p>
      </div>

      <div className="dash-stats-grid">
        <StatCard label="Total Revenue"    value={`₹${totalRevenue.toLocaleString()}`} icon="💰" color="#f59e0b" />
        <StatCard label="Today's Bookings" value={todayBookings}                        icon="📅" color="#3b82f6" />
        <StatCard label="Total Shows"      value={myShows.length}                       icon="🎥" color="#a855f7" />
        <StatCard label="Seat Occupancy"   value={`${occupancy}%`}                      icon="💺" color="#10b981" />
      </div>

      <div className="dash-chart-grid">
        <div className="dash-chart-card">
          <p className="dash-chart-title">Revenue by Movie</p>
          {revenueByMovie.length === 0
            ? <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No data yet</p>
            : revenueByMovie.map((m, i) => (
              <div key={m.name} className="hbar-row">
                <span className="hbar-label">{i + 1}. {m.name}</span>
                <div className="hbar-track"><div className="hbar-fill" style={{ width: `${(m.rev / revenueByMovie[0].rev) * 100}%` }} /></div>
                <span className="hbar-val">₹{(m.rev / 1000).toFixed(1)}k</span>
              </div>
            ))
          }
        </div>
        <div className="dash-chart-card">
          <p className="dash-chart-title">Revenue — Last 7 Days</p>
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
        <div className="dash-chart-card">
          <p className="dash-chart-title">Show Occupancy</p>
          {occupancyData.length === 0
            ? <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No shows yet</p>
            : occupancyData.map(item => (
              <div key={item.label} className="hbar-row">
                <span className="hbar-label" style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
                <div className="hbar-track">
                  <div className="hbar-fill" style={{ width: `${item.pct}%`, background: item.pct > 75 ? "linear-gradient(to right,#ef4444,#f97316)" : "linear-gradient(to right,#10b981,#06b6d4)" }} />
                </div>
                <span className="hbar-val">{item.pct}%</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}