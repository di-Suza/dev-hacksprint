const express = require("express");

const controller = require("../controllers/user.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  updateGeneralInfoSchema,
  updateProfessionalInfoSchema,
  updateProfilePictureSchema,
  updateSocialLinksSchema,
  userIdParamsSchema,
} = require("../validations/user.validation");

const userRouter = express.Router();

userRouter
  .get(
    "/:userId/followers",
    isAuthenticated,
    validate(userIdParamsSchema),
    controller.getFollowers,
  )
  .get(
    "/:userId/following",
    isAuthenticated,
    validate(userIdParamsSchema),
    controller.getFollowing,
  )
  .get(
    "/getFollowers/:userId",
    isAuthenticated,
    validate(userIdParamsSchema),
    controller.getFollowers,
  )
  .get(
    "/getFollowing/:userId",
    isAuthenticated,
    validate(userIdParamsSchema),
    controller.getFollowing,
  )
  .post(
    "/:userId/follow",
    isAuthenticated,
    validate(userIdParamsSchema),
    controller.followUser,
  )
  .delete(
    "/:userId/follow",
    isAuthenticated,
    validate(userIdParamsSchema),
    controller.unfollowUser,
  )
  .post(
    "/followUser/:userId",
    isAuthenticated,
    validate(userIdParamsSchema),
    controller.followUser,
  )
  .delete(
    "/unfollowUser/:userId",
    isAuthenticated,
    validate(userIdParamsSchema),
    controller.unfollowUser,
  )
  .patch(
    "/updateProfilePicture",
    isAuthenticated,
    upload.single("profilePicture"),
    validate(updateProfilePictureSchema),
    controller.updateProfilePicture,
  )
  .patch(
    "/updateGeneralInfo",
    isAuthenticated,
    validate(updateGeneralInfoSchema),
    controller.updateGeneralInfo,
  )
  .patch(
    "/updateProfessionalInfo",
    isAuthenticated,
    validate(updateProfessionalInfoSchema),
    controller.updateProfessionalInfo,
  )
  .patch(
    "/updateSocialLinks",
    isAuthenticated,
    validate(updateSocialLinksSchema),
    controller.updateSocialLinks,
  );

userRouter.get(
  "/:userId",
  isAuthenticated,
  validate(userIdParamsSchema),
  controller.getUserProfile,
);

module.exports = userRouter;
