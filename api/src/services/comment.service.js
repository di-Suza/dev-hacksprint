const Blog = require("../models/blog.model");
const Comments = require("../models/comment.model");
const Project = require("../models/project.model");
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

function decorateComment(comment, currentUserId) {
  const plainComment = comment.toObject ? comment.toObject() : comment;
  const commenterId = plainComment.user?._id || plainComment.user;
  const ownerId = plainComment.contentOwner;
  const currentId = currentUserId.toString();

  return {
    ...plainComment,
    canDelete:
      commenterId?.toString() === currentId || ownerId?.toString() === currentId,
  };
}

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

module.exports.getComments = async (userId, contentType, contentId) => {
  await getContentOrThrow(contentType, contentId, userId);

  const comments = await Comments.find({ content: contentId, contentType })
    .populate("user", "userName profilePicture")
    .sort({ createdAt: -1 });

  return comments.map((comment) => decorateComment(comment, userId));
};

module.exports.createComment = async (userId, contentType, contentId, text) => {
  const { config, content } = await getContentOrThrow(
    contentType,
    contentId,
    userId,
  );

  const comment = await Comments.create({
    comment: text,
    content: contentId,
    contentModel: config.modelName,
    contentType,
    contentOwner: content.user,
    post: contentId,
    postOwner: content.user,
    user: userId,
  });

  const updatedContent = await config.model
    .findByIdAndUpdate(
      contentId,
      { $inc: { commentCount: 1 } },
      { new: true, select: "commentCount" },
    )
    .lean();

  const populatedComment = await comment.populate(
    "user",
    "userName profilePicture",
  );

  return {
    comment: decorateComment(populatedComment, userId),
    commentCount: updatedContent?.commentCount || 0,
  };
};

module.exports.deleteComment = async (userId, commentId) => {
  const comment = await Comments.findById(commentId);

  if (!comment) {
    throw new AppError("Comment not found!", 404);
  }

  const isCommenter = comment.user.toString() === userId.toString();
  const isContentOwner = comment.contentOwner.toString() === userId.toString();

  if (!isCommenter && !isContentOwner) {
    throw new AppError("You cannot delete this comment.", 403);
  }

  const config = contentConfig[comment.contentType];

  await comment.deleteOne();

  const updatedContent = await config.model
    .findOneAndUpdate(
      { _id: comment.content, commentCount: { $gt: 0 } },
      { $inc: { commentCount: -1 } },
      { new: true, select: "commentCount" },
    )
    .lean();

  return {
    contentId: comment.content,
    contentType: comment.contentType,
    commentCount: updatedContent?.commentCount || 0,
  };
};
