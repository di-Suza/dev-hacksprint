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
app.use(
  cors({
    origin: "https://devhacksprint.netlify.app",
    // origin: "http://localhost:5173",
    credentials: true, // for cookies
  }),
);

// all routes
app.use("/api", allRoutes);

//global error
app.use(globalErrorHandler);

module.exports = app;