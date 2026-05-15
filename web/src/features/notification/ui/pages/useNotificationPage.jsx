import {
  useDeleteAllNotificationsMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "../../api/notification.api";

function getNotificationText(notification) {
  const name = notification.sender?.userName || "Someone";
  if (notification.type === "FOLLOW") return `${name} started following you`;
  if (notification.type === "COMMENT") return `${name} commented on your post`;
  return `${name} liked your post`;
}

function getNotificationLink(notification) {
  if (notification.contentType === "project") {
    return `/projects/${notification.contentId?._id || notification.contentId}`;
  }
  if (notification.contentType === "blog") {
    return `/blogs/${notification.contentId?._id || notification.contentId}`;
  }
  return `/profile/${notification.sender?._id}`;
}

function useNotificationPage() {
  const { data, isLoading } = useGetNotificationsQuery(1);
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
  const notifications = data?.notifications || [];

  return {
    deleteAllNotifications,
    deleteNotification,
    getNotificationLink,
    getNotificationText,
    isLoading,
    markAllRead,
    notifications,
  };
}

export default useNotificationPage;
