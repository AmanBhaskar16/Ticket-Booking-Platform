import StatCard   from "../../../common/StatCard/StatCard.tsx";
import UserAvatar from "../../../common/UserAvatar/UserAvatar.tsx";
import StatusBadge from "../../../common/StatusBadge/StatusBadge.tsx";
import type { Movie, Theatre, Show, Booking, User } from "../../../../../types/movie.types.ts";

const fmtDT = (d: string) => new Date(d).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});

interface OverviewTabProps {
  users:    User[];
  movies:   Movie[];
  theatres: Theatre[];
  shows:    Show[];
  bookings: Booking[];
  onTabChange: (tab: string) => void;
}

export default function OverviewTab({
  users, movies, theatres, shows, bookings, onTabChange,
}: OverviewTabProps) {
  const revenue = bookings
    .filter(b => b.status === "SUCCESSFUL")
    .reduce((a, b) => a + (b.seat?.length ?? 0) * ((b.showId as Show)?.price ?? 0), 0);
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toDateString();
    const db = bookings.filter(b => new Date(b.createdAt ?? "").toDateString() === ds);
    return {
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      count: db.length,
      rev:   db.filter(b => b.status === "SUCCESSFUL")
               .reduce((a, b) => a + (b.seat?.length ?? 0) * ((b.showId as Show)?.price ?? 0), 0),
    };
  });

  const maxC = Math.max(...last7.map(d => d.count), 1);
  const maxR = Math.max(...last7.map(d => d.rev), 1);

  const topMovies = (() => {
    const map: Record<string, { name: string; count: number }> = {};
    bookings.forEach(b => {
      const show = b.showId as Show;
      const mv   = typeof show?.movieId === "object" ? show.movieId as Movie : null;
      if (mv) map[mv._id] = { name: mv.name, count: (map[mv._id]?.count ?? 0) + (b.seat?.length ?? 0) };
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  })();

  const stats = [
    { label: "Total Users",    value: users.length,   icon: "👥", color: "#3b82f6", tab: "users"     },
    { label: "Total Theatres", value: theatres.length, icon: "🏛",  color: "#a855f7", tab: "theatres"  },
    { label: "Total Movies",   value: movies.length,   icon: "🎬", color: "#ef4444", tab: "movies"    },
    { label: "Total Bookings", value: bookings.length, icon: "🎟", color: "#10b981", tab: "bookings"  },
    { label: "Total Revenue",  value: `₹${revenue >= 1000 ? (revenue / 1000).toFixed(1) + "k" : revenue}`, icon: "💰", color: "#f59e0b", tab: "analytics" },
    { label: "Active Shows",   value: shows.filter(s => s.isActive !== false).length, icon: "🎥", color: "#06b6d4", tab: "shows" },
  ];

  return (
    <div className="anim-fadeup">
      <div className="dash-page-header">
        <p className="dash-eyebrow">Platform Control</p>
        <h1 className="dash-page-title">ADMIN OVERVIEW</h1>
        <p className="dash-page-sub">Real-time platform statistics</p>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid">
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value}
            icon={s.icon} color={s.color} onClick={() => onTabChange(s.tab)} />
        ))}
      </div>

      {/* Charts */}
      <div className="dash-chart-grid">
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
        <div className="dash-chart-card">
          <p className="dash-chart-title">Revenue — Last 7 Days (₹)</p>
          <div className="mini-bar-chart">
            {last7.map(d => (
              <div key={d.label} className="mini-bar-wrap">
                <span className="mini-bar-val">{d.rev > 0 ? `${(d.rev / 1000).toFixed(1)}k` : "0"}</span>
                <div className="mini-bar" style={{ height: `${Math.max((d.rev / maxR) * 72, 4)}px`, background: "linear-gradient(to top,rgba(59,130,246,.7),rgba(168,85,247,.3))" }} />
                <span className="mini-bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
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
      </div>

      {/* Recent bookings */}
      <p className="dash-section-title">RECENT BOOKINGS</p>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr><th>User</th><th>Movie</th><th>Show Time</th><th>Seats</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bookings.length === 0
              ? <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No bookings yet</td></tr>
              : bookings.slice(0, 6).map(b => {
                  const show = b.showId as Show;
                  const mv   = typeof show?.movieId === "object" ? show.movieId as Movie : null;
                  const usr  = typeof b.user === "object" ? b.user as User : null;
                  return (
                    <tr key={b._id}>
                      <td><div style={{ display: "flex", gap: 8, alignItems: "center" }}><UserAvatar name={usr?.name ?? "?"} size="sm" />{usr?.name ?? "—"}</div></td>
                      <td><strong style={{ color: "var(--text-primary)" }}>{mv?.name ?? "—"}</strong></td>
                      <td style={{ fontSize: 12 }}>{show?.showTime ? fmtDT(show.showTime) : "—"}</td>
                      <td>{b.seat?.join(", ") ?? "—"}</td>
                      <td>₹{(b.seat?.length ?? 0) * (show?.price ?? 0)}</td>
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