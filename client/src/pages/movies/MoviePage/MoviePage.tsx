import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar    from "../../../components/common/Navbar/Navbar.tsx";
import MovieFilters from "../../../components/movies/MovieFilters/MovieFilters.tsx";
import MovieGrid, { MovieGridSkeleton } from "../../../components/movies/MovieGrid/MovieGrid.tsx";
import { moviesApi } from "../../../api/index.api.ts";
import type { Movie } from "../../../types/movie.types.ts";

export default function MoviesPage() {
  const navigate = useNavigate();

  const [movies,  setMovies]  = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [genre,   setGenre]   = useState("All");
  const [sortBy,  setSortBy]  = useState("rating");

  useEffect(() => {
  const fetchMovies = async () => {
    try {
      const data = await moviesApi.getAll();
      setMovies(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to fetch movies");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchMovies();
}, []);

  const filtered = useMemo(() => {
    let list = [...movies];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name?.toLowerCase().includes(q) ||
        m.genre?.join(" ").toLowerCase().includes(q) ||
        m.director?.toLowerCase().includes(q)
      );
    }
    if (genre !== "All")
      list = list.filter(m => m.genre?.some(g => g.toLowerCase() === genre.toLowerCase()));
    if (sortBy === "rating") list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sortBy === "name")   list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "date")   list.sort((a, b) => new Date(b.releaseDate ?? 0).getTime() - new Date(a.releaseDate ?? 0).getTime());
    return list;
  }, [movies, search, genre, sortBy]);

  return (
    <div className="page-wrapper">
      <div className="grain" />
      <AppNavbar />

      <MovieFilters
        search={search}      onSearch={setSearch}
        genre={genre}        onGenre={setGenre}
        sortBy={sortBy}      onSort={setSortBy}
        resultCount={filtered.length}
        loading={loading}
        error={error}
      />

      <div className="container">
        {loading && <MovieGridSkeleton />}

        {!loading && error && (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <p className="empty-state-title">Could Not Load Movies</p>
            <p className="empty-state-sub">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🎬</div>
            <p className="empty-state-title">No Movies Found</p>
            <p className="empty-state-sub">Try a different search or genre</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <MovieGrid
            movies={filtered}
            onMovieClick={id => navigate(`/movies/${id}`)}
          />
        )}
      </div>
    </div>
  );
}

