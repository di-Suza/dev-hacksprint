require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, otp, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: to,
      subject: subject,
      html: htmlContent || `<h1>Your OTP is: ${otp}</h1>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
