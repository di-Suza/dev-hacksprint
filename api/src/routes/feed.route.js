const express = require("express");

const controller = require("../controllers/feed.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { feedQuerySchema } = require("../validations/feed.validation");

const feedRouter = express.Router();

feedRouter
  .get(
    "/projects",
    isAuthenticated,
    validate(feedQuerySchema),
    controller.getProjectFeed,
  )
  .get(
    "/blogs",
    isAuthenticated,
    validate(feedQuerySchema),
    controller.getBlogFeed,
  );

module.exports = feedRouter;
