const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const joinRequestRoutes = require("./routes/joinRequestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const initializeSocket = require("./socket");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);


// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/matching", matchingRoutes);

app.use(
  "/api/join-requests",
  joinRequestRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "ProjXTeam API is running",
  });
});


// ==========================================
// CREATE HTTP SERVER
// ==========================================

const server = http.createServer(app);


// ==========================================
// INITIALIZE SOCKET.IO
// ==========================================

initializeSocket(server);


// ==========================================
// SERVER
// ==========================================

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(errorMiddleware);


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    server.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });