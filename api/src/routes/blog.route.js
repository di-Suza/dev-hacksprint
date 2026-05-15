const express = require("express");

const controller = require("../controllers/blog.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createBlogSchema,
  idParams,
  updateBlogPublishStatusSchema,
  updateBlogSchema,
} = require("../validations/blog.validation");

const blogRouter = express.Router();

blogRouter
  .post("/", isAuthenticated, validate(createBlogSchema), controller.createBlog)
  .get("/my", isAuthenticated, controller.getMyBlogs)
  .get("/:id", isAuthenticated, validate(idParams), controller.getBlogById)
  .patch(
    "/:id/publish-status",
    isAuthenticated,
    validate(updateBlogPublishStatusSchema),
    controller.updateBlogPublishStatus,
  )
  .patch("/:id", isAuthenticated, validate(updateBlogSchema), controller.updateBlog)
  .delete("/:id", isAuthenticated, validate(idParams), controller.deleteBlog);

module.exports = blogRouter;
