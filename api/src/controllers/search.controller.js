const searchServices = require("../services/search.service");
const { catchAsync } = require("../utilities/catchAsync");

module.exports.searchUsers = catchAsync(async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  const results = await searchServices.searchUsers(
    query.trim(),
    parseInt(page),
    parseInt(limit),
  );

  res.status(200).json({
    success: true,
    message: "Users search completed",
    ...results,
  });
});

module.exports.searchBlogs = catchAsync(async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  const results = await searchServices.searchBlogs(
    query.trim(),
    parseInt(page),
    parseInt(limit),
    req.user._id,
  );

  res.status(200).json({
    success: true,
    message: "Blogs search completed",
    ...results,
  });
});

module.exports.searchProjects = catchAsync(async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  const results = await searchServices.searchProjects(
    query.trim(),
    parseInt(page),
    parseInt(limit),
    req.user._id,
  );

  res.status(200).json({
    success: true,
    message: "Projects search completed",
    ...results,
  });
});
