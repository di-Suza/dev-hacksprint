import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "sonner";

import { formatRelativeTime } from "../../../../shared/utils/formatRelativeTime";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useMarkAsReadMutation,
  useSendMessageMutation,
} from "../../api/chat.api";

function Avatar({ user, size = "h-12 w-12" }) {
  return user?.profilePicture?.url ? (
    <img
      alt={user.userName}
      className={`${size} rounded-full border border-(--color-border) object-cover`}
      src={user.profilePicture.url}
    />
  ) : (
    <div
      className={`${size} grid place-items-center rounded-full border border-(--color-border) bg-(--color-surface-strong) font-black`}
    >
      {user?.userName?.[0]?.toUpperCase() || "U"}
    </div>
  );
}

function MessagePage() {
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

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
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <main className="min-h-screen bg-(--color-bg) px-4 py-5 text-(--color-text) lg:px-8">
      <section className="mx-auto grid h-[calc(100vh-40px)] max-w-6xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) md:grid-cols-[340px_1fr]">
        <aside
          className={`${activeChat ? "hidden md:flex" : "flex"} flex-col border-r border-(--color-border)`}
        >
          <div className="border-b border-(--color-border) p-4">
            <h1 className="text-2xl font-black">Messages</h1>
           
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <p className="p-5 text-sm text-(--color-muted)">Loading chats...</p>
            ) : conversations.length ? (
              conversations.map((chat) => (
                <button
                  key={chat._id}
                  className={`flex w-full items-center gap-3 border-l-2 p-4 text-left transition ${
                    activeChat?._id === chat._id
                      ? "border-l-(--color-accent) bg-(--color-surface-strong)"
                      : "border-l-transparent hover:bg-(--color-surface-strong)"
                  }`}
                  type="button"
                  onClick={() => setSelectedChat(chat)}
                >
                  <Avatar user={chat.otherUser} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-bold">
                        {chat.otherUser?.userName}
                      </p>
                      <span className="shrink-0 text-xs text-(--color-muted)">
                        {formatRelativeTime(chat.updatedAt)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-(--color-muted)">
                      {chat.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                  {chat.isUnread &&
                    chat.lastMessage?.sender !== currentUser?._id && (
                      <span className="h-2.5 w-2.5 rounded-full bg-(--color-accent)" />
                    )}
                </button>
              ))
            ) : (
              <p className="p-5 text-sm text-(--color-muted)">
                No chats yet. Open a profile and send the first message.
              </p>
            )}
          </div>
        </aside>

        <section
          className={`${activeChat ? "flex" : "hidden md:flex"} min-w-0 flex-col`}
        >
          {activeChat ? (
            <>
              <header className="flex items-center justify-between border-b border-(--color-border) p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    className="grid h-9 w-9 place-items-center rounded-full border border-(--color-border) md:hidden"
                    type="button"
                    onClick={() => setSelectedChat(null)}
                  >
                    {"<"}
                  </button>
                  <Avatar user={activeChat.otherUser} size="h-10 w-10" />
                  <Link
                    className="truncate font-black hover:text-(--color-accent)"
                    to={`/profile/${activeChat.otherUser?._id}`}
                  >
                    {activeChat.otherUser?.userName}
                  </Link>
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto bg-(--color-bg) p-4">
                {messagesLoading ? (
                  <p className="text-sm text-(--color-muted)">
                    Loading messages...
                  </p>
                ) : messages.length ? (
                  messages.map((item) => {
                    const mine =
                      (item.sender?._id || item.sender)?.toString() ===
                      currentUser?._id;
                    return (
                      <div
                        key={item._id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm leading-6 ${
                            mine
                              ? "bg-(--color-text) text-(--color-bg)"
                              : "border border-(--color-border) bg-(--color-surface)"
                          }`}
                        >
                          <p>{item.text}</p>
                          <p
                            className={`mt-1 text-[11px] ${
                              mine ? "text-black/60" : "text-(--color-muted)"
                            }`}
                          >
                            {formatRelativeTime(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-sm text-(--color-muted)">
                    Start this chat with a message.
                  </p>
                )}
                <div ref={scrollRef} />
              </div>

              <div className="border-t border-(--color-border) p-4">
                <div className="flex gap-3">
                  <textarea
                    className="min-h-11 flex-1 resize-none rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-sm outline-none focus:border-(--color-border-strong)"
                    placeholder="Type a message..."
                    rows={1}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button
                    className="grid h-11 w-11 place-items-center rounded-xl bg-(--color-text) text-(--color-bg) disabled:opacity-50"
                    disabled={!message.trim() || sending}
                    type="button"
                    onClick={handleSend}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-(--color-border) bg-(--color-bg)">
                  <Send />
                </div>
                <h2 className="mt-5 text-2xl font-black">
                  Select a conversation
                </h2>
                <p className="mt-2 text-sm text-(--color-muted)">
                  Your developer chats will show here.
                </p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default MessagePage;
