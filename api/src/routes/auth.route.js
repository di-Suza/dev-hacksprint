const express = require("express");
const controller = require("../controllers/auth.controller");
const ipLimiter = require("../middlewares/rateLimit.middleware");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  sendOtpSchema,
  verifyAndRegisterSchema,
  loginSchema,
  emailSchema,
  emailAndOtpSchema,
  newPasswordAndToken,
} = require("../validations/auth.validation");

const authRouter = express.Router();

authRouter

  // refresh Token
  .post("/refresh", controller.refreshToken)

  // send OTP for register
  .post("/sendOtp", ipLimiter(), validate(sendOtpSchema), controller.sendOtp)

  //verify OTP and register
  .post(
    "/verifyAndRegister",
    ipLimiter(),
    validate(verifyAndRegisterSchema),
    controller.verifyAndRegister,
  )

  // login user
  .post("/login", ipLimiter(), validate(loginSchema), controller.login)

  // get me
  .get("/me", isAuthenticated, controller.getMe)

  // logout user
  .post("/logout",isAuthenticated, controller.logout)

  // google login/register
  .post("/google", ipLimiter(), controller.google)

  // Forgot Password - send OTP/ verify OTP/ update Password
  .post(
    "/sendOtpForForgotPassword",
    ipLimiter(),
    validate(emailSchema),
    controller.sendOtpForForgotPassword,
  )
  .post(
    "/verifyOtpForForgotPassword",
    ipLimiter(),
    validate(emailAndOtpSchema),
    controller.verifyOtpForForgotPassword,
  )
  .post(
    "/updateNewPassword_ForgotPassword",
    ipLimiter(),
    validate(newPasswordAndToken),
    controller.updateNewPassword_ForgotPassword,
  );

module.exports = authRouter;