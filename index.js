import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import movieRoutes from "./routes/movie.routes.js"

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("API is running...");
})

app.use("/api/v1/",movieRoutes);
app.listen(PORT,(req,res)=>{
    console.log(`Server is running at : http://localhost:${PORT}`);
    connectDB();
})