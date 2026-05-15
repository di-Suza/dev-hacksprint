const { catchAsync } = require("../utilities/catchAsync");
const userServices = require("../services/user.service");

module.exports.updateProfilePicture = catchAsync(async (req, res) => {
  const removeProfilePicture =
    req.body.removeProfilePicture === true ||
    req.body.removeProfilePicture === "true";

  const updatedData = await userServices.updateProfilePicture(
    req.user._id,
    req.file,
    removeProfilePicture,
  );

  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    updatedData,
  });
});

module.exports.updateGeneralInfo = catchAsync(async (req, res) => {
  const { userName, headline, about } = req.body;

  const updatedData = await userServices.updateGeneralInfo(
    req.user._id,
    userName,
    headline,
    about,
  );

  res.status(200).json({
    success: true,
    message: "General info updated successfully",
    updatedData,
  });
});

module.exports.updateProfessionalInfo = catchAsync(async (req, res) => {
  const incomingFields = Object.keys(req.body);

  const updatedData = await userServices.updateProfessionalInfo(
    req.user._id,
    incomingFields,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Professional info updated successfully",
    updatedData,
  });
});

module.exports.updateSocialLinks = catchAsync(async (req, res) => {
  const incomingFields = Object.keys(req.body);

  const updatedData = await userServices.updateSocialLinks(
    req.user._id,
    incomingFields,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Social links updated successfully",
    updatedData,
  });
});

module.exports.getUserProfile = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const userProfile = await userServices.getUserProfile(req.user._id, userId);

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user: userProfile,
  });
});

module.exports.followUser = catchAsync(async (req, res) => {
  const result = await userServices.followUser(req.user._id, req.params.userId);

  res.status(200).json({
    success: true,
    message: "User followed successfully",
    ...result,
  });
});

module.exports.unfollowUser = catchAsync(async (req, res) => {
  const result = await userServices.unfollowUser(req.user._id, req.params.userId);

  res.status(200).json({
    success: true,
    message: "User unfollowed successfully",
    ...result,
  });
});

module.exports.getFollowers = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await userServices.getFollowers(req.params.userId, page, limit);

  res.status(200).json({
    success: true,
    message: "Followers fetched successfully",
    currentPage: page,
    ...result,
  });
});

module.exports.getFollowing = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await userServices.getFollowing(req.params.userId, page, limit);

  res.status(200).json({
    success: true,
    message: "Following fetched successfully",
    currentPage: page,
    ...result,
  });
});
