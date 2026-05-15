require("dotenv").config();
const nodemailer = require("nodemailer");

const firstEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
};

const toBool = (value) => ["true", "1", "yes"].includes(String(value).toLowerCase());

const getMailConfig = () => {
  const host = firstEnv("SMTP_HOST", "MAIL_HOST");
  const port = Number(firstEnv("SMTP_PORT", "MAIL_PORT") || (host ? 587 : 465));
  const service = firstEnv("MAIL_SERVICE", "EMAIL_SERVICE") || "gmail";
  const user = firstEnv("SMTP_USER", "MAIL_USER", "EMAIL_USER", "SENDER_EMAIL");
  const rawPass = firstEnv("SMTP_PASS", "SMTP_PASSWORD", "MAIL_PASS", "EMAIL_PASS", "SENDER_PASSWORD");
  const isGmail = !host && service.toLowerCase() === "gmail";
  const pass = isGmail && rawPass ? rawPass.replace(/\s/g, "") : rawPass;

  if (!user || !pass) {
    throw new Error(
      "Email credentials missing. Set SENDER_EMAIL and SENDER_PASSWORD, or SMTP_USER and SMTP_PASS.",
    );
  }

  const fromAddress = firstEnv("SMTP_FROM", "MAIL_FROM", "EMAIL_FROM", "SENDER_EMAIL") || user;
  const fromName = firstEnv("MAIL_FROM_NAME", "EMAIL_FROM_NAME", "APP_NAME") || "DevHub";
  const from = fromAddress.includes("<")
    ? fromAddress
    : `${fromName} <${fromAddress}>`;

  if (host) {
    const secure = process.env.SMTP_SECURE
      ? toBool(process.env.SMTP_SECURE)
      : port === 465;

    return {
      from,
      transport: {
        host,
        port,
        secure,
        auth: { user, pass },
      },
    };
  }

  return {
    from,
    transport: {
      service,
      auth: { user, pass },
    },
  };
};

const buildOtpContent = (otp) => ({
  subject: "Your DevHub OTP code",
  text: `Your DevHub OTP is ${otp}. This code expires in 10 minutes.`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; color: #111827;">
      <p style="margin: 0 0 12px; font-size: 16px;">Hi,</p>
      <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.5;">Use this OTP to finish your DevHub signup.</p>
      <div style="display: inline-block; padding: 14px 22px; border-radius: 10px; background: #111827; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 4px;">
        ${otp}
      </div>
      <p style="margin: 18px 0 0; font-size: 14px; color: #4b5563;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
    </div>
  `,
});

const normalizeMailInput = (toOrOptions, subjectOrOtp, otp, htmlContent) => {
  if (typeof toOrOptions === "object" && toOrOptions !== null) {
    const options = toOrOptions;
    return {
      to: options.to || options.email,
      subject: options.subject,
      otp: options.otp || options.code,
      text: options.text,
      html: options.html || options.htmlContent,
    };
  }

  const isOtpOnlyCall =
    otp === undefined &&
    htmlContent === undefined &&
    typeof subjectOrOtp === "string" &&
    /^\d{6}$/.test(subjectOrOtp);

  return {
    to: toOrOptions,
    subject: isOtpOnlyCall ? undefined : subjectOrOtp,
    otp: isOtpOnlyCall ? subjectOrOtp : otp,
    html: htmlContent,
  };
};

const sendEmail = async (toOrOptions, subjectOrOtp, otp, htmlContent) => {
  const mailInput = normalizeMailInput(toOrOptions, subjectOrOtp, otp, htmlContent);

  if (!mailInput.to) {
    throw new Error("Email recipient is required.");
  }

  const otpContent = mailInput.otp ? buildOtpContent(mailInput.otp) : {};

  try {
    const { from, transport } = getMailConfig();
    const transporter = nodemailer.createTransport(transport);

    const mailOptions = {
      from,
      to: mailInput.to,
      subject: mailInput.subject || otpContent.subject || "DevHub notification",
      text: mailInput.text || otpContent.text,
      html: mailInput.html || otpContent.html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
