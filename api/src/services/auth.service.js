const redis = require("../config/connectToRedis");
const Users = require("../models/user.model");
const OTP = require("../models/otp.model");
const { AppError } = require("../utilities/appError");
const { verifyToken, generateToken } = require("../utilities/token");
const { sendAndSaveOtp, verifyOtp } = require("./otp.service");
const { generateHash, compareHash } = require("../utilities/password");

//google oauth
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage",
);

module.exports.getRefreshToken = async (token) => {
  if (!token || (await redis.exists(`bl_${token}`))) {
    throw new AppError("Session expired, please login again", 401);
  }
  let { data } = await verifyToken(token);
  let newAccessToken = await generateToken({ userId: data.userId }, "15m");
  return newAccessToken;
};

module.exports.sendRegistrationOtp = async (email) => {
  // User Existence Check
  const userExists = await Users.findOne({ email });
  if (userExists) {
    if (userExists.isGoogleUser && !userExists.password) {
      throw new AppError(
        "This email is already registered via Google. Please login with Google!",
        400,
      );
    }
    throw new AppError("User already exists! Please login", 409);
  }
  // Fetch OTP Record
  let otpData = await OTP.findOne({ email });
  const now = new Date();
  let currentCount = 0;

  if (otpData) {
    // Rate Limiting Logic 10-minute window
    const diffInMinutes = Math.floor(
      (now - otpData.lastResendTime) / (1000 * 60),
    );

    if (diffInMinutes < 10) {
      if (otpData.otpCount >= 3) {
        throw new AppError(
          `Too many requests. Please try again after ${10 - diffInMinutes} minutes.`,
          429,
        );
      }
      currentCount = otpData.otpCount;
    } else {
      currentCount = 0;
    }
  }

  // using otp service [current count is number of otps user requested in last 10 min ]
  const updatedOtpRecord = await sendAndSaveOtp(email, currentCount);

  return updatedOtpRecord.otpCount;
};

module.exports.verifyOtpAndRegister = async (userData) => {
  const { email, otp, password, userName } = userData;

  // User Existence Check
  const userExists = await Users.findOne({ email });
  if (userExists) {
    if (userExists.isGoogleUser && !userExists.password) {
      throw new AppError(
        "This email is already registered via Google. Please login with Google!",
        409,
      );
    }
    throw new AppError("User already exists! Please login", 409);
  }

  //verify otp service
  let { otpMatched, verifyAttempts } = await verifyOtp(email, otp);

  if (otpMatched) {
    // if otp matched
    // create hash for password
    let passwordHash = await generateHash(password);
    // create user
    let user = await Users.create({
      userName,
      email,
      password: passwordHash,
    });
    //delete otp
    await OTP.deleteOne({ email });
    // access & refresh token and sign
    let payload = { userId: user._id };
    let [accessToken, refreshToken] = await Promise.all([
      generateToken(payload, "15m"),
      generateToken(payload, "7d"),
    ]);

    return { user, accessToken, refreshToken };
  } else {
    // if otp not matched, then we'll check that how many times user attempted to verify the otp
    // if its 4th request for verify otp
    // and 3 otp attempts completed then it will block the user to send more requests for OTP verification
    await OTP.updateOne(
      { email },
      { $set: { verifyAttempts: verifyAttempts + 1 } },
    );
    throw new AppError("OTP not matched!", 401);
  }
};

module.exports.loginUser = async ({ email, password }) => {
  const user = await Users.findOne({ email }).select(
    "+password +lockUntil +loginAttempts",
  ); // otherwise it will not get password hash from db
  if (!user) throw new AppError("Invalid email or password", 401);

  // checking if user is a google user
  if (user && user.isGoogleUser && !user.password)
    throw new AppError(
      "This account is linked with Google. Please use Google Login!",
      401,
    );

  // check if account is currently locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    //after 15 min account will unlock becoz this condition will be true for 15 mins
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new AppError(
      `Account is locked due to too many failed attempts. Try again in ${remainingTime} minutes.`,
      403,
    );
  }

  // check password
  const isMatch = await compareHash(password, user.password);
  if (!isMatch) {
    //increase login attempts
    user.loginAttempts += 1;
    // if 5 attempts done, then lock
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000; // 15min
      user.loginAttempts = 0; // reset attempts for next cycle
      await user.save();
      throw new AppError(
        "Too many failed attempts. Your account has been locked for 15 minutes.",
        403,
      );
    }
    await user.save();
    throw new AppError("Invalid email or password", 401);
  }

  // token, cookie & update last login status
  let payload = { userId: user._id };
  let [accessToken, refreshToken] = await Promise.all([
    generateToken(payload, "15m"),
    generateToken(payload, "7d"),
  ]);

  user.lastLoginAt = new Date();
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

module.exports.googleSign = async (code) => {
  //get token from code
  const { tokens } = await client.getToken(code);
  //token verification
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  //get user details
  const { email, name, picture, email_verified } = ticket.getPayload();

  if (!email_verified) {
    // sometimes it will be false!
    throw new AppError("Google email not verified", 400);
  }

  // check if already present
  let user = await Users.findOne({ email });
  if (user) {
    if (user.isGoogleUser) {
      user.lastLoginAt = new Date();
      user.isGoogleUser = true;
      await user.save();
    } else {
      throw new AppError(
        "This email is already registered. Please login with email and password!",
        400,
      );
    }
  } else {
    user = (
      await Users.create({
        userName: name,
        email: email,
        profilePicture: { url: picture, fileId: "0" },
        isGoogleUser: true,
      })
    ).toObject();
    user.isNew = true;
  }

  //access+refresh token
  let payload = { userId: user._id };
  let [accessToken, refreshToken] = await Promise.all([
    generateToken(payload, "15m"),
    generateToken(payload, "2d"),
  ]);

  return {
    user: { ...user._doc },
    accessToken,
    refreshToken,
  };
};
