const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Case sensitivity errors se bachne ke liye
  },
  otp: {
    type: String,
    required: true,
  },
  // Rate Limiting Fields
  otpCount: {
    type: Number,
    default: 1,
  },
  verifyAttempts: {
    type: Number,
    default: 0,
  },
  lastResendTime: {
    type: Date,
    default: Date.now,
    index: { expires: "10m" },
  },
  // Expiry Configuration
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OTP = mongoose.model("Otp", otpSchema, "otps");

module.exports = OTP;