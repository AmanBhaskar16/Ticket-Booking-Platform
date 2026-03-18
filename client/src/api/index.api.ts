import axios, { type AxiosError } from "axios";
import type {
  ApiResponse, Movie, Theatre, Show, Booking, User,
  CreateMoviePayload, CreateTheatrePayload, CreateShowPayload,
} from "../types/movie.types.ts";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cv_token");
  if (token) config.headers["x-access-token"] = token;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cv_token");
      localStorage.removeItem("cv_user");
      window.location.replace("/login");
    }
    const msg =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

// ── low-level helpers ──────────────────────────────────────
// Returns data.data — the actual payload
const rawGet  = async <T>(url: string, params?: object): Promise<T> =>
  (await api.get<ApiResponse<T>>(url, { params })).data.data;
const rawPost = async <T>(url: string, body?: unknown): Promise<T> =>
  (await api.post<ApiResponse<T>>(url, body)).data.data;
const rawPatch= async <T>(url: string, body?: unknown): Promise<T> =>
  (await api.patch<ApiResponse<T>>(url, body)).data.data;
const rawDel  = async <T = void>(url: string): Promise<T> =>
  (await api.delete<ApiResponse<T>>(url)).data.data;

// ── smart extractor: handles both array AND { movies:[] } shapes ─
function extractArray<T>(data: unknown, key: string): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj[key]))      return obj[key] as T[];
    if (Array.isArray(obj["data"]))   return obj["data"] as T[];
    // paginated: { movies: [], pagination: {} }
    const keys = Object.keys(obj);
    for (const k of keys) {
      if (Array.isArray(obj[k])) return obj[k] as T[];
    }
  }
  return [];
}

// ── AUTH ──────────────────────────────────────────────────
export const authApi = {
  signup: (name: string, email: string, password: string, role: string, phone?: string, avatar?: string) =>
  rawPost<User>("/auth/signup", { name, email, password, userRole: role, phone, avatar }),
  signin: (email: string, password: string) =>
    rawPost<{ user: User; token: string }>("/auth/signin", { email, password }),
  resetPassword: (oldPassword: string, newPassword: string) =>
    rawPatch<void>("/auth/reset", { oldPassword, newPassword }),
};


// ── MOVIES ────────────────────────────────────────────────
export const moviesApi = {
  // Returns Movie[] regardless of backend shape
  getAll:    async (params?: object) => extractArray<Movie>(await rawGet<unknown>("/movies", params), "movies"),
  getById:   (id: string) => rawGet<Movie>(`/movies/${id}`),
  create:    (data: CreateMoviePayload) => rawPost<Movie>("/movies", data),
  update:    (id: string, data: Partial<CreateMoviePayload>) => rawPatch<Movie>(`/movies/${id}`, data),
  delete:    (id: string) => rawDel(`/movies/${id}`),
  setStatus: (id: string, isActive: boolean) => rawPatch<Movie>(`/movies/${id}/status`, { isActive }),
};

// ── REVIEWS ───────────────────────────────────────────────
export const reviewsApi = {
  getByMovie:  (movieId: string, page = 1) =>
                 rawGet<any>(`/movies/${movieId}/reviews?page=${page}`),
  getMyReview: (movieId: string) =>
                 rawGet<any>(`/movies/${movieId}/reviews/my`),
  create:      (data: { movieId: string; rating: number; comment: string }) =>
                 rawPost<any>("/reviews", data),
  update:      (id: string, data: { rating?: number; comment?: string }) =>
                 rawPatch<any>(`/reviews/${id}`, data),
  delete:      (id: string) =>
                 rawDel<any>(`/reviews/${id}`),
  toggleLike:  (id: string) =>
                 rawPost<any>(`/reviews/${id}/like`, {}),
};
 
