import Movie from "../models/movie.model.js";

export const createMovieService = async (movieData) => {
    
    const {name,description,casts,trailerUrl,language,releaseDate,duration,posterUrl,genre,rating,certificate,director,releaseStatus} = movieData;
        
    const movie = await Movie.create({name,description,casts,trailerUrl,language,releaseDate,duration,posterUrl,genre,rating,certificate,director,releaseStatus});
    return movie;
}