require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");

const connectToDB = require("./config/db");
connectToDB();

// Import Routers (API)
const userRouter = require("./routes/user.routes");
const fileRouter = require("./routes/file.routes");
const uploadRouter = require("./routes/upload.routes");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS for React Frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// REMOVE EJS & STATIC — no UI rendered by backend
// ❌ app.set("view engine", "ejs");
// ❌ app.use(express.static(path.join(__dirname, "public")));

// API ROUTES
app.use("/api/user", userRouter);
app.use("/api/file", fileRouter);
app.use("/api/upload", uploadRouter);

// Central error handler (including Multer errors)
// This ensures file-size errors send a clean JSON response instead of crashing the request
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Please upload a smaller file." });
    }

    return res.status(400).json({ error: err.message });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Internal server error" });
});

// ERROR HANDLER
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// START SERVER
app.listen(5000, () => console.log("API Server running on port 5000"));
