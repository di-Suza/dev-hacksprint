import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { chatApi } from "../../features/message/api/chat.api";
import { notificationApi } from "../../features/notification/api/notification.api";
import { getSocket } from "../services/socket";

function MessageObserver() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();

    const syncChat = () => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    };

    const syncNotifications = () => {
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    };

    const handleReconnect = () => {
      syncChat();
      syncNotifications();
    };

    socket.off("receive-message", syncChat);
    socket.off("new_notification", syncNotifications);
    socket.off("delete_notification", syncNotifications);
    socket.off("connect", handleReconnect);
    socket.off("reconnect", handleReconnect);

    socket.on("receive-message", syncChat);
    socket.on("new_notification", syncNotifications);
    socket.on("delete_notification", syncNotifications);
    socket.on("connect", handleReconnect);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("receive-message", syncChat);
      socket.off("new_notification", syncNotifications);
      socket.off("delete_notification", syncNotifications);
      socket.off("connect", handleReconnect);
      socket.off("reconnect", handleReconnect);
    };
  }, [dispatch]);

  return null;
}

export default MessageObserver;
