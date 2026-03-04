import Movie from "../models/movie.model.js";

export const createMovieService = async (movieData) => {

    const {name,description,casts,trailerUrl,languages,releaseDate,duration,posterUrl,genre,rating,certificate,director,releaseStatus} = movieData;
        
    const movie = await Movie.create({name,description,casts,trailerUrl,languages,releaseDate,duration,posterUrl,genre,rating,certificate,director,releaseStatus});
    return movie;
}

export const deleteMovieService = async (id) => {
    const response = await Movie.deleteOne({id});
    return response;
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