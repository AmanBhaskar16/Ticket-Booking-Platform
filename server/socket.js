import { Server } from "socket.io";

let io;

// ── Temporarily blocked seats (in-memory) ─────────────────
// { showId: { seatId: { userId, expiresAt } } }
const tempBlocked = {};
const BLOCK_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

// ── Init socket server ────────────────────────────────────
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL ?? "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        console.log("🔌 Socket connected:", socket.id);

        // User joins a show room to get real-time seat updates
        socket.on("join:show", (showId) => {
            socket.join(`show:${showId}`);
            // Send current temp blocked seats for this show
            const blocked = tempBlocked[showId] ?? {};
            socket.emit("seats:state", {
                showId,
                tempBlocked: Object.entries(blocked)
                    .filter(([, v]) => v.expiresAt > Date.now())
                    .map(([seat]) => seat)
            });
        });

        // User leaves show room
        socket.on("leave:show", (showId) => {
            socket.leave(`show:${showId}`);
        });

        // User is selecting seats (temp block)
        socket.on("seats:selecting", ({ showId, seats, userId }) => {
            if (!tempBlocked[showId]) tempBlocked[showId] = {};

            const now = Date.now();
            seats.forEach(seat => {
                tempBlocked[showId][seat] = {
                    userId,
                    socketId:  socket.id,
                    expiresAt: now + BLOCK_TIMEOUT_MS,
                };
            });

            // Broadcast to all others in this show room
            socket.to(`show:${showId}`).emit("seats:blocked", { showId, seats, userId });

            // Auto-release after timeout
            setTimeout(() => {
                releaseTempSeats(showId, seats, userId);
                io.to(`show:${showId}`).emit("seats:released", { showId, seats, userId });
            }, BLOCK_TIMEOUT_MS);
        });

        // User deselects seats
        socket.on("seats:deselecting", ({ showId, seats, userId }) => {
            releaseTempSeats(showId, seats, userId);
            socket.to(`show:${showId}`).emit("seats:released", { showId, seats, userId });
        });

        // On disconnect — release all temp blocks by this socket
        socket.on("disconnect", () => {
            console.log("🔌 Socket disconnected:", socket.id);
            releaseBySocket(socket.id);
        });
    });

    return io;
};

// ── Get io instance ───────────────────────────────────────
export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};

// ── Emit booking confirmed (from booking service) ─────────
export const emitBookingConfirmed = (showId, seats) => {
    if (!io) return;
    io.to(`show:${showId}`).emit("seats:booked", { showId, seats });
    // Clean up temp block
    if (tempBlocked[showId]) {
        seats.forEach(seat => delete tempBlocked[showId][seat]);
    }
};

// ── Emit booking cancelled (seats released) ───────────────
export const emitBookingCancelled = (showId, seats) => {
    if (!io) return;
    io.to(`show:${showId}`).emit("seats:released", { showId, seats });
};

// ── Helpers ───────────────────────────────────────────────
const releaseTempSeats = (showId, seats, userId) => {
    if (!tempBlocked[showId]) return;
    seats.forEach(seat => {
        if (tempBlocked[showId][seat]?.userId === userId) {
            delete tempBlocked[showId][seat];
        }
    });
};

const releaseBySocket = (socketId) => {
    Object.entries(tempBlocked).forEach(([showId, seats]) => {
        const toRelease = [];
        Object.entries(seats).forEach(([seat, data]) => {
            if (data.socketId === socketId) {
                toRelease.push(seat);
                delete tempBlocked[showId][seat];
            }
        });
        if (toRelease.length > 0) {
            io.to(`show:${showId}`).emit("seats:released", {
                showId, seats: toRelease
            });
        }
    });
};