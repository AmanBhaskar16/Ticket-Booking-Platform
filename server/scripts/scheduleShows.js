// Run the auto-scheduler once by hand (the server also runs it every 6 hours):
//   npm run schedule
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { runAutoScheduler } from "../services/autoSchedule.service.js";

await connectDB();
const r = await runAutoScheduler();
console.log(r
    ? `${r.released} movie(s) released, ${r.created} shows created, ${r.pruned} old shows pruned`
    : "Another instance is running the scheduler right now");
await mongoose.disconnect();
