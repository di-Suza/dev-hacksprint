const { verifyToken } = require("../utilities/token");
const Users = require("../models/user.model");
const { AppError } = require("../utilities/appError");
const { catchAsync } = require("../utilities/catchAsync");
const redis = require("../config/connectToRedis");

module.exports.isAuthenticated = catchAsync(async (req, res, next) => {
  try {
    // cookie extract
    const { accessToken, refreshToken } = req.cookies;

    const isBlacklisted = await redis.exists(`bl_${refreshToken}`);

    if (isBlacklisted) {
      return next(new AppError("Session expired. Please login again.", 401));
    }

    if (!accessToken) {
      return next(
        new AppError("Session expired or missing. Please refresh.", 401),
      );
    }

    // token verification
    let { data } = await verifyToken(accessToken);
    let cachedUser = await redis.get(`user_:${data.userId}`);

    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
    } else {
      const user = await Users.findById(data.userId)
        .select("_id userName email profilePicture")
        .lean();

      if (!user) return next(new AppError("User not found", 404));
      await redis.setex(`user_:${data.userId}`, 1800, JSON.stringify(user));
      req.user = user;
    }
    if (!req.user) {
      let options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      };
      res.clearCookie("accessToken", options);
      res.clearCookie("refreshToken", options);
      return next(new AppError("User not found.", 404));
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token Expired", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Security alert: Invalid session", 401));
    }
    return next(new AppError("Internal Server Error", 500));
  }
});
