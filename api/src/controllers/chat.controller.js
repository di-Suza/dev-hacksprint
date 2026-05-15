const { catchAsync } = require("../utilities/catchAsync");

//services
const chatServices = require("../services/chat.service");
const socketServices = require("../services/socket.service");

module.exports.sendMessage = catchAsync(async (req, res) => {
  const sender = req.user;
  const receiverId = req.body.receiverId;

  const finalMessage = await chatServices.saveMessage({ ...req.body, sender });

  socketServices.emitToUser(receiverId, "receive-message", finalMessage);
  socketServices.emitToUser(sender._id, "receive-message", finalMessage);

  res.status(201).json({
    success: true,
    message: "Message Sent Successfully!",
    newMessage: finalMessage,
  });
});

module.exports.getConversations = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const formattedConversations = await chatServices.getConversations(userId);

  res.status(200).json({
    success: true,
    message: "Conversations Fetched Successfully!",
    conversations: formattedConversations,
  });
});

module.exports.getMessages = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { conversationId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = 20;

  let enrichedMessages = await chatServices.getMessages(
    { conversationId, userId },
    page,
    limit,
  );

  res.status(200).json({
    success: true,
    messages: enrichedMessages.reverse(),
    currentPage: page,
    hasMore: enrichedMessages.length === limit,
  });
});

module.exports.markAsRead = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const conversationId = req.params.conversationId;

  await chatServices.markAsRead(conversationId, userId);

  res.status(200).json({
    success: true,
    message: "Marked as read!",
  });
});
