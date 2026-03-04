import Movie from "../models/movie.model.js";
import { createMovieService } from "../services/movie.service.js";

/**
 * Controller function to create a new movie
 * @param {*} req {name,description,duration,...}
 * @param {*} res {success/failure status}
 * @returns // Newly created movie
 */
export const createMovie =  async (req,res) => {
    try {
        const movie = await createMovieService(req.body);

        return res.status(201).json({
            success : true,
            error : {},
            message : "Movie added successfully",
            data : movie
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success : false,
            error : err,
            data : {},
            message : "Internal server error"
        })
    }
};

