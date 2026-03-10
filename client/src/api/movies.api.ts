import type { Movie } from "../types/movie.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

// ── response shape from your controller ──
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body: ApiResponse<T> = await res.json();

  if (!res.ok) {
    // your errorResponseBody shape
    throw new Error((body as any)?.err ?? `HTTP ${res.status}`);
  }

  return body.data;
}

// ── GET /movies/:id ──
export const getMovieById = (id: string) =>
  request<Movie>(`/movies/${id}`);

// ── GET /movies?... ──
export interface GetMoviesParams {
  name?:          string;
  genre?:         string;
  languages?:     string;
  releaseStatus?: string;
  page?:          number;
  limit?:         number;
  sortBy?:        string;
}

export const getMovies = (params: GetMoviesParams = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return request<Movie[]>(`/movies${qs ? `?${qs}` : ""}`);
};