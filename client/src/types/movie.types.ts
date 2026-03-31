// // ─────────────────────────────────────────────────────────
// //  TYPES — 100% synced with updated MongoDB schemas
// // ─────────────────────────────────────────────────────────

// // ── USER ──────────────────────────────────────────────────
// export type UserRole   = "CUSTOMER" | "CLIENT" | "ADMIN";
// export type UserStatus = "APPROVED" | "PENDING" | "REJECTED";

// export interface User {
//   id:        string;       // backend sends "id" in signin response
//   _id?:      string;
//   name:      string;
//   email:     string;
//   phone?:    string;       
//   avatar?:   string;       
//   userRole: UserRole;
//   userStatus: UserStatus;   
//   createdAt?: string;
// }

// export interface AuthState {
//   user:    User | null;
//   token:   string | null;
//   loading: boolean;
// }

// // ── MOVIE ─────────────────────────────────────────────────
// export type MovieCertificate   = "U" | "UA" | "A" | "R" | "PG-13";
// export type MovieReleaseStatus = "COMING_SOON" | "RELEASED" | "BANNED";
// export type ReleaseStatus      = MovieReleaseStatus; // alias

// export interface Movie {
//   _id:           string;
//   name:          string;
//   description:   string;
//   director:      string;
//   casts:         string[];
//   genre:         string[];
//   languages:     string[];
//   duration:      number;        // minutes
//   rating :       number;        // 0-10
//   certificate?:  MovieCertificate;
//   releaseDate:   string;
//   releaseStatus?: MovieReleaseStatus;
//   posterUrl:     string;
//   bannerUrl?:    string;        // ← NEW: hero banner
//   trailerUrl:    string;
//   images?:       string[];      // ← NEW: stills/gallery
//   isActive?:     boolean;
//   createdAt?:    string;
// }

// // ── THEATRE ───────────────────────────────────────────────
// export interface Theatre {
//   _id:          string;
//   name:         string;
//   description?: string;
//   city:         string;
//   state:        string;         // ← NEW
//   pincode:      number;
//   address:      string;
//   owner?:       string;
//   movies:       string[];
//   totalScreens: number;         // ← NEW
//   amenities:    string[];       // ← NEW
//   images:       string[];       // ← NEW
//   isActive?:    boolean;
//   createdAt?:   string;
// }

// // ── SHOW ──────────────────────────────────────────────────
// export type ShowFormat = "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos"; // ← added Dolby Atmos

// export interface Show {
//   _id:               string;
//   theatreId:         Theatre | string;
//   movieId:           Movie   | string;
//   screen:            string;    // ← NEW: "Screen 1", "Audi 2"
//   showTime:          string;
//   noOfSeats:         number;
//   bookedSeats:       string[];  // ← NEW: ["A1","B2"]
//   price:             number;
//   format:            ShowFormat;
//   language:          string;    // ← NEW: show language
//   isActive?:         boolean;   // ← NEW
//   seatConfiguration?: string;
//   createdAt?:        string;
// }

// // ── BOOKING ───────────────────────────────────────────────
// export type BookingStatus = "IN_PROCESS" | "SUCCESSFUL" | "CANCELLED" | "EXPIRED";

// export interface Booking {
//   _id:       string;
//   showId:    Show;
//   seat:      string[];
//   status:    BookingStatus;
//   user?:     User | string;
//   createdAt?: string;
// }

// // ── API ───────────────────────────────────────────────────
// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data:    T;
//   err?:    unknown;
// }

// // ── CREATE PAYLOADS ───────────────────────────────────────
// export interface CreateMoviePayload {
//   name:           string;
//   description:    string;
//   director:       string;
//   casts:          string[];
//   genre:          string[];
//   languages:      string[];
//   duration:       number;
//   rating?:        number;
//   certificate?:   MovieCertificate;
//   releaseDate:    string;
//   releaseStatus?: MovieReleaseStatus;
//   posterUrl:      string;
//   bannerUrl?:     string;
//   trailerUrl:     string;
//   images?:        string[];
// }

// export interface CreateTheatrePayload {
//   name:          string;
//   description?:  string;
//   city:          string;
//   state:         string;
//   pincode:       number;
//   address:       string;
//   totalScreens:  number;
//   amenities:     string[];
//   images:        string[];
// }

// export interface CreateShowPayload {
//   theatreId:          string;
//   movieId:            string;
//   screen:             string;
//   showTime:           string;
//   noOfSeats:          number;
//   price:              number;
//   format:             ShowFormat;
//   language:           string;
//   seatConfiguration?: string;
// }

// ─────────────────────────────────────────────────────────
//  TYPES — 100% synced with updated MongoDB schemas
// ─────────────────────────────────────────────────────────

// ── USER ──────────────────────────────────────────────────
export type UserRole   = "CUSTOMER" | "CLIENT" | "ADMIN";
export type UserStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface User {
  id:          string;
  _id?:        string;
  name:        string;
  email:       string;
  phone?:      string;
  avatar?:     string;
  userRole:    UserRole;
  userStatus:  UserStatus;
  createdAt?:  string;
}

