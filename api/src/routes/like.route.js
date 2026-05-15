const express = require("express");

const controller = require("../controllers/like.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { likeContentSchema } = require("../validations/like.validation");

const likeRouter = express.Router();

likeRouter
  .post("/", isAuthenticated, validate(likeContentSchema), controller.likeContent)
  .delete(
    "/",
    isAuthenticated,
    validate(likeContentSchema),
    controller.unlikeContent,
  );

module.exports = likeRouter;
