const feedServices = require("../services/feed.service");
const { catchAsync } = require("../utilities/catchAsync");

module.exports.getProjectFeed = catchAsync(async (req, res) => {
  const feed = await feedServices.getProjectFeed(
    req.user._id,
    req.query.page,
    req.query.limit,
  );

  res.status(200).json({
    success: true,
    message: "Project feed fetched successfully",
    ...feed,
  });
});

module.exports.getBlogFeed = catchAsync(async (req, res) => {
  const feed = await feedServices.getBlogFeed(
    req.user._id,
    req.query.page,
    req.query.limit,
  );

  res.status(200).json({
    success: true,
    message: "Blog feed fetched successfully",
    ...feed,
  });
});
