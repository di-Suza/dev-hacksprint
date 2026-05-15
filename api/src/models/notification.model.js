const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["LIKE", "FOLLOW", "COMMENT"],
      required: true,
    },
    contentId: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" },
    onModel: { type: String, enum: ["Project", "Blog", "User"] },
    contentType: {
      type: String,
      enum: ["project", "blog", "user"],
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notifications = mongoose.model(
  "Notification",
  notificationSchema,
  "notifications",
);

module.exports = Notifications;
