const express = require("express");
const controller = require("../controllers/search.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const searchRouter = express.Router();

searchRouter.get("/users", controller.searchUsers);
searchRouter.get("/blogs", isAuthenticated, controller.searchBlogs);
searchRouter.get("/projects", isAuthenticated, controller.searchProjects);

module.exports = searchRouter;
