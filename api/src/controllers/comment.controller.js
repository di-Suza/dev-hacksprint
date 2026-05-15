const commentServices = require("../services/comment.service");
const { catchAsync } = require("../utilities/catchAsync");

module.exports.getComments = catchAsync(async (req, res) => {
  const comments = await commentServices.getComments(
    req.user._id,
    req.query.contentType,
    req.query.contentId,
  );

  res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    comments,
  });
});

module.exports.createComment = catchAsync(async (req, res) => {
  const result = await commentServices.createComment(
    req.user._id,
    req.body.contentType,
    req.body.contentId,
    req.body.comment,
  );

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    ...result,
  });
});

module.exports.deleteComment = catchAsync(async (req, res) => {
  const result = await commentServices.deleteComment(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
    ...result,
  });
});
