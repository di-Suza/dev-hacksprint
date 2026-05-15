const { z } = require("zod");

const emailV = z.string().email("Invalid email address").trim().toLowerCase();
const password = z.string().min(8, "Password must be at least 8 chars");
const otp = z
  .string()
  .length(6, "OTP must be 6 digits")
  .regex(/^\d+$/, "OTP must be numeric");
const userName = z
  .string()
  .trim()
  .min(3, "User name must be at least 3 chars")
  .transform((v) => v.replace(/\s+/g, " "));
const loginSchema = z.object({ body: z.object({ email: emailV, password }) });
const sendOtpSchema = z.object({
  body: z.object({ email: emailV }),
});
const verifyAndRegisterSchema = z.object({
  body: z.object({ email: emailV, password, userName, otp }),
});
module.exports = {
  sendOtpSchema,
  verifyAndRegisterSchema,
  loginSchema,
};
