const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isUnread: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Conversations = mongoose.model(
  "Conversation",
  conversationSchema,
  "conversations",
);
module.exports = Conversations;