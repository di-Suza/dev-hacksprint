const express = require("express");
const cors = require("cors");

const allRoutes = require("./routes/index");

const cookieParser = require("cookie-parser");
const {
  default: globalErrorHandler,
} = require("./middlewares/globalError.middleware");

const app = express();
app.set("trust proxy", 1); //for rate-limiter - IP origin trust
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://devhacksprint.netlify.app",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // for cookies
  }),
);

// all routes
app.use("/api", allRoutes);

//global error
app.use(globalErrorHandler);

module.exports = app;
