import { useSelector } from "react-redux";

import { notificationApi } from "../../features/notification/api/notification.api";

export function useUnreadNotificationsCount() {
  const userId = useSelector((state) => state.auth.user?._id);
  const { data } = notificationApi.endpoints.getNotifications.useQueryState(1);

  return (
    data?.notifications?.reduce((count, notification) => {
      const recipientId = notification.recipient?._id || notification.recipient;
      const hasIncomingUnread =
        notification.isRead === false && recipientId?.toString() === userId;

      return hasIncomingUnread ? count + 1 : count;
    }, 0) || 0
  );
}
