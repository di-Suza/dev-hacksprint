const Users = require("../models/user.model");
const Follows = require("../models/follow.model");
const { AppError } = require("../utilities/appError");
const { generateHash, compareHash } = require("../utilities/password");
const redis = require("../config/connectToRedis");
const imagekit = require("../utilities/imageKit");
const notificationServices = require("../services/notification.service");

module.exports.updateUserAccountPassword = async (userId, newPassword) => {
  let passwordHash = await generateHash(newPassword);
  await Users.findByIdAndUpdate(userId, { $set: { password: passwordHash } });
};

module.exports.changePassword = async (
  userId,
  currentPassword,
  newPassword,
) => {
  // getting user again for checking password
  const user = await Users.findById(userId).select("+password");

  //if google user there's no form on frontend but still check
  if (!user.password && user.isGoogleUser) {
    throw new AppError("Google accounts don't have a password.", 400);
  }

  //check current password
  const isMatch = await compareHash(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError("Old password is incorrect", 400);
  }

  user.password = await generateHash(newPassword);
  await user.save();
};

module.exports.updateProfilePicture = async (
  userId,
  file,
  removeProfilePicture,
) => {
  let isChanged = false;

  let user = await Users.findById(userId);
  if (!user) {
    throw new AppError("User Not Found!", 404);
  }

  if (file) {
    if (user.profilePicture.fileId !== "0") {
      await imagekit.deleteFile(user.profilePicture.fileId);
    }
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: `profile-${user._id}-${Date.now()}.${file.originalname.split(".").pop()}`,
      folder: "/Developer/ProfilePictures",
    });
    user.profilePicture = {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    };
    isChanged = true;
  } else if (removeProfilePicture && user.profilePicture.fileId !== "0") {
    await imagekit.deleteFile(user.profilePicture.fileId);

    user.profilePicture = {
      url: "https://ik.imagekit.io/goldstains/Developer/ProfilePictures/defaultpp.webp",
      fileId: "0",
    };
    isChanged = true;
  }

  if (isChanged) {
    await user.save({ validateModifiedOnly: true });
    await redis.del(`user_:${user._id}`);
  }

  return { profilePicture: user.profilePicture };
};

module.exports.updateGeneralInfo = async (
  userId,
  userName,
  headline,
  about,
) => {
  const updateData = {};
  if (typeof userName === "string") {
    updateData.userName = userName.trim().replace(/\s+/g, " ");
  }

  // if user want to save ""
  if (typeof headline === "string") {
    updateData.headline = headline.trim();
  }

  if (typeof about === "string") {
    updateData.about = about.trim();
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError(
      "Please provide userName, headline, or about to update!",
      400,
    );
  }
  const updatedUser = await Users.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    { new: true, runValidators: true },
  ).select("userName headline about");

  await redis.del(`user_:${userId}`);

  return updatedUser;
};

module.exports.updateProfessionalInfo = async (
  userId,
  incomingFields,
  updates,
) => {
  const allowedUpdates = [
    "skills",
    "experiences",
    "educations",
    "interests",
    "languages",
  ];

  //check
  const isValidOperation = incomingFields.every((field) =>
    allowedUpdates.includes(field),
  );

  if (!isValidOperation || incomingFields.length === 0) {
    throw new AppError("Invalid or empty updates!", 400);
  }
  // more than one field then update by loop
  let user = await Users.findById(userId);

  if (!user) {
    throw new AppError("User Not Found!", 404);
  }
  const updatedData = {};
  incomingFields.forEach((field) => {
    user[field] = updates[field];
    updatedData[field] = updates[field];
  });
  await user.save();

  return updatedData;
};

module.exports.updateSocialLinks = async (userId, incomingFields, updates) => {
  const allowedUpdates = [
    "github",
    "linkedin",
    "x",
    "youtube",
    "portfolio",
    "instagram",
  ];

  const isValidOperation = incomingFields.every((field) =>
    allowedUpdates.includes(field),
  );

  if (!isValidOperation || incomingFields.length === 0) {
    throw new AppError("Invalid or empty social links update!", 400);
  }

  const user = await Users.findById(userId);
  if (!user) {
    throw new AppError("User Not Found!", 404);
  }

  const updatedSocialLinks = {};
  incomingFields.forEach((field) => {
    if (typeof updates[field] !== "string") {
      throw new AppError("Social links must be strings!", 400);
    }

    user.socialLinks[field] = updates[field].trim();
    updatedSocialLinks[field] = user.socialLinks[field];
  });

  await user.save({ validateModifiedOnly: true });
  await redis.del(`user_:${user._id}`);

  return {
    ...user.socialLinks.toObject(),
    ...updatedSocialLinks,
  };
};

