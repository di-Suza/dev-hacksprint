const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Content id required!"],
      refPath: "contentModel",
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
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      select: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User id required!"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

likeSchema.index(
  {
    content: 1,
    contentType: 1,
    user: 1,
  },
  { unique: true },
);

const Likes = mongoose.model("Like", likeSchema, "likes");
module.exports = Likes;
