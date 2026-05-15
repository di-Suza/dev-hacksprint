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
} = require("../validations/user.validation");

const userRouter = express.Router();

userRouter.get("/:userId", controller.getUserProfile);

userRouter
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

module.exports = userRouter;
