import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar          from "../../../components/common/Navbar/Navbar.tsx";
import { PageSpinner }    from "../../../components/common/SharedUI/SharedUI.tsx";
import MovieHero          from "../../../components/movies/MovieHero/MovieHero.tsx";
import TheatreShowBlock   from "../../../components/movies/TheatreShowBlock/TheatreShowBlock.tsx";
import TrailerModal       from "../../../components/movies/TrailerModal/TrailerModal.tsx";
import DatePicker         from "../../../components/common/DataPicker/DataPicker.tsx";
import { moviesApi, showsApi, theatresApi } from "../../../api/index.api.ts";
import type { Movie, Show, Theatre } from "../../../types/movie.types.ts";
import ReviewSection from "../../../components/movies/ReviewSection/ReviewSection.tsx";
import "./UserMovieDetailPage.css";

// Generate next 7 days
const generateDates = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

export default function UserMovieDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie,       setMovie]       = useState<Movie | null>(null);
  const [shows,       setShows]       = useState<Show[]>([]);
  const [theatres,    setTheatres]    = useState<Theatre[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [selDate,     setSelDate]     = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  const dates = generateDates();

  // Directly update movie rating so MovieHero re-renders immediately
  const refreshMovieRating = (avgRating: number | null) => {
    setMovie(prev => prev ? { ...prev, rating: avgRating ?? prev.rating } : prev);
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [m, s, t] = await Promise.allSettled([
          moviesApi.getById(id),
          showsApi.getByMovie(id),
          theatresApi.getAll(),
        ]);
        if (cancelled) return;

        if (m.status === "fulfilled") {
          setMovie(m.value);
        } else {
          const all = await moviesApi.getAll();
          if (!cancelled) setMovie(all.find(mv => mv._id === id) ?? null);
        }
        if (s.status === "fulfilled") setShows(s.value);
        if (t.status === "fulfilled") setTheatres(t.value);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return (
    <div className="page-wrapper"><AppNavbar /><PageSpinner /></div>
  );

  if (!movie) return (
    <div className="page-wrapper">
      <AppNavbar />
      <div className="empty-state" style={{ marginTop: 80 }}>
        <div className="empty-state-icon">🎬</div>
        <p className="empty-state-title">Movie Not Found</p>
        <button className="btn btn-ghost" style={{ marginTop: 16 }}
          onClick={() => navigate("/movies")}>← Back to Movies</button>
      </div>
    </div>
  );

  // Group shows by theatre for selected date
  const selDay = dates[selDate];
  const showsByTheatre = theatres
    .map(t => ({
      theatre: t,
      shows: shows.filter(s => {
        const tId      = typeof s.theatreId === "object" ? (s.theatreId as Theatre)._id : s.theatreId;
        const showDate = new Date(s.showTime);
        return tId === t._id && showDate.toDateString() === selDay.toDateString();
      }),
    }))
    .filter(g => g.shows.length > 0);

  return (
    <div className="page-wrapper">
      <div className="grain" />
      <AppNavbar />

      {/* Hero */}
      <MovieHero
        movie={movie}
        onBookTickets={() =>
          document.getElementById("shows-section")?.scrollIntoView({ behavior: "smooth" })
        }
        onWatchTrailer={() => setShowTrailer(true)}
        onBack={() => navigate("/movies")}
      />

      {/* Shows section */}
      <div className="container umdp-shows" id="shows-section">
        <div className="sec-head">
          <p className="sec-eyebrow">Select Your Show</p>
          <h2 className="sec-title">BOOK YOUR SEATS</h2>
        </div>

        <DatePicker dates={dates} selected={selDate} onChange={setSelDate} />

        {showsByTheatre.length === 0 ? (
          <div className="empty-state" style={{ padding: "48px 0" }}>
            <div className="empty-state-icon">🏛</div>
            <p className="empty-state-title">No Shows Available</p>
            <p className="empty-state-sub">Try selecting a different date</p>
          </div>
        ) : (
          <div className="umdp-theatre-list">
            {showsByTheatre.map(({ theatre, shows: tShows }) => (
              <TheatreShowBlock
                key={theatre._id}
                theatre={theatre}
                shows={tShows}
                onBook={showId => navigate(`/shows/${showId}/seats`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="container">
        <ReviewSection movieId={id!} onRatingUpdate={refreshMovieRating} />
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailerUrl && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          movieName={movie.name}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}