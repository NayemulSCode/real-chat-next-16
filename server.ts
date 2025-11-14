// server.ts
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // CRITICAL FIX: Let Socket.IO handle its own requests
    // Don't return early - let the request pass through
    handle(req, res);
  });

  const io = new Server(server, {
    path: "/api/socket.io",
    cors: {
      origin: dev ? "*" : "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"], // Explicitly set transports
  });

  // SOCKET EVENTS
  io.on("connection", (socket) => {
    console.log("✅ A user connected", socket.id);

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`📌 User ${socket.id} joined room: "${room}"`);
      console.log(
        `👥 Users in room "${room}":`,
        Array.from(io.sockets.adapter.rooms.get(room) || [])
      );
      // Notify others in the room (not the sender)
      socket.to(room).emit("user-joined", socket.id);
    });

    socket.on("send-message", ({ room, message }) => {
      console.log(`📨 Message from ${socket.id} in room ${room}:`, message);

      // CRITICAL FIX: Use socket.to(room) to exclude sender
      // or io.to(room) to include sender
      // Since you're adding locally in client, use socket.to()
      socket.to(room).emit("new-message", {
        message,
        senderId: socket.id,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("typing", ({ room, user }) => {
      socket.to(room).emit("user-typing", user);
    });

    socket.on("stop-typing", ({ room, user }) => {
      socket.to(room).emit("user-stop-typing", user);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log(
      `> Socket.IO listening on http://localhost:${PORT}/api/socket.io`
    );
  });
});
