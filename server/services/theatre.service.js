import Movie from "../models/movie.model.js";
import Theatre from "../models/theatre.model.js";
import { STATUS_CODES } from "../utils/constants.js";
import { handleValidationError } from "../utils/response.utils.js";

// ── CREATE ────────────────────────────────────────────────
export const addTheatreService = async (data) => {
  try {
    const {
      name,
      description,
      city,
      state,
      pincode,
      address,
      owner,
      movies,
      totalScreens,
      amenities,
      images,
    } = data;

    // Duplicate check — same name + same owner
    const exists = await Theatre.findOne({ name, owner });
    if (exists)
      throw {
        err: "Theatre with this name already exists for this owner",
        code: STATUS_CODES.CONFLICT,
      };

    // Validate movie IDs if provided
    if (movies && movies.length) {
      const valid = await Movie.find({ _id: { $in: movies } }).select("_id");
      if (valid.length !== movies.length)
        throw {
          err: "Some movie IDs are invalid",
          code: STATUS_CODES.BAD_REQUEST,
        };
    }

    const theatre = await Theatre.create({
      name,
      description,
      city,
      state,
      pincode,
      address,
      owner,
      movies: movies ?? [],
      totalScreens: totalScreens ?? 1,
      amenities: amenities ?? [],
      images: images ?? [],
    });

    return theatre;
  } catch (error) {
    handleValidationError(error);
  }
};

// ── HARD DELETE ───────────────────────────────────────────
export const deleteTheatreService = async (id) => {
  const theatre = await Theatre.findByIdAndDelete(id);
  if (!theatre)
    throw {
      err: "No theatre found for the given id",
      code: STATUS_CODES.NOT_FOUND,
    };
  return theatre;
};

// ── SOFT DELETE ───────────────────────────────────────────
export const updateTheatreStatusService = async (id, isActive) => {
  const theatre = await Theatre.findByIdAndUpdate(
    id,
    { isActive },
    { new: true },
  );
  if (!theatre)
    throw {
      err: "No theatre found for the given id",
      code: STATUS_CODES.NOT_FOUND,
    };
  return theatre;
};

// ── UPDATE ────────────────────────────────────────────────
export const updateTheatreService = async (id, data) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!theatre)
      throw {
        err: "No theatre found for the given id",
        code: STATUS_CODES.NOT_FOUND,
      };
    return theatre;
  } catch (error) {
    handleValidationError(error);
  }
};

// ── GET ONE ───────────────────────────────────────────────
export const getTheatreService = async (id) => {
  const theatre = await Theatre.findById(id).populate("movies");
  if (!theatre)
    throw {
      err: "No theatre found for the given id",
      code: STATUS_CODES.NOT_FOUND,
    };
  return theatre;
};

// ── GET ALL (filters + pagination) ───────────────────────
export const getAllTheatresService = async (filter = {}) => {
  try {
    const {
      name,
      city,
      state,
      pincode,
      movieId,
      isActive = "true",
      page = 1,
      limit = 20,
    } = filter;

    const query = {};

    if (isActive !== "all") query.isActive = isActive === "true";
    if (name) query.name = { $regex: name, $options: "i" };
    if (city) query.city = { $regex: city, $options: "i" };
    if (state) query.state = { $regex: state, $options: "i" };
    if (pincode) query.pincode = Number(pincode);
    if (movieId) query.movies = movieId;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [theatres, total] = await Promise.all([
      Theatre.find(query).populate("movies").skip(skip).limit(limitNum),
      Theatre.countDocuments(query),
    ]);

    return {
      theatres,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  } catch (error) {
    console.error(error);
    throw {
      err: "Failed to fetch theatres",
      code: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

// ── ADD / REMOVE MOVIES ───────────────────────────────────
export const updateMoviesInTheatreService = async (
  theatreId,
  movieIds,
  insert,
) => {
  try {
    // Validate all movieIds exist
    const valid = await Movie.find({ _id: { $in: movieIds } }).select("_id");
    if (valid.length !== movieIds.length)
      throw {
        err: "Some movie IDs are invalid",
        code: STATUS_CODES.BAD_REQUEST,
      };

    const update = insert
      ? { $addToSet: { movies: { $each: movieIds } } } // add, no duplicates
      : { $pull: { movies: { $in: movieIds } } }; // remove

    const theatre = await Theatre.findByIdAndUpdate(theatreId, update, {
      new: true,
    }).populate("movies");

    if (!theatre)
      throw {
        err: "No theatre found for the given id",
        code: STATUS_CODES.NOT_FOUND,
      };
    return theatre;
  } catch (error) {
    if (error.name === "TypeError")
      throw {
        err: "No theatre found for the given id",
        code: STATUS_CODES.NOT_FOUND,
      };
    throw error;
  }
};

// ── GET MOVIES OF THEATRE ─────────────────────────────────
export const getMoviesOfTheatreService = async (id) => {
  const theatre = await Theatre.findById(id, {
    name: 1,
    movies: 1,
    address: 1,
    city: 1,
  }).populate("movies");
  if (!theatre)
    throw {
      err: "No theatre found for the given id",
      code: STATUS_CODES.NOT_FOUND,
    };
  return theatre;
};

// ── CHECK IF MOVIE EXISTS IN THEATRE ─────────────────────
export const checkMoviesInATheatreService = async (theatreId, movieId) => {
  const theatre = await Theatre.findById(theatreId);
  if (!theatre)
    throw {
      err: "No theatre found for the given id",
      code: STATUS_CODES.NOT_FOUND,
    };
  return theatre.movies.some((id) => id.toString() === movieId);
};
