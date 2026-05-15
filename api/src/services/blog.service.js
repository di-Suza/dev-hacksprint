const Blog = require("../models/blog.model");
const Likes = require("../models/like.model");
const Users = require("../models/user.model");
const { AppError } = require("../utilities/appError");

module.exports.createBlog = async (userId, blogData) => {
  const isPublished = Boolean(blogData.isPublished);
  const blog = await Blog.create({
    user: userId,
    ...blogData,
    isPublished,
    publishedAt: isPublished ? new Date() : null,
  });

  await Users.findByIdAndUpdate(userId, { $inc: { blogsCount: 1 } });

  return blog;
};

module.exports.getMyBlogs = async (userId) => {
  return Blog.find({ user: userId }).sort({ createdAt: -1 });
};

module.exports.getBlogById = async (blogId, currentUserId) => {
  const blog = await Blog.findById(blogId).populate(
    "user",
    "userName profilePicture headline",
  );

  if (!blog) {
    throw new AppError("Blog not found!", 404);
  }

  const isOwner = blog.user._id.toString() === currentUserId.toString();

  if (!blog.isPublished && !isOwner) {
    throw new AppError("Blog not found!", 404);
  }

  const isLiked = await Likes.exists({
    content: blogId,
    contentType: "blog",
    user: currentUserId,
  });

  return {
    ...blog.toObject(),
    isLiked: Boolean(isLiked),
  };
};

module.exports.updateBlog = async (userId, blogId, updates) => {
  const blog = await Blog.findOne({ _id: blogId, user: userId });

  if (!blog) {
    throw new AppError("Blog not found!", 404);
  }

  const allowedUpdates = ["title", "content", "categories"];

  allowedUpdates.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      blog[field] = updates[field];
    }
  });

  if (Object.prototype.hasOwnProperty.call(updates, "isPublished")) {
    blog.isPublished = updates.isPublished;
    blog.publishedAt = updates.isPublished ? blog.publishedAt || new Date() : null;
  }

  await blog.save();
  return blog;
};

module.exports.updateBlogPublishStatus = async (userId, blogId, isPublished) => {
  const blog = await Blog.findOne({ _id: blogId, user: userId });

  if (!blog) {
    throw new AppError("Blog not found!", 404);
  }

  blog.isPublished = isPublished;
  blog.publishedAt = isPublished ? blog.publishedAt || new Date() : null;

  await blog.save();
  return blog;
};

module.exports.deleteBlog = async (userId, blogId) => {
  const blog = await Blog.findOne({ _id: blogId, user: userId });

  if (!blog) {
    throw new AppError("Blog not found!", 404);
  }

  await blog.deleteOne();
  await Users.findByIdAndUpdate(userId, { $inc: { blogsCount: -1 } });
};
