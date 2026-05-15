const Users = require("../models/user.model");
const { verifyToken } = require("../utilities/token");
const { AppError } = require("../utilities/appError");
const { catchAsync } = require("../utilities/catchAsync");
const sendAuthCookies = require("../utilities/cookies");

//services
const authServices = require("../services/auth.service");
const tokenServices = require("../services/token.service");
const userServices = require("../services/user.service");
const redisServices = require("../services/redis.service");

module.exports.refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  try {
    const newAccessToken = await authServices.getRefreshToken(token);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ success: true, message: "Session Renewed!" });
  } catch (err) {
    return next(new AppError("Invalid/Expired Refresh Token", 401));
  }
});

module.exports.sendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  let updatedRemainingOtpCounts = await authServices.sendRegistrationOtp(email);

  // success response
  return res.status(201).json({
    success: true,
    message: "OTP sent successfully",
    data: {
      email,
      remainingAttempts: 3 - updatedRemainingOtpCounts,
      expiresIn: "10 minutes",
    },
  });
});

module.exports.verifyAndRegister = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } =
    await authServices.verifyOtpAndRegister(req.body);

  sendAuthCookies(res, accessToken, refreshToken);

  return res.status(201).json({
    success: true,
    message: "Account Created successfully",
    user,
  });
});

module.exports.login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authServices.loginUser(
    req.body,
  );

  sendAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: `Welcome back, ${user.userName}`,
    user,
  });
});

module.exports.getMe = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const user = await Users.findById(userId).lean();

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    success: true,
    message: "User Fetched Successfully",
    user,
  });
});

module.exports.logout = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await tokenServices.blacklistToken(refreshToken);
  }

  await redisServices.deleteUserFromRedis(userId);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
      success: true,
      message: "Logged out successfully!",
    });
});

module.exports.google = catchAsync(async (req, res) => {
  const { code } = req.body;

  const { user, accessToken, refreshToken } =
    await authServices.googleSign(code);

  sendAuthCookies(res, accessToken, refreshToken);
  return res
    .status(user.isNew ? 201 : 200) // 201 if created, 200 if
    .json({
      success: true,
      message: user.isNew
        ? "Account Created Successfully!"
        : `Welcome back, ${user.userName}`,
      user,
    });
});
