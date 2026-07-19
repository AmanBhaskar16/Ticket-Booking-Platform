import Show from "../models/show.model.js";
import Theatre from "../models/theatre.model.js";
import { STATUS_CODES } from "../utils/constants.js";
import { handleValidationError } from "../utils/response.utils.js";

// ── CREATE ────────────────────────────────────────────────
export const createShowService = async (data) => {
  try {
    const {
      theatreId,
      movieId,
      screen,
      showTime,
      noOfSeats,
      price,
      format,
      language,
    } = data;

    // Theatre must exist
    const theatre = await Theatre.findById(theatreId);
    if (!theatre)
      throw {
        err: "No theatre found for the given id",
        code: STATUS_CODES.NOT_FOUND,
      };

    // Movie must be available in that theatre
    const movieExists = theatre.movies.some(
      (id) => id.toString() === movieId.toString(),
    );
    if (!movieExists)
      throw {
        err: "Movie is not available in this theatre — add it first",
        code: STATUS_CODES.BAD_REQUEST,
      };

    const show = await Show.create({
      theatreId,
      movieId,
      screen,
      showTime,
      noOfSeats,
      price,
      format,
      language,
      bookedSeats: [],
      isActive: true,
    });

    return show;
  } catch (error) {
    handleValidationError(error);
  }
};

// ── GET ALL (with filters) ────────────────────────────────
export const getShowsService = async (filter = {}) => {
  try {
    const {
      theatreId,
      movieId,
      screen,
      format,
      language,
      isActive = "true", // default: only active shows
      date, // filter by showTime date e.g. "2024-12-25"
    } = filter;

    const query = {};

    if (isActive !== "all") query.isActive = isActive === "true";
    if (theatreId) query.theatreId = theatreId;
    if (movieId) query.movieId = movieId;
    if (screen) query.screen = screen;
    if (format) query.format = format;
    if (language) query.language = language;

    // Filter by date — get all shows on a specific day
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.showTime = { $gte: start, $lt: end };
    }

    const shows = await Show.find(query)
      .populate("theatreId")
      .populate("movieId")
      .sort({ showTime: 1 }); // earliest shows first

    return shows;
  } catch (error) {
    throw error;
  }
};

// ── GET ONE ───────────────────────────────────────────────
export const getShowService = async (id) => {
  const show = await Show.findById(id)
    .populate("theatreId")
    .populate("movieId");
  if (!show)
    throw {
      err: "No show found for the given id",
      code: STATUS_CODES.NOT_FOUND,
    };
  return show;
};

// ── HARD DELETE ───────────────────────────────────────────
export const deleteShowService = async (id) => {
  const show = await Show.findByIdAndDelete(id);
  if (!show)
    throw {
      err: "No show found for the given id",
      code: STATUS_CODES.NOT_FOUND,
    };
  return show;
};

// ── SOFT DELETE (toggle isActive) ────────────────────────
export const updateShowStatusService = async (id, isActive) => {
  const show = await Show.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!show)
    throw {
      err: "No show found for the given id",
      code: STATUS_CODES.NOT_FOUND,
    };
  return show;
};

// ── UPDATE ────────────────────────────────────────────────
export const updateShowService = async (id, data) => {
  try {
    const show = await Show.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!show)
      throw {
        err: "No show found for the given id",
        code: STATUS_CODES.NOT_FOUND,
      };
    return show;
  } catch (error) {
    handleValidationError(error);
  }
};
