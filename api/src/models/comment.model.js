const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, "Comment cannot be empty"],
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Content id required!"],
      refPath: "contentModel",
      index: true,
    },
    contentModel: {
      type: String,
      required: true,
      enum: ["Project", "Blog"],
    },
    contentType: {
      type: String,
      required: true,
      enum: ["project", "blog"],
      index: true,
    },
    contentOwner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      select: false,
    },
    postOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      select: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ content: 1, contentType: 1, createdAt: -1 });

const Comments = mongoose.model("Comment", commentSchema, "comments");

module.exports = Comments;
