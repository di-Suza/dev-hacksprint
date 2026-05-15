const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const projectRouter = require("./project.route");
const blogRouter = require("./blog.route");
const likeRouter = require("./like.route");
const commentRouter = require("./comment.route");
const feedRouter = require("./feed.route");
const searchRouter = require("./search.route");

// Mounting Routes
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/project", projectRouter);
router.use("/blog", blogRouter);
router.use("/like", likeRouter);
router.use("/comment", commentRouter);
router.use("/feed", feedRouter);
router.use("/search", searchRouter);

module.exports = router;
