import type { Theatre } from "../../../types/movie.types.ts";
import "./TheatreCard.css";

interface TheatreCardProps {
  theatre:   Theatre;
  isAdmin:   boolean;
  onClick:   () => void;
  onEdit?:   () => void;
  onDelete?: () => void;
}

export default function TheatreCard({
  theatre, isAdmin, onClick, onEdit, onDelete,
}: TheatreCardProps) {
  return (
    <div className="tc-card card" onClick={onClick}>
      <div className="tc-body">
        <div className="tc-icon">🏛</div>
        <div className="tc-info">
          <h3 className="tc-name">{theatre.name}</h3>
          <p className="tc-city">📍 {theatre.city} — {theatre.pincode}</p>
          <p className="tc-address">{theatre.address}</p>
          {theatre.description && (
            <p className="tc-desc">{theatre.description}</p>
          )}
          <div className="tc-badges">
            <span className="badge badge-blue">
              {theatre.movies?.length ?? 0} movies
            </span>
            <span className={`badge badge-${theatre.isActive !== false ? "green" : "red"}`}>
              {theatre.isActive !== false ? "Active" : "Inactive"}
            </span>
            {theatre.totalScreens && (
              <span className="badge badge-purple">
                {theatre.totalScreens} screens
              </span>
            )}
          </div>
          {theatre.amenities?.length > 0 && (
            <div className="tc-amenities">
              {theatre.amenities.slice(0, 3).map(a => (
                <span key={a} className="tc-amenity">{a}</span>
              ))}
              {theatre.amenities.length > 3 && (
                <span className="tc-amenity">+{theatre.amenities.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {isAdmin && (onEdit || onDelete) && (
        <div className="tc-actions" onClick={e => e.stopPropagation()}>
          {onEdit && (
            <button className="btn btn-ghost btn-sm" onClick={onEdit}>Edit</button>
          )}
          {onDelete && (
            <button className="btn btn-ghost btn-sm tc-delete-btn" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}