module.exports.getUserProfile = async (currentUserId, userId) => {
  const Project = require("../models/project.model");
  const Blog = require("../models/blog.model");

  const [user, projects, blogs, isFollowed] = await Promise.all([
    Users.findById(userId).select("-password -loginAttempts -isGoogleUser").lean(),
    Project.find({ user: userId })
      .select("_id title images createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    Blog.find({ user: userId, isPublished: true })
      .select("_id title content createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    Follows.exists({ follower: currentUserId, following: userId }),
  ]);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    user: {
      ...user,
      isFollowed: Boolean(isFollowed),
    },
    projects,
    blogs,
  };
};

module.exports.followUser = async (userId, followUserId) => {
  if (userId.toString() === followUserId.toString()) {
    throw new AppError("You cannot follow yourself!", 400);
  }

  const targetUser = await Users.findById(followUserId).select("_id");
  if (!targetUser) {
    throw new AppError("User not found!", 404);
  }

  try {
    await Follows.create({ follower: userId, following: followUserId });
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }

    const [currentUser, profileUser] = await Promise.all([
      Users.findById(userId).select("followingCount").lean(),
      Users.findById(followUserId).select("followersCount").lean(),
    ]);

    return {
      isFollowed: true,
      followersCount: profileUser?.followersCount || 0,
      followingCount: currentUser?.followingCount || 0,
    };
  }

  const [currentUser, profileUser] = await Promise.all([
    Users.findByIdAndUpdate(
      userId,
      { $inc: { followingCount: 1 } },
      { new: true, select: "followingCount" },
    ).lean(),
    Users.findByIdAndUpdate(
      followUserId,
      { $inc: { followersCount: 1 } },
      { new: true, select: "followersCount" },
    ).lean(),
    redis.del(`user_:${userId}`),
    redis.del(`user_:${followUserId}`),
  ]);

  await notificationServices.send({
    senderId: userId,
    recipientId: followUserId,
    type: "FOLLOW",
    contentId: followUserId,
    onModel: "User",
  });

  return {
    isFollowed: true,
    followersCount: profileUser?.followersCount || 0,
    followingCount: currentUser?.followingCount || 0,
  };
};

module.exports.unfollowUser = async (userId, followUserId) => {
  if (userId.toString() === followUserId.toString()) {
    throw new AppError("You cannot unfollow yourself!", 400);
  }

  const deletedFollow = await Follows.findOneAndDelete({
    follower: userId,
    following: followUserId,
  });

  if (!deletedFollow) {
    const [currentUser, profileUser] = await Promise.all([
      Users.findById(userId).select("followingCount").lean(),
      Users.findById(followUserId).select("followersCount").lean(),
    ]);

    return {
      isFollowed: false,
      followersCount: profileUser?.followersCount || 0,
      followingCount: currentUser?.followingCount || 0,
    };
  }

  const [currentUser, profileUser] = await Promise.all([
    Users.findOneAndUpdate(
      { _id: userId, followingCount: { $gt: 0 } },
      { $inc: { followingCount: -1 } },
      { new: true, select: "followingCount" },
    ).lean(),
    Users.findOneAndUpdate(
      { _id: followUserId, followersCount: { $gt: 0 } },
      { $inc: { followersCount: -1 } },
      { new: true, select: "followersCount" },
    ).lean(),
    redis.del(`user_:${userId}`),
    redis.del(`user_:${followUserId}`),
  ]);

  await notificationServices.remove({
    senderId: userId,
    recipientId: followUserId,
    type: "FOLLOW",
    contentId: followUserId,
  });

  return {
    isFollowed: false,
    followersCount: profileUser?.followersCount || 0,
    followingCount: currentUser?.followingCount || 0,
  };
};

module.exports.getFollowers = async (userId, page = 1, limit = 20) => {
  const followersList = await Follows.find({ following: userId })
    .populate("follower", "userName headline profilePicture followersCount followingCount")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    followers: followersList
      .map((follow) => follow.follower)
      .filter(Boolean),
    hasMore: followersList.length === limit,
  };
};

