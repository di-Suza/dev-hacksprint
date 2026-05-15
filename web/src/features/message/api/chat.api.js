import { api } from "../../../shared/api/api";
import { getSocket } from "../../../shared/services/socket";

function getConversationId(message) {
  return message?.conversationId?._id || message?.conversationId;
}

function getSenderId(message) {
  return message?.sender?._id || message?.sender;
}

function upsertMessage(draft, newMessage) {
  if (!draft?.messages || !newMessage) return;

  const alreadyExists = draft.messages.some(
    (message) => message._id === newMessage._id,
  );

  if (alreadyExists) return;

  const senderId = getSenderId(newMessage)?.toString();
  const optimisticIndex = draft.messages.findIndex(
    (message) =>
      message.isOptimistic &&
      message.text === newMessage.text &&
      getSenderId(message)?.toString() === senderId,
  );

  if (optimisticIndex !== -1) {
    draft.messages[optimisticIndex] = newMessage;
    return;
  }

  draft.messages.push(newMessage);
}

function patchConversationPreview(draft, message, currentUserId) {
  if (!draft?.conversations?.length || !message) return;

  const conversationId = getConversationId(message)?.toString();
  if (!conversationId) return;

  const index = draft.conversations.findIndex(
    (conversation) => conversation._id?.toString() === conversationId,
  );

  if (index === -1) {
    const senderId = getSenderId(message)?.toString();
    const otherUser =
      senderId === currentUserId?.toString() ? message.receiver : message.sender;

    if (!otherUser) return;

    draft.conversations.unshift({
      _id: conversationId,
      isUnread: senderId !== currentUserId?.toString(),
      lastMessage: {
        _id: message._id,
        createdAt: message.createdAt,
        sender: getSenderId(message),
        text: message.text,
      },
      otherUser,
      updatedAt: message.createdAt || new Date().toISOString(),
    });
    return;
  }

  const [conversation] = draft.conversations.splice(index, 1);
  conversation.lastMessage = {
    _id: message._id,
    createdAt: message.createdAt,
    sender: getSenderId(message),
    text: message.text,
  };
  conversation.updatedAt = message.createdAt || new Date().toISOString();
  conversation.isUnread =
    getSenderId(message)?.toString() !== currentUserId?.toString();
  draft.conversations.unshift(conversation);
}

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => "/chat/conversations",
      providesTags: ["Chat"],
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, getState, updateCachedData },
      ) {
        const socket = getSocket();

        const handleReceiveMessage = (newMessage) => {
          const currentUserId = getState().auth.user?._id;
          updateCachedData((draft) => {
            patchConversationPreview(draft, newMessage, currentUserId);
          });
        };

        try {
          await cacheDataLoaded;
          socket.off("receive-message", handleReceiveMessage);
          socket.on("receive-message", handleReceiveMessage);
        } catch {
          // cache closed before loading
        }

        await cacheEntryRemoved;
        socket.off("receive-message", handleReceiveMessage);
      },
    }),
    getMessages: builder.query({
      query: ({ conversationId, page = 1 }) =>
        `/chat/messages/${conversationId}?page=${page}`,
      providesTags: (result, error, arg) => [
        { type: "Chat", id: arg.conversationId },
      ],
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, dispatch, updateCachedData },
      ) {
        const socket = getSocket();

        const handleReceiveMessage = (newMessage) => {
          const incomingConversationId =
            newMessage.conversationId?._id || newMessage.conversationId;

          if (incomingConversationId?.toString() !== arg.conversationId) {
            return;
          }

          updateCachedData((draft) => {
            upsertMessage(draft, newMessage);
          });
        };

        const handleReconnect = () => {
          dispatch(api.util.invalidateTags([{ type: "Chat", id: arg.conversationId }]));
        };

        try {
          await cacheDataLoaded;
          socket.off("receive-message", handleReceiveMessage);
          socket.off("connect", handleReconnect);
          socket.off("reconnect", handleReconnect);
          socket.on("receive-message", handleReceiveMessage);
          socket.on("connect", handleReconnect);
          socket.on("reconnect", handleReconnect);
        } catch {
          // cache closed before loading
        }

        await cacheEntryRemoved;
        socket.off("receive-message", handleReceiveMessage);
        socket.off("connect", handleReconnect);
        socket.off("reconnect", handleReconnect);
      },
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/chat/messages",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const conversationId = arg.conversationId;
        const text = arg.message?.trim();
        const currentUser = getState().auth.user;
        const tempId = `temp-message-${Date.now()}`;

        if (!conversationId || !text || !currentUser) {
          try {
            const { data } = await queryFulfilled;
            dispatch(
              api.util.updateQueryData("getConversations", undefined, (draft) => {
                patchConversationPreview(draft, data.newMessage, currentUser?._id);
              }),
            );
            dispatch(api.util.invalidateTags(["Chat"]));
          } catch {
            // handled by caller
          }
          return;
        }

        const optimisticMessage = {
          _id: tempId,
          conversationId,
          createdAt: new Date().toISOString(),
          isOptimistic: true,
          sender: {
            _id: currentUser._id,
            profilePicture: currentUser.profilePicture,
            userName: currentUser.userName,
          },
          text,
        };

        const messagesPatch = dispatch(
          api.util.updateQueryData(
            "getMessages",
            { conversationId, page: 1 },
            (draft) => {
              if (draft?.messages) {
                draft.messages.push(optimisticMessage);
              }
            },
          ),
        );

        const conversationsPatch = dispatch(
          api.util.updateQueryData("getConversations", undefined, (draft) => {
            patchConversationPreview(draft, optimisticMessage, currentUser._id);
          }),
        );

        try {
          const { data } = await queryFulfilled;
          const realMessage = data.newMessage;

          dispatch(
            api.util.updateQueryData(
              "getMessages",
              { conversationId, page: 1 },
              (draft) => {
                if (!draft?.messages) return;

                const existingRealIndex = draft.messages.findIndex(
                  (message) => message._id === realMessage._id,
                );
                const tempIndex = draft.messages.findIndex(
                  (message) => message._id === tempId,
                );

                if (existingRealIndex !== -1 && tempIndex !== -1) {
                  draft.messages.splice(tempIndex, 1);
                  return;
                }

                if (tempIndex !== -1) {
                  draft.messages[tempIndex] = realMessage;
                  return;
                }

                upsertMessage(draft, realMessage);
              },
            ),
          );

          dispatch(
            api.util.updateQueryData("getConversations", undefined, (draft) => {
              patchConversationPreview(draft, realMessage, currentUser._id);
            }),
          );
        } catch {
          messagesPatch.undo();
          conversationsPatch.undo();
        }
      },
    }),
    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useMarkAsReadMutation,
  useSendMessageMutation,
} = chatApi;
