const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: [true, "Account already exists with this email."],
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, select: false },
    profilePicture: {
      url: {
        type: String,
        default:
          "https://ik.imagekit.io/goldstains/Developer/ProfilePictures/defaultpp.webp",
      },
      fileId: {
        type: String,
        default: "0",
      },
    },

    //portfolio info
    headline: { type: String, default: "" },
    about: { type: String, default: "" },
    skills: { type: [String], default: [] },
    experiences: {
      type: [
        {
          companyName: { type: String, default: "" },
          timePeriod: { type: String, default: "" },
        },
      ],
      default: [],
    },
    educations: {
      type: [
        {
          collegeName: { type: String, default: "" },
          timePeriod: { type: String, default: "" },
          course: { type: String, default: "" },
        },
      ],
      default: [],
    },
    interests: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    projectsCount: { type: Number, default: 0 },
    blogsCount: { type: Number, default: 0 },
    socialLinks: {
      github: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      x: {
        type: String,
        default: "",
      }, 
      youtube: {
        type: String,
        default: "",
      },
      portfolio: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
    },

    lastLoginAt: { type: Date, default: Date.now },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    //is Google User
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    // for avoiding spamming
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Number,
      default: null,
      select: false,
    },
  },
  // for removing password by default
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.lockUntil;
        delete ret.loginAttempts;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.lockUntil;
        delete ret.loginAttempts;
        return ret;
      },
    },
  },
);

const Users = mongoose.model("User", userSchema, "users");
module.exports = Users;
