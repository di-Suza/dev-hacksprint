const express = require("express");

const controller = require("../controllers/project.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/multer.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createProjectSchema,
  idParams,
  updateProjectSchema,
} = require("../validations/project.validation");

const projectRouter = express.Router();

projectRouter
  .post(
    "/",
    isAuthenticated,
    upload.array("images", 5),
    validate(createProjectSchema),
    controller.createProject,
  )
  .get("/my", isAuthenticated, controller.getMyProjects)
  .get("/:id", isAuthenticated, validate(idParams), controller.getProjectById)
  .patch(
    "/:id",
    isAuthenticated,
    upload.array("images", 5),
    validate(updateProjectSchema),
    controller.updateProject,
  )
  .delete("/:id", isAuthenticated, validate(idParams), controller.deleteProject);

module.exports = projectRouter;
