const express = require("express");
const cors = require("cors");
const path = require("path");

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
  process.env.SERVER_URL,
  "https://dev-hacksprint.onrender.com",
  "https://devhacksprint.netlify.app",
  "http://localhost:8080",
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

const viewPath = path.join(__dirname, "..", "view");
app.use(express.static(viewPath));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(viewPath, "index.html"));
});

//global error
app.use(globalErrorHandler);

module.exports = app;
