import { Bell, Heart, MessageCircle, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router";

import BackButton from "../../../../shared/components/BackButton";
import { formatRelativeTime } from "../../../../shared/utils/formatRelativeTime";
import useNotificationPage from "./useNotificationPage";

const iconMap = {
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
  LIKE: Heart,
};

function NotificationPage() {
  const {
    deleteAllNotifications,
    deleteNotification,
    getNotificationLink,
    getNotificationText,
    isLoading,
    markAllRead,
    notifications,
  } = useNotificationPage();

  return (
    <main className="app-page px-4 py-6 lg:px-8">
      <div className="mx-auto mb-4 max-w-3xl">
        <BackButton />
      </div>
      <section className="app-panel mx-auto max-w-3xl rounded-2xl">
        <header className="flex flex-col gap-4 border-b border-(--color-border) p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-(--color-accent)">
              Activity center
            </p>
            <h1 className="text-3xl font-black">Notifications</h1>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-xl border border-(--color-border) px-4 py-2 text-sm font-bold hover:border-(--color-border-strong)"
              type="button"
              onClick={() => markAllRead()}
            >
              Mark read
            </button>
            <button
              className="rounded-xl border border-(--color-danger) px-4 py-2 text-sm font-bold text-(--color-danger)"
              type="button"
              onClick={() => deleteAllNotifications()}
            >
              Clear
            </button>
          </div>
        </header>

        <div className="divide-y divide-(--color-border)">
          {isLoading ? (
            <p className="p-6 text-sm text-(--color-muted)">
              Loading notifications...
            </p>
          ) : notifications.length ? (
            notifications.map((notification) => {
              const Icon = iconMap[notification.type] || Bell;
              return (
                <article
                  key={notification._id}
                  className="flex items-start gap-4 p-5 transition hover:bg-(--color-surface-strong)"
                >
                  <Link to={`/profile/${notification.sender?._id}`}>
                    {notification.sender?.profilePicture?.url ? (
                      <img
                        alt={notification.sender.userName}
                        className="h-12 w-12 rounded-full object-cover"
                        src={notification.sender.profilePicture.url}
                      />
                    ) : (
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-(--color-bg) font-black">
                        {notification.sender?.userName?.[0]?.toUpperCase() ||
                          "U"}
                      </div>
                    )}
                  </Link>

                  <Link
                    className="min-w-0 flex-1"
                    to={getNotificationLink(notification)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={
                          notification.type === "LIKE"
                            ? "text-red-400"
                            : "text-(--color-accent)"
                        }
                        size={18}
                      />
                      <p className="font-bold">{getNotificationText(notification)}</p>
                    </div>
                    <p className="mt-1 truncate text-sm text-(--color-muted)">
                      {notification.contentId?.title ||
                        notification.contentId?.userName ||
                        "Open details"}
                    </p>
                    <p className="mt-2 text-xs text-(--color-muted)">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </Link>

                  <button
                    className="grid h-9 w-9 place-items-center rounded-lg text-(--color-muted) hover:bg-(--color-bg) hover:text-(--color-danger)"
                    type="button"
                    onClick={() => deleteNotification(notification._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              );
            })
          ) : (
            <div className="grid place-items-center p-12 text-center">
              <Bell className="text-(--color-muted)" size={42} />
              <p className="mt-4 text-lg font-black">No notifications yet</p>
              <p className="mt-2 text-sm text-(--color-muted)">
                Likes, comments, and follows will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default NotificationPage;
