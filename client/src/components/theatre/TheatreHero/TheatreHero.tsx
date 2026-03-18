import type { Theatre } from "../../../types/movie.types.ts";
import "./TheatreHero.css";

interface TheatreHeroProps {
  theatre:        Theatre;
  moviesCount:    number;
  onBack:         () => void;
}

export default function TheatreHero({ theatre, moviesCount, onBack }: TheatreHeroProps) {
  return (
    <section className="th-hero">
      <div className="container">
        <button className="btn btn-ghost btn-sm th-back" onClick={onBack}>
          ← All Theatres
        </button>

        <div className="th-inner">
          <div className="th-icon">🏛</div>

          <div className="th-info">
            <h1 className="th-title">{theatre.name}</h1>
            <p className="th-location">
              📍 {theatre.address}, {theatre.city}
              {theatre.state ? `, ${theatre.state}` : ""} — {theatre.pincode}
            </p>

            {theatre.description && (
              <p className="th-desc">{theatre.description}</p>
            )}

            <div className="th-meta-row">
              <span className="th-meta">🎬 <strong>{moviesCount}</strong> movies</span>
              <span className="th-meta">📽 <strong>{theatre.totalScreens ?? 1}</strong> screens</span>
            </div>

            {theatre.amenities?.length > 0 && (
              <div className="th-amenities">
                {theatre.amenities.map(a => (
                  <span key={a} className="badge badge-blue">{a}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}