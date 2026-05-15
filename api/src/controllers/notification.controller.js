const { catchAsync } = require("../utilities/catchAsync");
const Notifications = require("../models/notification.model");
//services
const notificationServices = require("../services/notification.service");

module.exports.getNotifications = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const limit = 10;

  const notifications = await notificationServices.getNotifications(
    userId,
    page,
    limit,
  );

  res.status(200).json({
    success: true,
    message: "Notifications fetched successfully",
    notifications,
    currentPage: page,
    hasMore: notifications.length === limit,
  });
});

module.exports.markAllAsRead = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // mark all notifications as read!
  await Notifications.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } },
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

module.exports.deleteNotification = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { notificationId } = req.params;

  await Notifications.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });

  res.status(200).json({
    success: true,
    message: "Notification deleted",
  });
});

module.exports.deleteAllNotification = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await Notifications.deleteMany({ recipient: userId });

  res.status(200).json({
    success: true,
    message: "All Notifications Deleted Successfully",
  });
});
