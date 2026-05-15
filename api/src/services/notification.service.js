const Notifications = require("../models/notification.model");
const { emitToUser } = require("./socket.service");

module.exports.getNotifications = async (userId, page, limit) => {
  const notifications = await Notifications.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("sender", "userName profilePicture")
    .populate({
      path: "contentId",
      select: "images comment post",
      options: { strictPopulate: false },
      populate: {
        path: "post",
        select: "images",
        options: { strictPopulate: false },
      },
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const cleanedData = notifications.map((notif) => {
    if (notif.onModel === "User") notif.contentId = undefined;
    return notif;
  });

  return cleanedData;
};

module.exports.send = async ({
  senderId,
  recipientId,
  type,
  contentId,
  onModel,
}) => {
  
  if (senderId.toString() === recipientId.toString()) return;
  const notif = await Notifications.create({
    sender: senderId,
    recipient: recipientId,
    type,
    contentId,
    onModel,
  });
  await notif.populate([
    { path: "sender", select: "userName profilePicture" },
    {
      path: "contentId",
      select: "images comment post",
      options: { strictPopulate: false },
      populate: {
        path: "post",
        select: { images: { $slice: 1 } },
        options: { strictPopulate: false },
      },
    },
  ]);

  const emitData = notif.toObject();

  if (onModel === "User") {
    emitData.contentId = undefined;
  }

  emitToUser(recipientId.toString(), "new_notification", emitData);
};

module.exports.remove = async ({ senderId, recipientId, type, contentId }) => {
  const deletedNotif = await Notifications.findOneAndDelete({
    sender: senderId,
    recipient: recipientId,
    type: type,
    contentId: contentId,
  });

  if (deletedNotif) {
    emitToUser(recipientId.toString(), "delete_notification", {
      notificationId: deletedNotif._id,
    });
  }
};