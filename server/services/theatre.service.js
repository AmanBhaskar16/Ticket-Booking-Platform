import Movie from "../models/movie.model.js";
import Theatre from "../models/theatre.model.js";
import { STATUS_CODES } from "../utils/constants.js";


export const addTheatreService = async (data) => {
  try {
    const {name, description, city, pincode, address, owner, movies} = data;
    // check duplicate theatre for owner
    const exists = await Theatre.findOne({ name,owner});
    if (exists) throw { err: "Theatre already exists for this owner", code: 409 };

    // validate movies exist
    if(movies && movies.length){
      const validMovies = await Movie.find({ _id: { $in: movies }}).select("_id");
      if (validMovies.length !== movies.length) throw { err: "Some movie IDs are invalid", code: 400 };
    }
    
    const theatre = await Theatre.create({
      name, description, city, pincode, address, owner, movies
    });

    return theatre;

  } catch (error) {
    if (error.name === "ValidationError") {
      const err = {};
      Object.keys(error.errors).forEach(key => {
        err[key] = error.errors[key].message;
      });
      throw { err, code: 422 }; // unprocessable entity
    } else {
      throw error; // let controller catch
    }
  }
};

export const deleteTheatreService = async (id) => {
  try {
    const response = await Theatre.findByIdAndDelete(id);
    if(!response){
      throw {
        err: "No record of a theatre found for the given id",
        code: STATUS_CODES.NOT_FOUND
      }
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateTheatreService = async (id, data) => {
  try {
    const response = await Theatre.findByIdAndUpdate(id, data, {
        new: true, runValidators: true
    });
    if(!response) {
      // no record found for the given id
      throw {
          err: "No theatre found for the given id",
          code: STATUS_CODES.NOT_FOUND
      }
    }
    return response;
    } catch (error) {
        if(error.name == 'ValidationError') {
          let err = {};
          Object.keys(error.errors).forEach((key) => {
              err[key] = error.errors[key].message;
          });
          throw {err: err, code: STATUS_CODES.UNPROCESSABLE_ENTITY}
        }
        throw error;
    }
}

export const getTheatreService = async (id) => {
  try {
    const response = await Theatre.findById(id);
    if(!response){
      // no record found for the given id
      throw {
        err: "No theatre found for the given id",
        code: STATUS_CODES.NOT_FOUND
      }
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getAllTheatresService = async (data) => {
  try{
    let query = {};
    let pagination = {};
    if(data && data.city) {
      // this checks whether city is present in query params or not
      query.city = data.city;
    } 
    if(data && data.pincode) {
      // this checks whether pincode is present in query params or not
      query.pincode = data.pincode;
    }
    if(data && data.name) {
      // this checks whether name is present in query params or not 
      query.name = {
      $regex: new RegExp(data.name, "i")
    };
    }

    if(data && data.movieId) {
      query.movies = data.movieId;
    }

    if(data && data.limit) {
      pagination.limit = data.limit;
    }
    
    if(data && data.page){
      const page = data.page || 1;
      const limit = data.limit || 10;

      pagination.limit = limit;
      pagination.skip = (page - 1)*limit;
    }
    const response = await Theatre.find(query, {}, pagination).lean(); // {pincode: 110031, movies: {$all: movie}}
    return response;
  } catch (error) {
      console.log(error);
      throw error;
  } 
}

export const updateMoviesInTheatreService = async (theatreId, movieIds, insert) => {
  try {
        let theatre;
        if (insert) {
            // we need to add movies
            theatre = await Theatre.findByIdAndUpdate(
                {_id: theatreId},
                {$addToSet: {movies: {$each: movieIds}}},
                {new: true}
            );
        } else {
            // we need to remove movies
            theatre = await Theatre.findByIdAndUpdate(
                {_id: theatreId},
                {$pull: {movies: {$in: movieIds}}},
                {new: true}
            );
        }
        if(!theatre){
        throw {
          code: STATUS_CODES.NOT_FOUND,
          err: "No theatre found for the given id"
        }
      }
        return theatre.populate('movies');
    } catch (error) {
        if(error.name == 'TypeError') {
            throw {
                code: STATUS_CODES.NOT_FOUND,
                err: 'No theatre found for the given id'
            }
        }
        console.log("Error is", error);
        throw error;
    }
}

export const getMoviesOfTheatreService = async (id) => {
   try {
        const theatre = await Theatre.findById(id, {name: 1, movies: 1, address: 1}).populate('movies');
        if(!theatre) {
            throw {
                err: 'No theatre with the given id found',
                code: STATUS_CODES.NOT_FOUND
            }
        }
        return theatre;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const checkMoviesInATheatreService = async (theatreId,movieId) => {
  try {
        let response = await Theatre.findById(theatreId);
        if(!response) {
            throw {
                err: "No such theatre found for the given id",
                code: STATUS_CODES.NOT_FOUND
            }
        }
        return response.movies.some(
          movie => movie.toString() === movieId
        );
    } catch (error) {
        console.log(error);
        throw error;
    }
}
