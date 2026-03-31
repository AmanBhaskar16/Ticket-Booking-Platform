import express    from "express";
import dotenv     from "dotenv";
import cors       from "cors";
import http       from "http";
import connectDB  from "./config/db.js";
import { initSocket } from "./socket.js";
import { expireStaleBookingsService } from "./services/booking.service.js";

import movieRoutes   from "./routes/movie.routes.js";
import authRoutes    from "./routes/auth.routes.js";
import userRoutes    from "./routes/user.routes.js";
import theatreRoutes from "./routes/theatre.routes.js";
import showRoutes    from "./routes/show.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({
    origin:      process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/v1", movieRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", theatreRoutes);
app.use("/api/v1", showRoutes);
app.use("/api/v1", bookingRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", uploadRoutes);

// ── HTTP Server + Socket.io ───────────────────────────────
const httpServer = http.createServer(app);
initSocket(httpServer);

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, async () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    await connectDB();

    // ── Cron: expire stale bookings every 5 minutes ───────
    // Releases seats of abandoned bookings (payment not completed)
    setInterval(async () => {
        try {
            const count = await expireStaleBookingsService();
            if (count > 0) console.log(`⏰ Expired ${count} stale booking(s)`);
        } catch (e) {
            console.error("Cron error:", e.message);
        }
    }, 5 * 60 * 1000); // every 5 minutes
});