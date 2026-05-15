const express = require("express");

const controller = require("../controllers/comment.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
} = require("../validations/comment.validation");

const commentRouter = express.Router();

commentRouter
  .get("/", isAuthenticated, validate(getCommentsSchema), controller.getComments)
  .post(
    "/",
    isAuthenticated,
    validate(createCommentSchema),
    controller.createComment,
  )
  .delete(
    "/:id",
    isAuthenticated,
    validate(deleteCommentSchema),
    controller.deleteComment,
  );

module.exports = commentRouter;
