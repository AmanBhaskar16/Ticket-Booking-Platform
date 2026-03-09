
import { addTheatreService, checkMoviesInATheatreService, deleteTheatreService, getAllTheatresService, getMoviesOfTheatreService, getTheatreService, updateMoviesInTheatreService, updateTheatreService } from "../services/theatre.service.js";

import { STATUS_CODES } from "../utils/constants.js";

import { errorResponseBody, successResponseBody } from "../utils/response.utils.js";

export const addTheatre = async (req, res) => {
  try {
    const theatre = await addTheatreService(req.body);

    successResponseBody.message = "Theatre added successfully";
    successResponseBody.data = theatre;
    return res.status(STATUS_CODES.CREATED).json(successResponseBody);

  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }
};

export const deleteTheatre = async (req, res) => {
  try {
    const response = await deleteTheatreService(req.params.id);
    successResponseBody.data = response;
    successResponseBody.message = "Movie deleted successfully";
    return res.status(STATUS_CODES.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }
};

export const updateTheatre = async (req, res) => {
  try {
    const response = await updateTheatreService(req.params.id,req.body);
    successResponseBody.data = response;
    successResponseBody.message = "Movie updated successfully";
    return res.status(STATUS_CODES.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }
};

export const getTheatre = async (req, res) => {
  try {
    const response = await getTheatreService(req.params.id);
    successResponseBody.data = response;
    successResponseBody.message = "Theatre fetched successfully";
    return res.status(STATUS_CODES.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }
};

export const getTheatres = async (req, res) => {
  try {
    const response = await getAllTheatresService(req.query);
    successResponseBody.data = response;
    successResponseBody.message = "All theatres fetched successfully";
    return res.status(STATUS_CODES.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }
};

export const updateMovies = async (req, res) => {
  try {
    const response = await updateMoviesInTheatreService(req.params.id,req.body.movieIds,req.body.insert);
    successResponseBody.data = response;
    successResponseBody.message = "Movie successfully updated inside theatre";
    return res.status(STATUS_CODES.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }
};

export const getMovies = async (req, res) => {
  try {
    const response = await getMoviesOfTheatreService(req.params.id);
    successResponseBody.data = response;
    successResponseBody.message = "Movies successfully fetched for the theatre";
    return res.status(STATUS_CODES.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }
};

export const checkMovies = async (req, res) => {
  try {
    const response = await checkMoviesInATheatreService(req.params.theatreId,req.params.movieId);
    successResponseBody.data = response;
    successResponseBody.message = "Successfully checked if movie is present in the theatre";
    return res.status(STATUS_CODES.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }
};
