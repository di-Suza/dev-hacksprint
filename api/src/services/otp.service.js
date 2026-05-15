const crypto = require("crypto");
const { generateHash, compareHash } = require("../utilities/password");
const sendEmail = require("../utilities/sendEmail");
const OTP = require("../models/otp.model");
const { AppError } = require("../utilities/appError");

module.exports.sendAndSaveOtp = async (email, currentCount) => {
  const now = new Date();

  // Generate & Hash OTP
  const rawOtp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = await generateHash(rawOtp);

  const updatedOtpRecord = await OTP.findOneAndUpdate(
    { email },
    {
      $set: {
        otp: hashedOtp,
        lastResendTime: now,
        otpCount: currentCount + 1,
        verifyAttempts: 0,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  //Send Email
  try {
    await sendEmail(email, rawOtp);
  } catch (mailError) {
    await OTP.updateOne({ email }, { $inc: { otpCount: -1 } });
    throw new AppError("Email delivery failed!", 500);
  }

  return updatedOtpRecord;
};

module.exports.verifyOtp = async (email, otp) => {
  //check
  const otpExists = await OTP.findOne({ email });
  if (otpExists) {
    //first check verifyAttempts
    if (otpExists.verifyAttempts > 3) {
      await OTP.deleteOne({ email });
      throw new AppError(
        "Too many requests. Please try again with new OTP after 10 minutes",
        429,
      );
    }
  } else {
    // if otp doesn't exists it means the otp expired and automatically deleted from the collection
    throw new AppError("OTP Expired!", 410);
  }

  let otpMatched = await compareHash(otp, otpExists.otp);

  return { otpMatched, verifyAttempts: otpExists.verifyAttempts };
};
