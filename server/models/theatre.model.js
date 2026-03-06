import mongoose from "mongoose";
import { maxLength, minLength } from "zod";

const theatreSchema = new mongoose.Schema({
  name: { 
        type: String, 
        required: true, 
        trim: true, 
        minLength: 5, 
        index: true 
    },
  description: { 
        type: String, 
        default: "" 
    },
  city: { 
        type: String, 
        required: true, 
        trim: true, 
        index: true 
    },
  pincode: { 
        type: Number, 
        required: true, 
        min: 100000, 
        max: 999999 
    },
  address: { 
        type: String, 
        required : true,
        trim : true,
        minLength : 4,
        maxLength : 50,
        default: "" 
    },
  owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true 
    },
  movies: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Movie' 
    }],
  isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

// Indexes for performance
theatreSchema.index({ city: 1, isActive: 1 });
theatreSchema.index({ name: "text", description: "text" });

const Theatre = mongoose.model('Theatre', theatreSchema);

export default Theatre;