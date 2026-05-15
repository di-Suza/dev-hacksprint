import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import FullPageLoader from "../../shared/components/FullPageLoader";
import { chatApi, useGetConversationsQuery } from "../../features/message/api/chat.api";
import {
  notificationApi,
  useGetNotificationsQuery,
} from "../../features/notification/api/notification.api";
import { getSocket } from "../../shared/services/socket";
import MessageObserver from "../../shared/utils/MessageObserver";
import SidebarLayout from "./SidebarLayout";

function ProtectedLayout() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoggedOut, status, userId } = useSelector(
    (state) => ({
      isLoggedOut: state.auth.isLoggedOut,
      status: state.auth.status,
      userId: state.auth.user?._id,
    }),
    shallowEqual
  );

  useGetConversationsQuery(undefined, { skip: !userId });
  useGetNotificationsQuery(1, { skip: !userId });

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleReconnect = () => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    };

    socket.off("connect", handleReconnect);
    socket.off("reconnect", handleReconnect);
    socket.on("connect", handleReconnect);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
      socket.off("reconnect", handleReconnect);
    };
  }, [dispatch, userId]);

  if (userId) {
    return (
      <>
        <MessageObserver />
        <SidebarLayout />
      </>
    );
  }

  if ((status === "idle" || status === "loading") && !isLoggedOut) {
    return <FullPageLoader isLoading={true} />;
  }

  if (isLoggedOut || status === "failed") {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <FullPageLoader isLoading={true} />;
}

export default ProtectedLayout;
