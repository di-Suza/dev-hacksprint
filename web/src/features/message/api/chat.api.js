import { api } from "../../../shared/api/api";
import { getSocket } from "../../../shared/services/socket";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => "/chat/conversations",
      providesTags: ["Chat"],
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
            if (!draft?.messages) return;

            const alreadyExists = draft.messages.some(
              (message) => message._id === newMessage._id,
            );

            if (!alreadyExists) {
              draft.messages.push(newMessage);
            }
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
            await queryFulfilled;
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
            const conversation = draft?.conversations?.find(
              (item) => item._id === conversationId,
            );

            if (conversation) {
              conversation.lastMessage = {
                _id: tempId,
                createdAt: optimisticMessage.createdAt,
                sender: currentUser._id,
                text,
              };
              conversation.updatedAt = optimisticMessage.createdAt;
              conversation.isUnread = false;
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData(
              "getMessages",
              { conversationId, page: 1 },
              (draft) => {
                if (draft?.messages) {
                  const existingRealIndex = draft.messages.findIndex(
                    (message) => message._id === data.newMessage._id,
                  );
                  const index = draft.messages.findIndex(
                    (message) => message._id === tempId,
                  );

                  if (existingRealIndex !== -1 && index !== -1) {
                    draft.messages.splice(index, 1);
                  } else if (index !== -1) {
                    draft.messages[index] = data.newMessage;
                  } else if (existingRealIndex === -1) {
                    draft.messages.push(data.newMessage);
                  }
                }
              },
            ),
          );
        } catch {
          messagesPatch.undo();
          conversationsPatch.undo();
        }
      },
      invalidatesTags: ["Chat"],
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
