const rateLimit = require("express-rate-limit");

const ipLimiter = (max = 5) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: max,
    message: {
      success: false,
      message: "Too many attempts. Please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = ipLimiter;