// ── USER PROFILE ──────────────────────────────────────────
export const profileApi = {
  updateProfile:  (data: { name: string; phone?: string; avatar?: string }) =>
                    rawPatch<any>("/users/profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
                    rawPatch<any>("/users/change-password", data),
};

// ── THEATRES ──────────────────────────────────────────────
export const theatresApi = {
  getAll:      async (params?: object) => extractArray<Theatre>(await rawGet<unknown>("/theatres", params), "theatres"),
  getById:     (id: string) => rawGet<Theatre>(`/theatres/${id}`),
  create:      (data: CreateTheatrePayload) => rawPost<Theatre>("/theatres", data),
  update:      (id: string, data: Partial<CreateTheatrePayload>) => rawPatch<Theatre>(`/theatres/${id}`, data),
  delete:      (id: string) => rawDel(`/theatres/${id}`),
  setStatus:   (id: string, isActive: boolean) => rawPatch<Theatre>(`/theatres/${id}/status`, { isActive }),
  addMovie:    (theatreId: string, movieId: string) =>
                 rawPatch<Theatre>(`/theatres/${theatreId}/movies`, { movieIds: [movieId], insert: true }),
  removeMovie: (theatreId: string, movieId: string) =>
                 rawPatch<Theatre>(`/theatres/${theatreId}/movies`, { movieIds: [movieId], insert: false }),
};

// ── SHOWS ─────────────────────────────────────────────────
export const showsApi = {
  getAll:               async (params?: object) => extractArray<Show>(await rawGet<unknown>("/shows", params), "shows"),
  getById:              (id: string) => rawGet<Show>(`/shows/${id}`),
  getByMovie:           (movieId: string) => showsApi.getAll({ movieId }),
  getByTheatre:         (theatreId: string) => showsApi.getAll({ theatreId }),
  getByMovieAndTheatre: (movieId: string, theatreId: string) => showsApi.getAll({ movieId, theatreId }),
  create:               (data: CreateShowPayload) => rawPost<Show>("/shows", data),
  update:               (id: string, data: Partial<CreateShowPayload>) => rawPatch<Show>(`/shows/${id}`, data),
  delete:               (id: string) => rawDel(`/shows/${id}`),
  setStatus:            (id: string, isActive: boolean) => rawPatch<Show>(`/shows/${id}/status`, { isActive }),
};

// ── BOOKINGS ──────────────────────────────────────────────
export const bookingsApi = {
  initiate:      (showId: string, seats: string[]) =>
                   rawPost<any>("/bookings/initiate", { showId, seats }),
  confirm:       (bookingId: string, stripePaymentIntentId: string) =>
                   rawPost<any>("/bookings/confirm", { bookingId, stripePaymentIntentId }),
  cancel:        (bookingId: string, cancellationReason?: string) =>
                   rawPost<any>("/bookings/cancel", { bookingId, cancellationReason }),
  getMyBookings: async () => extractArray<Booking>(await rawGet<unknown>("/bookings/my"), "bookings"),
  getById:       (id: string) => rawGet<any>(`/bookings/${id}`),
  getAll:        async () => extractArray<Booking>(await rawGet<unknown>("/bookings"), "bookings"),
};

// ── USERS ─────────────────────────────────────────────────
export const usersApi = {
  getAll:       async (params?: object) => extractArray<User>(await rawGet<unknown>("/users", params), "users"),
  getById:      (id: string) => rawGet<User>(`/users/${id}`),
  updateStatus: (id: string, status: "APPROVED" | "PENDING" | "REJECTED") =>
                  rawPatch<User>(`/users/${id}`, { userStatus: status }),
  updateRole:   (id: string, role: string) => rawPatch<User>(`/users/${id}`, { userRole: role }),
  delete:       (id: string) => rawDel(`/users/${id}`),
};

// ── aliases ────────────────────────────────────────────────
export const loginUser       = authApi.signin;
export const signupUser      = authApi.signup;
export const getMovies       = moviesApi.getAll;
export const getShows        = showsApi.getAll;
export const createBooking   = bookingsApi.initiate;
export const getUserBookings = bookingsApi.getMyBookings;