export interface AuthState {
  user:    User | null;
  token:   string | null;
  loading: boolean;
}

// ── MOVIE ─────────────────────────────────────────────────
export type MovieCertificate   = "U" | "UA" | "A" | "R" | "PG-13";
export type MovieReleaseStatus = "COMING_SOON" | "RELEASED" | "BANNED";
export type ReleaseStatus      = MovieReleaseStatus; // alias

export interface Movie {
  _id:           string;
  name:          string;
  description:   string;
  director:      string;
  casts:         string[];
  genre:         string[];
  languages:     string[];
  duration:      number;        // minutes
  rating?:       number;        // 0-10
  certificate?:  MovieCertificate;
  releaseDate:   string;
  releaseStatus?: MovieReleaseStatus;
  posterUrl:     string;
  bannerUrl?:    string;        // ← NEW: hero banner
  trailerUrl:    string;
  images?:       string[];      // ← NEW: stills/gallery
  isActive?:     boolean;
  createdAt?:    string;
}

// ── THEATRE ───────────────────────────────────────────────
export interface Theatre {
  _id:          string;
  name:         string;
  description?: string;
  city:         string;
  state:        string;         // ← NEW
  pincode:      number;
  address:      string;
  owner?:       string;
  movies:       string[];
  totalScreens: number;         // ← NEW
  amenities:    string[];       // ← NEW
  images:       string[];       // ← NEW
  isActive?:    boolean;
  createdAt?:   string;
}

// ── SHOW ──────────────────────────────────────────────────
export type ShowFormat = "2D" | "3D" | "IMAX" | "4DX" | "Dolby Atmos"; // ← added Dolby Atmos

export interface Show {
  _id:               string;
  theatreId:         Theatre | string;
  movieId:           Movie   | string;
  screen:            string;    // ← NEW: "Screen 1", "Audi 2"
  showTime:          string;
  noOfSeats:         number;
  bookedSeats:       string[];  // ← NEW: ["A1","B2"]
  price:             number;
  format:            ShowFormat;
  language:          string;    // ← NEW: show language
  isActive?:         boolean;   // ← NEW
  seatConfiguration?: string;
  createdAt?:        string;
}

// ── BOOKING ───────────────────────────────────────────────
export type BookingStatus = "IN_PROCESS" | "SUCCESSFUL" | "CANCELLED" | "EXPIRED";

export interface Booking {
  _id:                   string;
  showId:                Show | string;
  userId?:               User | string;
  seats:                 string[];
  totalAmount:           number;
  status:                BookingStatus;
  stripePaymentIntentId?: string;
  stripeClientSecret?:   string;
  ticketCode?:           string;
  cancellationReason?:   string;
  cancelledAt?:          string;
  createdAt?:            string;
  updatedAt?:            string;
}

// ── API ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
  err?:    unknown;
}

// ── CREATE PAYLOADS ───────────────────────────────────────
export interface CreateMoviePayload {
  name:           string;
  description:    string;
  director:       string;
  casts:          string[];
  genre:          string[];
  languages:      string[];
  duration:       number;
  rating?:        number;
  certificate?:   MovieCertificate;
  releaseDate:    string;
  releaseStatus?: MovieReleaseStatus;
  posterUrl:      string;
  bannerUrl?:     string;
  trailerUrl:     string;
  images?:        string[];
}

export interface CreateTheatrePayload {
  name:          string;
  description?:  string;
  city:          string;
  state:         string;
  pincode:       number;
  address:       string;
  totalScreens:  number;
  amenities:     string[];
  images:        string[];
}

export interface CreateShowPayload {
  theatreId:          string;
  movieId:            string;
  screen:             string;
  showTime:           string;
  noOfSeats:          number;
  price:              number;
  format:             ShowFormat;
  language:           string;
  seatConfiguration?: string;
}

// ── REVIEW ─────────────────────────────────────────────────
export interface Review {
  _id:       string;
  movieId:   string;
  userId:    { _id: string; name: string } | string;
  rating:    number;
  comment:   string;
  likes:     string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews:             Review[];
  pagination:          { total: number; page: number; limit: number; totalPages: number };
  ratingDistribution:  { _id: number; count: number }[];
}

export interface LikeResponse {
  liked:      boolean;
  likesCount: number;
}

// ── UPLOAD ─────────────────────────────────────────────────
export interface UploadResponse {
  url:       string;
  publicId:  string;
  width?:    number;
  height?:   number;
  format?:   string;
  duration?: number;
}

// ── BOOKING INITIATE ───────────────────────────────────────
export interface InitiateBookingResponse {
  bookingId:    string;
  clientSecret: string;
  totalAmount:  number;
  seats:        string[];
  show: {
    name:     string;
    poster?:  string;
    duration?: number;
    theatre:  string;
    city:     string;
    address:  string;
    showTime: string;
    format:   string;
    language: string;
    screen:   string;
    price:    number;
  };
}

// ── THEATRE MOVIE REF ──────────────────────────────────────
// Theatre.movies can be string[] or Movie[] (populated)
export type MovieRef = string | { _id: string; name: string; posterUrl?: string };