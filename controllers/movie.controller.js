import { createMovieService ,deleteMovieService, fetchMoviesService, getMovieService, updateMovieService, updateMovieStatusService} from "../services/movie.service.js";

import { errorResponseBody,successResponseBody } from "../utils/response.utils.js";

import { STATUS_CODES } from "../utils/constants.js";

export const createMovie =  async (req,res) => {
    try {
        const movie = await createMovieService(req.body);
        successResponseBody.message = "Movie added successfully";
        successResponseBody.data = movie;
        return res.status(STATUS_CODES.CREATED).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

export const deleteMovie = async (req,res) => {
    try {
        const response = await deleteMovieService(req.params.id);
        successResponseBody.message = "Successfully deleted the movie.";
        successResponseBody.data = response;
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

export const getMovie = async (req,res) => {
    try {
        const movieDetails = await getMovieService(req.params.id);

        if(movieDetails.err){
            errorResponseBody.err = movieDetails.err;
            return res.status(movieDetails.code).json(errorResponseBody);
        }
        successResponseBody.data = movieDetails;
        successResponseBody.message = "Fetched movie details.";
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

export const updateMovie = async (req,res) => {
    try {
        const movie = await updateMovieService(req.params.id,req.body);
        if(movie.err){
            errorResponseBody.err = movie.err;
            return res.status(movie.code).json(errorResponseBody);
        }
        successResponseBody.data = movie;
        successResponseBody.message = "Movie updated successfully.";
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (err) {
        console.log(err);
        errorResponseBody.err = err;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

export const updateMovieStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        const movie = await updateMovieStatusService(req.params.id, isActive);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Movie status updated successfully",
            data: movie
        });

    } catch (error) {

        if(error.err){
            return res.status(error.code).json({
                success: false,
                error: error.err
            });
        }

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: "Internal server error"
        });
    }
};

export const getMovies = async (req,res) => {
    try {
        const response = await fetchMoviesService(req.query);
        successResponseBody.data = response;
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

