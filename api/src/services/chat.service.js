const Conversations = require("../models/conversation.model");
const Messages = require("../models/message.model");
const Users = require("../models/user.model");
const { AppError } = require("../utilities/appError");

module.exports.saveMessage = async ({
  receiverId,
  message,
  conversationId,
  sender,
}) => {
  const text = message?.trim();

  if (!text) {
    throw new AppError("Message cannot be empty!", 400);
  }

  if (!receiverId) {
    throw new AppError("Receiver is required!", 400);
  }

  if (sender._id.toString() === receiverId.toString()) {
    throw new AppError("You cannot message yourself!", 400);
  }

  const receiver = await Users.findById(receiverId).select(
    "_id userName profilePicture",
  );

  if (!receiver) {
    throw new AppError("Receiver not found!", 404);
  }

  let conversation = null;

  if (conversationId) {
    conversation = await Conversations.findOne({
      _id: conversationId,
      participants: { $all: [sender._id, receiverId] },
    });
  }

  if (!conversation) {
    const participants = [sender._id, receiverId].sort((a, b) =>
      a.toString().localeCompare(b.toString()),
    );

    conversation = await Conversations.findOne({
      participants: { $all: participants, $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversations.create({ participants });
    }
  }

  const newMessage = await Messages.create({
    conversationId: conversation._id,
    sender: sender._id,
    text,
  });

  conversation.lastMessage = newMessage._id;
  conversation.isUnread = true;
  await conversation.save();

  const finalMessage = await Messages.findById(newMessage._id)
    .populate("sender", "userName profilePicture")
    .lean();

  return {
    ...finalMessage,
    senderInfo: finalMessage.sender,
    conversationId: conversation._id,
    receiver,
  };
};

module.exports.getConversations = async (userId) => {
  const conversations = await Conversations.find({
    participants: { $in: [userId] },
  })
    .populate("participants", "userName profilePicture")
    .populate("lastMessage", "text createdAt sender")
    .sort({ updatedAt: -1 })
    .lean();

  return conversations.map((conversation) => {
    const otherUser = conversation.participants.find(
      (participant) => participant._id.toString() !== userId.toString(),
    );

    return {
      _id: conversation._id,
      otherUser,
      lastMessage: conversation.lastMessage,
      isUnread: conversation.isUnread,
      updatedAt: conversation.updatedAt,
    };
  });
};

module.exports.getMessages = async ({ conversationId, userId }, page, limit) => {
  const conversation = await Conversations.findOne({
    _id: conversationId,
    participants: userId,
  }).lean();

  if (!conversation) {
    throw new AppError("Conversation not found!", 404);
  }

  return Messages.find({ conversationId })
    .populate("sender", "userName profilePicture")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

module.exports.markAsRead = async (conversationId, userId) => {
  const conversation = await Conversations.findById(conversationId).populate({
    path: "lastMessage",
    select: "sender",
  });

  if (!conversation) {
    throw new AppError("Conversation not found!", 404);
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId.toString(),
  );

  if (!isParticipant) {
    throw new AppError("Conversation not found!", 404);
  }

  const lastSenderId = conversation.lastMessage?.sender?.toString();
  if (lastSenderId && lastSenderId !== userId.toString()) {
    conversation.isUnread = false;
    await conversation.save();
  }
};