module.exports.getFollowing = async (userId, page = 1, limit = 20) => {
  const followingList = await Follows.find({ follower: userId })
    .populate("following", "userName headline profilePicture followersCount followingCount")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    following: followingList
      .map((follow) => follow.following)
      .filter(Boolean),
    hasMore: followingList.length === limit,
  };
};

// module.exports.getUserProfile = async (currentUserId, profileUserId) => {
//   if (currentUserId.toString() === profileUserId.toString()) {
//     throw new AppError("This Api is not for Current User!", 400);
//   }

//   const [currentUser, profileUser, isFollowed] = await Promise.all([
//     Users.findById(currentUserId).select("_id"),
//     Users.findById(profileUserId).select("-lastLoginAt -isGoogleUser"),
//     Follows.exists({ follower: currentUserId, following: profileUserId }),
//   ]);

//   if (!currentUser) {
//     throw new AppError("User not found!", 404);
//   }

//   if (!profileUser) {
//     throw new AppError("User not found!", 404);
//   }

//   let responseData = {
//     success: true,
//     message: "Profile User Fetched Successfully!",
//     profileUser: { ...profileUser.toObject(), isFollowed: !!isFollowed },
//   };

//   if (profileUser.postsCount > 0) {
//     userPosts = await Posts.find({ user: profileUserId })
//       .select({
//         settings: 0,
//         user: 0,
//         counts: 0,
//         projectLinks: 0,
//         images: { $slice: 1 },
//       })
//       .sort({
//         createdAt: -1,
//       });

//     let projectPosts = userPosts.filter((post) => post.isProjectPost === true);
//     let normalPosts = userPosts.filter((post) => post.isProjectPost === false);

//     if (normalPosts.length > 0) {
//       responseData.normalPosts = normalPosts;
//     }
//     if (projectPosts.length > 0) {
//       responseData.projectPosts = projectPosts;
//     }
//   }

//   return responseData;
// };

// module.exports.deleteUserAccount = async (userId) => {
//   await Users.findByIdAndUpdate(userId, { active: false });
//   await userCleanupQueue.add("user-cleanup", { userId });
// };

// module.exports.followUser = async (userId, followUserId) => {
//   if (userId.toString() === followUserId.toString()) {
//     throw new AppError("You cannot follow yourself!", 400);
//   }

//   const existingFollow = await Follows.findOne({
//     follower: userId,
//     following: followUserId,
//   });

//   if (existingFollow) {
//     return res.status(200).json({
//       success: true,
//       message: "Already following this user!",
//     });
//   }
//   await Promise.all([
//     Follows.create({ follower: userId, following: followUserId }),
//     Users.findByIdAndUpdate(userId, { $inc: { followingCount: 1 } }),
//     Users.findByIdAndUpdate(followUserId, { $inc: { followersCount: 1 } }),

//     await notificationServices.send({
//       senderId: userId,
//       recipientId: followUserId,
//       type: "FOLLOW",
//       contentId: followUserId,
//       onModel: "User",
//     }),
//   ]);
// };

// module.exports.unfollowUser = async (userId, followUserId) => {
//   const deletedFollow = await Follows.findOneAndDelete({
//     follower: userId,
//     following: followUserId,
//   });

//   if (!deletedFollow) {
//     throw new AppError("You are not following this user!", 400);
//   }
//   await Promise.all([
//     Users.findByIdAndUpdate(userId, { $inc: { followingCount: -1 } }),
//     Users.findByIdAndUpdate(followUserId, { $inc: { followersCount: -1 } }),
//     notificationServices.remove({
//       senderId: userId,
//       recipientId: followUserId,
//       type: "FOLLOW",
//       contentId: followUserId,
//     }),
//   ]);
// };

// module.exports.getFollowers = async (userId, page, limit) => {
//   const followersList = await Follows.find({ following: userId })
//     .populate("follower", "userName profilePicture")
//     .sort({ createdAt: -1 })
//     .skip((page - 1) * limit)
//     .limit(limit);

//   const followers = followersList.map((item) => item.follower);
//   return followers;
// };

// module.exports.getFollowing = async (userId, page, limit) => {
//   const followingList = await Follows.find({ follower: userId })
//     .populate("following", "userName profilePicture")
//     .sort({ createdAt: -1 })
//     .skip((page - 1) * limit)
//     .limit(limit);

//   const following = followingList.map((item) => item.following);

//   return following;
// };
