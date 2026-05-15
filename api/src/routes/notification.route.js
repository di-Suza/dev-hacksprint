const express = require("express");

const controller = require("../controllers/notification.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const notificationRouter = express.Router();

notificationRouter
  .get("/", isAuthenticated, controller.getNotifications)
  .patch("/read-all", isAuthenticated, controller.markAllAsRead)
  .delete("/", isAuthenticated, controller.deleteAllNotification)
  .delete("/:notificationId", isAuthenticated, controller.deleteNotification);

module.exports = notificationRouter;
