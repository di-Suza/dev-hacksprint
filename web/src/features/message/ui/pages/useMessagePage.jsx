import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useMarkAsReadMutation,
  useSendMessageMutation,
} from "../../api/chat.api";

function useMessagePage() {
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const messagesContainerRef = useRef(null);

  const { data: conversationsData, isLoading: conversationsLoading } =
    useGetConversationsQuery();
  const conversations = conversationsData?.conversations || [];
  const selectedConversationId = selectedChat?._id;
  const { data: messagesData, isLoading: messagesLoading } =
    useGetMessagesQuery(
      { conversationId: selectedConversationId, page: 1 },
      { skip: !selectedConversationId },
    );
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const messages = messagesData?.messages || [];

  const activeChat = useMemo(() => {
    if (!selectedChat) return null;
    return (
      conversations.find((chat) => chat._id === selectedChat._id) ||
      selectedChat
    );
  }, [conversations, selectedChat]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      behavior: "smooth",
      top: container.scrollHeight,
    });
  }, [messages.length, selectedConversationId]);

  useEffect(() => {
    if (
      activeChat?._id &&
      activeChat.isUnread &&
      activeChat.lastMessage?.sender !== currentUser?._id
    ) {
      markAsRead(activeChat._id);
    }
  }, [activeChat, currentUser?._id, markAsRead]);

  async function handleSend() {
    const text = message.trim();
    if (!text || !activeChat?.otherUser?._id) return;

    setMessage("");

    try {
      await sendMessage({
        conversationId: activeChat._id,
        message: text,
        receiverId: activeChat.otherUser._id,
      }).unwrap();
    } catch (error) {
      setMessage(text);
      toast.error(error?.data?.message || "Message not sent");
    }
  }

  return {
    activeChat,
    conversations,
    conversationsLoading,
    currentUser,
    handleSend,
    message,
    messages,
    messagesContainerRef,
    messagesLoading,
    selectedChat,
    sending,
    setMessage,
    setSelectedChat,
  };
}

export default useMessagePage;
