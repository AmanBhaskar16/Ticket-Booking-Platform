import Show from "../models/show.model.js";
import Theatre from "../models/theatre.model.js";
import { STATUS_CODES } from "../utils/constants.js";

/**
 *
 * @param data -> object containing details of the show to be created
 * @returns -> object with the new show details
 */
export const createShowService = async (data) => {
  try {
    const theatre = await Theatre.findById(data.theatreId);
    if (!theatre) {
      throw {
        err: "No theatre found",
        code: STATUS_CODES.NOT_FOUND,
      };
    }
    if (theatre.movies.indexOf(data.movieId) == -1) {
      throw {
        err: "Movie is currently not available in the requested theatre",
        code: STATUS_CODES.NOT_FOUND,
      };
    }
    const response = await Show.create(data);
    return response;
  } catch (error) {
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw {
        err,
        code: STATUS_CODES.UNPROCESSABLE_ENTITY,
      };
    }
    throw error;
  }
};

export const getShowsService = async (data) => {
  try {
    let filter = {};
    if (data.theatreId) {
      filter.theatreId = data.theatreId;
    }
    if (data.movieId) {
      filter.movieId = data.movieId;
    }
    const response = await Show.find(filter)
      .populate("theatreId")
      .populate("movieId");
    if (response.length === 0) {
      throw {
        err: "No shows found",
        code: STATUS_CODES.NOT_FOUND,
      };
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteShowService = async (id) => {
  try {
    const response = await Show.findByIdAndDelete(id);
    if (!response) {
      throw {
        err: "No show found",
        code: STATUS_CODES.NOT_FOUND,
      };
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateShowService = async (id, data) => {
  try {
    const response = await Show.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      throw {
        err: "No show found for the given id",
        code: STATUS_CODES.NOT_FOUND,
      };
    }
    return response;
  } catch (error) {
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw {
        err,
        code: STATUS_CODES.UNPROCESSABLE_ENTITY,
      };
    }
    throw error;
  }
};
