const express = require("express");

const controller = require("../controllers/chat.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const chatRouter = express.Router();

chatRouter
  .get("/conversations", isAuthenticated, controller.getConversations)
  .get("/messages/:conversationId", isAuthenticated, controller.getMessages)
  .post("/messages", isAuthenticated, controller.sendMessage)
  .patch("/conversations/:conversationId/read", isAuthenticated, controller.markAsRead);

module.exports = chatRouter;
