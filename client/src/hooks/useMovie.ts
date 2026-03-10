import { useState, useEffect } from "react";
import { getMovieById } from "../api/movies.api";
import type { Movie } from "../types/movie.types";

interface UseMovieResult {
  movie:   Movie | null;
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

export function useMovie(id: string | undefined): UseMovieResult {
  const [movie,   setMovie]   = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [tick,    setTick]    = useState(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No movie ID provided");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getMovieById(id)
      .then(data => {
        if (!cancelled) { setMovie(data); setLoading(false); }
      })
      .catch(err => {
        if (!cancelled) { setError(err?.message ?? "Unknown error"); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [id, tick]);

  return { movie, loading, error, refetch: () => setTick(t => t + 1) };
}