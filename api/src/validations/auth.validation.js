const { z, email } = require("zod");

const emailV = z.string().email("Invalid email address").trim().toLowerCase();
const password = z.string().min(8, "Password must be at least 8 chars");
const otp = z
  .string()
  .length(6, "OTP must be 6 digits")
  .regex(/^\d+$/, "OTP must be numeric");
const userName = z
  .string()
  .min(3, "Too short")
  .trim()
  .transform((v) => v.replace(/\s+/g, " "));
const token = z.string().jwt();

const emailSchema = z.object({ body: z.object({ email: emailV }) });
const loginSchema = z.object({ body: z.object({ email: emailV, password }) });
const sendOtpSchema = z.object({
  body: z.object({ email: emailV }),
});
const verifyAndRegisterSchema = z.object({
  body: z.object({ email: emailV, password, userName, otp }),
});
const emailAndOtpSchema = z.object({ body: z.object({ email: emailV, otp }) });
const newPasswordAndToken = z.object({
  body: z.object({ newPassword: password, token }),
});


module.exports = {
  sendOtpSchema,
  verifyAndRegisterSchema,
  loginSchema,
  emailSchema,
  emailAndOtpSchema,
  newPasswordAndToken,
};