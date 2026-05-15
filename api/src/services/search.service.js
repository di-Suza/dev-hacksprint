const Blog = require("../models/blog.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const Likes = require("../models/like.model");

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

async function getPaginatedSearch({
  contentType,
  findQuery = {},
  model,
  page,
  limit,
  userId,
  populate = null,
}) {
  const skip = (page - 1) * limit;
  const [rawItems, totalItems] = await Promise.all([
    populate
      ? model
          .find(findQuery)
          .populate(populate)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
      : model
          .find(findQuery)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
    model.countDocuments(findQuery),
  ]);

  let items = rawItems;
  
  // Attach like flags if contentType is provided and userId is provided
  if (contentType && userId) {
    items = await attachLikeFlags(userId, contentType, rawItems);
  }

  return {
    hasMore: skip + items.length < totalItems,
    items,
    limit,
    page,
    totalItems,
  };
}

module.exports.searchUsers = async (query, page, limit) => {
  const searchQuery = {
    $or: [
      { userName: { $regex: query, $options: "i" } },
      { headline: { $regex: query, $options: "i" } },
      { about: { $regex: query, $options: "i" } },
      { skills: { $regex: query, $options: "i" } },
      { interests: { $regex: query, $options: "i" } },
    ],
  };

  return getPaginatedSearch({
    findQuery: searchQuery,
    model: User,
    page,
    limit,
    populate: null,
  });
};

module.exports.searchBlogs = async (query, page, limit, userId) => {
  const searchQuery = {
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
      { categories: { $regex: query, $options: "i" } },
    ],
  };

  return getPaginatedSearch({
    contentType: "blog",
    findQuery: searchQuery,
    model: Blog,
    page,
    limit,
    userId,
    populate: "user",
  });
};

module.exports.searchProjects = async (query, page, limit, userId) => {
  const searchQuery = {
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ],
  };

  return getPaginatedSearch({
    contentType: "project",
    findQuery: searchQuery,
    model: Project,
    page,
    limit,
    userId,
    populate: "user",
  });
};
