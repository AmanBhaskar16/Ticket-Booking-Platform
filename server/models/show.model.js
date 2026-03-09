import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Theatre'
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movie'
    },
    showTime : {
        type: Date,
        required: true
    },
    noOfSeats : {
        type: Number,
        required: true
    },
    seatConfiguration: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    format: {
        type: String,
        enum: ["2D","3D","IMAX","4DX"],
        default : "2D"
    }
}, {timestamps: true});

showSchema.index({theatreId: 1,movieId: 1,showTime: 1});

const Show = mongoose.model('Show', showSchema);

export default Show;