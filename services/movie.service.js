import Movie from "../models/movie.model.js";
import { STATUS_CODES } from "../utils/constants.js";

export const createMovieService = async (movieData) => {
    try {
        const {name,description,casts,trailerUrl,languages,releaseDate,duration,posterUrl,genre,rating,certificate,director,releaseStatus} = movieData;
        
        const movie = await Movie.create({name,description,casts,trailerUrl,languages,releaseDate,duration,posterUrl,genre,rating,certificate,director,releaseStatus});

        return movie;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            throw {err: err, code: STATUS_CODES.UNPROCESSABLE_ENTITY};
        } else {
            throw error;
        }
    
    }
}

export const deleteMovieService = async (id) => {
    try {
        const response = await Movie.findByIdAndDelete(id);
        if(!response) {
            throw {
                err: "No movie record found for the id provided",
                code: STATUS_CODES.NOT_FOUND
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getMovieService = async (id) => {
    const movie = await Movie.findById(id);
    if(!movie){
        return {
            err : "No movie found for the corresponding id provided",code : 404
        }
    }
    return movie;
}

export const updateMovieService = async (id,data) => {
    try {
        const movie = await Movie.findByIdAndUpdate(id, data, {new: true, runValidators: true});
        return movie;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            throw {err: err, code: STATUS_CODES.UNPROCESSABLE_ENTITY};
        } else {
            throw error;
        }
    }
}

export const updateMovieStatusService = async (id, status) => {
    const movie = await Movie.findByIdAndUpdate(
        id,
        { isActive: status },
        { new: true }
    );

    if (!movie) {
        throw {
            err: "Movie not found",
            code: STATUS_CODES.NOT_FOUND
        };
    }

    return movie;
};

export const fetchMoviesService = async (filter) => {
    try {

        const { name, genre, languages, releaseStatus, page = 1, limit = 10, sortBy = "releaseDate" } = filter;

        let query = {
            isActive: true
        };

        // Name search (case insensitive)
        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        // Genre filter
        if (genre) {
            query.genre = genre;
        }

        // Language filter
        if (languages) {
            query.languages = languages;
        }

        // Release status filter
        if (releaseStatus) {
            query.releaseStatus = releaseStatus;
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // Pagination
        const skip = (pageNumber - 1)*limitNumber;

        const movies = await Movie.find(query)
            .sort({ [sortBy]: -1 })
            .skip(skip)
            .limit(limitNumber);

        return movies;

    } catch (error) {
        console.log(error);
        throw {
            err: "Failed to fetch movies",
            code: STATUS_CODES.INTERNAL_SERVER_ERROR
        };
    }
};