const Blog = require("../models/blog.model");
const Likes = require("../models/like.model");
const Project = require("../models/project.model");

async function attachLikeFlags(userId, contentType, items) {
  if (!items.length) return items;

  const itemIds = items.map((item) => item._id);
  const userLikes = await Likes.find({
    content: { $in: itemIds },
    contentType,
    user: userId,
  })
    .select("content")
    .lean();

  const likedIds = new Set(
    userLikes.map((like) => like.content.toString()),
  );

  return items.map((item) => ({
    ...item,
    isLiked: likedIds.has(item._id.toString()),
  }));
}

async function getPaginatedFeed({
  contentType,
  findQuery = {},
  model,
  page,
  limit,
  userId,
}) {
  const skip = (page - 1) * limit;
  const [rawItems, totalItems] = await Promise.all([
    model
      .find(findQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "userName profilePicture headline")
      .lean(),
    model.countDocuments(findQuery),
  ]);

  const items = await attachLikeFlags(userId, contentType, rawItems);

  return {
    hasMore: skip + items.length < totalItems,
    items,
    limit,
    page,
    totalItems,
  };
}

module.exports.getProjectFeed = async (userId, page, limit) => {
  return getPaginatedFeed({
    contentType: "project",
    limit,
    model: Project,
    page,
    userId,
  });
};

module.exports.getBlogFeed = async (userId, page, limit) => {
  return getPaginatedFeed({
    contentType: "blog",
    findQuery: { isPublished: true },
    limit,
    model: Blog,
    page,
    userId,
  });
};
