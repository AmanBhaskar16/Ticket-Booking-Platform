import StatCard from "../../../common/StatCard/StatCard.tsx";
import type { Booking, Show, Movie, Theatre } from "../../../../../types/movie.types.ts";

interface AnalyticsTabProps {
  bookings: Booking[];
  shows:    Show[];
  theatres: Theatre[];
}

export default function AnalyticsTab({ bookings, shows, theatres }: AnalyticsTabProps) {
  const today = new Date().toDateString();

  const revenue = bookings
    .filter(b => b.status === "SUCCESSFUL")
    .reduce((a, b) => a + (b.seats?.length ?? 0) * ((b.showId as Show)?.price ?? 0), 0);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toDateString();
    const db = bookings.filter(b => new Date(b.createdAt ?? "").toDateString() === ds);
    return {
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      count: db.length,
      rev:   db.filter(b => b.status === "SUCCESSFUL")
               .reduce((a, b) => a + (b.seats?.length ?? 0) * ((b.showId as Show)?.price ?? 0), 0),
    };
  });
  const maxC = Math.max(...last7.map(d => d.count), 1);

  const topMovies = (() => {
    const map: Record<string, { name: string; count: number }> = {};
    bookings.forEach(b => {
      const show = b.showId as Show;
      const mv   = typeof show?.movieId === "object" ? show.movieId as Movie : null;
      if (mv) map[mv._id] = { name: mv.name, count: (map[mv._id]?.count ?? 0) + (b.seats?.length ?? 0) };
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  })();

  const topTheatres = (() => {
    const map: Record<string, { name: string; rev: number }> = {};
    bookings.forEach(b => {
      const show = b.showId as Show;
      const th   = typeof show?.theatreId === "object" ? (show.theatreId as Theatre) : null;
      if (th) map[th._id] = { name: th.name, rev: (map[th._id]?.rev ?? 0) + (b.seats?.length ?? 0) * (show?.price ?? 0) };
    });
    return Object.values(map).sort((a, b) => b.rev - a.rev).slice(0, 5);
  })();

  const totalSeats   = shows.reduce((a, s) => a + (s.noOfSeats ?? 0), 0);
  const bookedSeats  = shows.reduce((a, s) => a + (s.bookedSeats?.length ?? 0), 0);
  const occupancy    = totalSeats ? Math.round((bookedSeats / totalSeats) * 100) : 0;
  const avgPrice     = shows.length ? Math.round(shows.reduce((a, s) => a + s.price, 0) / shows.length) : 0;
  const todayBookings = bookings.filter(b => new Date(b.createdAt ?? "").toDateString() === today).length;

  const cityMap: Record<string, number> = {};
  theatres.forEach(t => { cityMap[t.city] = (cityMap[t.city] ?? 0) + 1; });
  const topCities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCity   = Math.max(...topCities.map(t => t[1]), 1);

  return (
    <div className="anim-fadeup">
      <div className="dash-page-header">
        <h1 className="dash-page-title">PLATFORM ANALYTICS</h1>
        <p className="dash-page-sub">Revenue, top movies, theatres & activity</p>
      </div>

      <div className="dash-stats-grid">
        <StatCard label="Total Revenue"    value={`₹${revenue.toLocaleString()}`}  icon="💰" color="#f59e0b" />
        <StatCard label="Today's Bookings" value={todayBookings}                    icon="📅" color="#3b82f6" />
        <StatCard label="Avg Ticket Price" value={`₹${avgPrice}`}                  icon="🎟" color="#a855f7" />
        <StatCard label="Seat Occupancy"   value={`${occupancy}%`}                 icon="💺" color="#10b981" />
      </div>

      <div className="dash-chart-grid">
        {/* Top Movies */}
        <div className="dash-chart-card">
          <p className="dash-chart-title">Top Movies by Bookings</p>
          {topMovies.length === 0
            ? <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No data yet</p>
            : topMovies.map((m, i) => (
              <div key={m.name} className="hbar-row">
                <span className="hbar-label">{i + 1}. {m.name}</span>
                <div className="hbar-track"><div className="hbar-fill" style={{ width: `${(m.count / topMovies[0].count) * 100}%` }} /></div>
                <span className="hbar-val">{m.count}</span>
              </div>
            ))
          }
        </div>

        {/* Revenue by Theatre */}
        <div className="dash-chart-card">
          <p className="dash-chart-title">Revenue by Theatre</p>
          {topTheatres.length === 0
            ? <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No data yet</p>
            : topTheatres.map((t, i) => (
              <div key={t.name} className="hbar-row">
                <span className="hbar-label">{i + 1}. {t.name}</span>
                <div className="hbar-track"><div className="hbar-fill" style={{ width: `${(t.rev / topTheatres[0].rev) * 100}%`, background: "linear-gradient(to right,#3b82f6,#a855f7)" }} /></div>
                <span className="hbar-val">₹{(t.rev / 1000).toFixed(1)}k</span>
              </div>
            ))
          }
        </div>

        {/* Daily Bookings */}
        <div className="dash-chart-card">
          <p className="dash-chart-title">Daily Bookings — Last 7 Days</p>
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

        {/* Top Cities */}
        <div className="dash-chart-card">
          <p className="dash-chart-title">Top Cities</p>
          {topCities.length === 0
            ? <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No data</p>
            : topCities.map(([city, count]) => (
              <div key={city} className="hbar-row">
                <span className="hbar-label">📍 {city}</span>
                <div className="hbar-track"><div className="hbar-fill" style={{ width: `${(count / maxCity) * 100}%`, background: "linear-gradient(to right,#10b981,#06b6d4)" }} /></div>
                <span className="hbar-val">{count}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}