import { useSelector } from "react-redux";

import { chatApi } from "../../features/message/api/chat.api";

export function useUnreadMessagesCount() {
  const userId = useSelector((state) => state.auth.user?._id);
  const { data } = chatApi.endpoints.getConversations.useQueryState();

  return (
    data?.conversations?.reduce((count, conversation) => {
      const senderId =
        conversation.lastMessage?.sender?._id || conversation.lastMessage?.sender;
      const hasIncomingUnread =
        conversation.isUnread && senderId?.toString() !== userId;

      return hasIncomingUnread ? count + 1 : count;
    }, 0) || 0
  );
}
