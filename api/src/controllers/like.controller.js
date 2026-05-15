const likeServices = require("../services/like.service");
const { catchAsync } = require("../utilities/catchAsync");

module.exports.likeContent = catchAsync(async (req, res) => {
  const result = await likeServices.likeContent(
    req.user._id,
    req.body.contentType,
    req.body.contentId,
  );

  res.status(200).json({
    success: true,
    message: "Liked successfully",
    ...result,
  });
});

module.exports.unlikeContent = catchAsync(async (req, res) => {
  const result = await likeServices.unlikeContent(
    req.user._id,
    req.body.contentType,
    req.body.contentId,
  );

  res.status(200).json({
    success: true,
    message: "Unliked successfully",
    ...result,
  });
});
