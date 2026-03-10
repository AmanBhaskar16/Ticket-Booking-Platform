export type ReleaseStatus = "COMING_SOON" | "RELEASED" | "BANNED";
export type Certificate   = "U" | "UA" | "A" | "R" | "PG-13";

// Shape returned by GET /movies/:id  (matches movie.model.js)
export interface Movie {
  _id:           string;
  name:          string;
  description:   string;
  casts:         string[];
  trailerUrl:    string;
  languages:     string[];
  releaseDate:   string;   // ISO date string
  duration:      number;   // minutes
  posterUrl:     string;
  genre:         string[];
  rating:        number;   // 0-10
  certificate:   Certificate;
  director:      string;
  releaseStatus: ReleaseStatus;
  isActive:      boolean;
  createdAt:     string;
  updatedAt:     string;
}

// Local mock data shape (homepage, no _id)
export interface MockMovie {
  id:          number;
  title:       string;
  genre:       string;
  rating:      string;
  duration:    string;
  year:        string;
  badge:       string;
  badgeBg:     string;
  accentColor: string;
  ratingColor: string;
  bookBg:      string;
  bookBorder:  string;
  poster:      string;
  bg:          string;
  description: string;
  cast:        string[];
  screens:     number;
  price:       string;
}

export interface UpcomingMovie {
  title:  string;
  genre:  string;
  date:   string;
  hype:   number;
  img:    string;
}

export interface Cinema {
  name:     string;
  location: string;
  dist:     string;
  screens:  number;
  rating:   string;
  tags:     string[];
}

export interface Review {
  name:     string;
  movie:    string;
  stars:    number;
  initials: string;
  ago:      string;
  text:     string;
}