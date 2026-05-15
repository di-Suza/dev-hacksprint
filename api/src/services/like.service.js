const Blog = require("../models/blog.model");
const Likes = require("../models/like.model");
const Project = require("../models/project.model");
const notificationServices = require("./notification.service");
const { AppError } = require("../utilities/appError");

const contentConfig = {
  project: {
    model: Project,
    modelName: "Project",
  },
  blog: {
    model: Blog,
    modelName: "Blog",
  },
};

async function getContentOrThrow(contentType, contentId, userId) {
  const config = contentConfig[contentType];

  if (!config) {
    throw new AppError("Invalid content type", 400);
  }

  const content = await config.model.findById(contentId);

  if (!content) {
    throw new AppError("Content not found!", 404);
  }

  if (
    contentType === "blog" &&
    !content.isPublished &&
    content.user.toString() !== userId.toString()
  ) {
    throw new AppError("Content not found!", 404);
  }

  return { config, content };
}

async function getLikeCount(config, contentId) {
  const content = await config.model.findById(contentId).select("likeCount");
  return content?.likeCount || 0;
}

module.exports.likeContent = async (userId, contentType, contentId) => {
  const { config, content } = await getContentOrThrow(
    contentType,
    contentId,
    userId,
  );

  try {
    await Likes.create({
      content: contentId,
      contentModel: config.modelName,
      contentType,
      post: contentId,
      user: userId,
    });
  } catch (error) {
    if (error.code === 11000) {
      return {
        isLiked: true,
        likeCount: await getLikeCount(config, contentId),
      };
    }

    throw error;
  }

  const updatedContent = await config.model
    .findByIdAndUpdate(
      contentId,
      { $inc: { likeCount: 1 } },
      { new: true, select: "likeCount" },
    )
    .lean();

  await notificationServices.send({
    senderId: userId,
    recipientId: content.user,
    type: "LIKE",
    contentId,
    onModel: config.modelName,
  });

  return {
    isLiked: true,
    likeCount: updatedContent?.likeCount || 0,
  };
};

module.exports.unlikeContent = async (userId, contentType, contentId) => {
  const { config, content } = await getContentOrThrow(
    contentType,
    contentId,
    userId,
  );

  const deletedLike = await Likes.findOneAndDelete({
    content: contentId,
    contentType,
    user: userId,
  });

  if (!deletedLike) {
    return {
      isLiked: false,
      likeCount: await getLikeCount(config, contentId),
    };
  }

  const updatedContent = await config.model
    .findOneAndUpdate(
      { _id: contentId, likeCount: { $gt: 0 } },
      { $inc: { likeCount: -1 } },
      { new: true, select: "likeCount" },
    )
    .lean();

  await notificationServices.remove({
    senderId: userId,
    recipientId: content.user,
    type: "LIKE",
    contentId,
  });

  return {
    isLiked: false,
    likeCount: updatedContent?.likeCount || 0,
  };
};

module.exports.hasUserLiked = async (userId, contentType, contentId) => {
  const like = await Likes.exists({
    content: contentId,
    contentType,
    user: userId,
  });

  return Boolean(like);
};
