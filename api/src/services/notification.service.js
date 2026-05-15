const Notifications = require("../models/notification.model");
const { emitToUser } = require("./socket.service");

function getContentType(onModel) {
  if (onModel === "Project") return "project";
  if (onModel === "Blog") return "blog";
  return "user";
}

const contentSelect = {
  Blog: "title content",
  Project: "title images description",
  User: "userName profilePicture",
};

module.exports.getNotifications = async (userId, page = 1, limit = 10) => {
  return Notifications.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("sender", "userName profilePicture")
    .populate({
      path: "contentId",
      select: "title content images description userName profilePicture",
      options: { strictPopulate: false },
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

module.exports.send = async ({
  senderId,
  recipientId,
  type,
  contentId,
  onModel,
}) => {
  if (!recipientId || senderId.toString() === recipientId.toString()) return;

  const contentType = getContentType(onModel);
  const notif = await Notifications.findOneAndUpdate(
    {
      sender: senderId,
      recipient: recipientId,
      type,
      contentId,
      onModel,
    },
    {
      $set: {
        contentType,
        isRead: false,
      },
      $setOnInsert: {
        sender: senderId,
        recipient: recipientId,
        type,
        contentId,
        onModel,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await notif.populate([
    { path: "sender", select: "userName profilePicture" },
    {
      path: "contentId",
      select: contentSelect[onModel],
      options: { strictPopulate: false },
    },
  ]);

  emitToUser(recipientId.toString(), "new_notification", notif.toObject());
};

module.exports.remove = async ({ senderId, recipientId, type, contentId }) => {
  const deletedNotif = await Notifications.findOneAndDelete({
    sender: senderId,
    recipient: recipientId,
    type,
    contentId,
  });

  if (deletedNotif) {
    emitToUser(recipientId.toString(), "delete_notification", {
      notificationId: deletedNotif._id,
    });
  }
};
