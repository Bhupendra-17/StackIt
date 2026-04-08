const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/auth");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set("io", io);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/answer", require("./routes/answer"));
app.use("/api/notifications", require("./routes/notifications"));

app.get("/", (_req, res) => {
  res.send("StackIt API is running");
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You have accessed a protected route",
    user: req.user,
  });
});

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    if (!userId) {
      return;
    }

    socket.join(`user:${userId}`);
  });

  socket.on("notify", ({ userId, payload }) => {
    if (!userId || !payload) {
      return;
    }

    io.to(`user:${userId}`).emit("notification", payload);
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

