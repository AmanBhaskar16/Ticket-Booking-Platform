import { useState } from "react";
import Modal        from "../../../common/Modal/Modal.tsx";
import { showsApi } from "../../../../api/index.api.ts";
import { showToast } from "../../../common/Toast/toast.ts";
import type { Show, Movie, Theatre, ShowFormat, CreateShowPayload, MovieRef } from "../../../../types/movie.types.ts";

interface ShowFormProps {
  data:     Show | null;
  movies:   Movie[];
  theatres: Theatre[];
  onClose:  () => void;
  onSave:   () => void;
}

const FORMATS:   ShowFormat[] = ["2D","3D","IMAX","4DX","Dolby Atmos"];
const LANGUAGES                = ["Hindi","English","Tamil","Telugu","Malayalam","Kannada","Bengali","Punjabi","Marathi"];

export default function ShowForm({ data, movies, theatres, onClose, onSave }: ShowFormProps) {
  const isEdit = !!data;

  const initMovieId   = data?.movieId   && typeof data.movieId   === "object" ? (data.movieId   as Movie  )._id : (data?.movieId   as string ?? "");
  const initTheatreId = data?.theatreId && typeof data.theatreId === "object" ? (data.theatreId as Theatre)._id : (data?.theatreId as string ?? "");

  const [form, setForm] = useState<CreateShowPayload>({
    movieId:           initMovieId,
    theatreId:         initTheatreId,
    screen:            data?.screen    ?? "Screen 1",
    showTime:          data?.showTime  ? new Date(data.showTime).toISOString().slice(0, 16) : "",
    noOfSeats:         data?.noOfSeats ?? 100,
    price:             data?.price     ?? 250,
    format:            data?.format    ?? "2D",
    language:          data?.language  ?? "Hindi",
    seatConfiguration: data?.seatConfiguration ?? "",
  });

  const [saving, setSaving] = useState(false);

  const set = <K extends keyof CreateShowPayload>(k: K, v: CreateShowPayload[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  // Filter movies by selected theatre
  const selectedTheatre = theatres.find(t => t._id === form.theatreId);
  const availableMovies = selectedTheatre
    ? movies.filter(m =>
        selectedTheatre.movies.some((mv: MovieRef) => (typeof mv === "string" ? mv : mv._id) === m._id)
      )
    : movies;

  const validate = (): string | null => {
    if (!form.theatreId)      return "Select a theatre";
    if (!form.movieId)        return "Select a movie";
    if (!form.screen.trim())  return "Screen name is required";
    if (!form.showTime)       return "Show time is required";
    if (form.noOfSeats < 1)   return "Seats must be at least 1";
    if (form.price < 1)       return "Price must be at least ₹1";
    if (!form.language)       return "Select a language";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { showToast(err, "error"); return; }
    setSaving(true);
    try {
      const payload = { ...form, showTime: new Date(form.showTime).toISOString() };
      if (isEdit) await showsApi.update(data!._id, payload);
      else        await showsApi.create(payload);
      showToast(`Show ${isEdit ? "updated" : "created"} successfully`);
      onSave();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to save", "error");
    } finally { setSaving(false); }
  };

  return (
    <Modal
      title={isEdit ? "EDIT SHOW" : "CREATE SHOW"}
      onClose={onClose}
      maxWidth={540}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Show"}
          </button>
        </>
      }
    >
      {/* Theatre */}
      <div className="form-group">
        <label className="form-label">Theatre *</label>
        <select className="form-input" value={form.theatreId}
          onChange={e => { set("theatreId", e.target.value); set("movieId", ""); }}>
          <option value="">Select Theatre</option>
          {theatres.map(t => (
            <option key={t._id} value={t._id}>{t.name} — {t.city}</option>
          ))}
        </select>
      </div>

      {/* Movie */}
      <div className="form-group">
        <label className="form-label">
          Movie *
          {selectedTheatre && availableMovies.length === 0 && (
            <span style={{ color: "var(--red)", fontSize: 11, marginLeft: 8 }}>
              No movies in this theatre — add movies first
            </span>
          )}
        </label>
        <select className="form-input" value={form.movieId}
          onChange={e => set("movieId", e.target.value)}>
          <option value="">Select Movie</option>
          {availableMovies.map(m => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Screen & Time */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Screen *</label>
          <input className="form-input" value={form.screen}
            onChange={e => set("screen", e.target.value)}
            placeholder="e.g. Screen 1 / Audi 2" />
        </div>
        <div className="form-group">
          <label className="form-label">Show Time *</label>
          <input className="form-input" type="datetime-local" value={form.showTime}
            onChange={e => set("showTime", e.target.value)} />
        </div>
      </div>

      {/* Format & Language */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Format *</label>
          <select className="form-input" value={form.format}
            onChange={e => set("format", e.target.value as ShowFormat)}>
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Language *</label>
          <select className="form-input" value={form.language}
            onChange={e => set("language", e.target.value)}>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Seats & Price */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Total Seats *</label>
          <input className="form-input" type="number" min={1} value={form.noOfSeats}
            onChange={e => set("noOfSeats", Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label className="form-label">Price (₹) *</label>
          <input className="form-input" type="number" min={1} value={form.price}
            onChange={e => set("price", Number(e.target.value))} />
        </div>
      </div>

      {/* Seat Config */}
      <div className="form-group">
        <label className="form-label">
          Seat Configuration
          <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 11, marginLeft: 4, textTransform: "none", letterSpacing: 0 }}>
            (optional, e.g. 10x10)
          </span>
        </label>
        <input className="form-input" value={form.seatConfiguration ?? ""}
          onChange={e => set("seatConfiguration", e.target.value)}
          placeholder="rows x seatsPerRow" />
      </div>
    </Modal>
  );
}