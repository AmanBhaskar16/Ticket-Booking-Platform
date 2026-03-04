import Movie from "../models/movie.model.js";

import { createMovieService ,deleteMovieService, getMovieService} from "../services/movie.service.js";

import { errorResponseBody,successResponseBody } from "../utils/response.utils.js";

/**
 * Controller function to create a new movie
 * @param {*} req {name,description,duration,...}
 * @param {*} res {success/failure status}
 * @returns // Newly created movie
 */

export const createMovie =  async (req,res) => {
    try {
        const movie = await createMovieService(req.body);
        successResponseBody.message = "Movie added successfully";
        successResponseBody.data = movie;
        return res.status(201).json(successResponseBody);
    } catch (err) {
        console.log(err);
        errorResponseBody.err = err;
        return res.status(500).json(errorResponseBody);
    }
};

export const deleteMovie = async (req,res) => {
    try {
        const response = await deleteMovieService(req.params.id);
        successResponseBody.message = "Successfully deleted the movie.";
        successResponseBody.data = response;
        return res.status(200).json(successResponseBody);
    } catch (err) {
        console.log(err);
        errorResponseBody.err = err;
        return res.status(500).json(errorResponseBody);
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
        return res.status(200).json(successResponseBody);
    } catch (err) {
        console.log(err);
        errorResponseBody.err = err;
        return res.status(500).json(errorResponseBody);
    }
}
