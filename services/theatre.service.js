import Movie from "../models/movie.model.js";
import Theatre from "../models/theatre.model.js";


export const addTheatreService = async (data) => {
  try {
    const {name, description, city, pincode, address, owner, movies} = data;
    // check duplicate theatre for owner
    const exists = await Theatre.findOne({ name,owner});
    if (exists) throw { err: "Theatre already exists for this owner", code: 409 };

    // validate movies exist
    const validMovies = await Movie.find({ _id: { $in: movies }}).select("_id");
    if (validMovies.length !== movies.length) throw { err: "Some movie IDs are invalid", code: 400 };

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