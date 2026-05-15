const express = require("express");
const controller = require("../controllers/auth.controller");
const ipLimiter = require("../middlewares/rateLimit.middleware");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  sendOtpSchema,
  verifyAndRegisterSchema,
  loginSchema,
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
  .post("/google", ipLimiter(), controller.google);

module.exports = authRouter;
