import {
  Bell,
  Home,
  LayoutDashboard,
  MessageCircle,
  Search,
} from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { useGetConversationsQuery } from "../../features/message/api/chat.api";
import { useGetNotificationsQuery } from "../../features/notification/api/notification.api";
import { useUnreadMessagesCount } from "../../shared/hooks/useUnreadMessagesCount";
import { useUnreadNotificationsCount } from "../../shared/hooks/useUnreadNotificationsCount";

const navItems = [
  { label: "Home", to: "/feed", icon: Home },
  { label: "Search", to: "/search", icon: Search },
  { countKey: "messages", label: "Message", to: "/messages", icon: MessageCircle },
  { countKey: "notifications", label: "Notification", to: "/notifications", icon: Bell },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
];

function SidebarLayout() {
  useGetConversationsQuery();
  useGetNotificationsQuery(1);

  const unreadMessagesCount = useUnreadMessagesCount();
  const unreadNotificationsCount = useUnreadNotificationsCount();
  const counts = {
    messages: unreadMessagesCount,
    notifications: unreadNotificationsCount,
  };

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text)">
      <aside className="group fixed inset-y-0 left-0 z-40 hidden w-18 overflow-hidden border-r border-(--color-border) bg-(--color-surface) px-3 py-5 shadow-[30px_0_90px_rgba(0,0,0,0.35)] transition-[width] duration-300 ease-out hover:w-64 lg:block">
        <NavLink className="flex items-center gap-3 px-2 text-2xl font-black" to="/feed">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-(--color-text) text-sm text-(--color-bg)">
            D
          </span>
          <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            DevHub
          </span>
        </NavLink>

        <nav className="mt-8 grid gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const count = counts[item.countKey] || 0;

            return (
              <NavLink
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition",
                    isActive
                      ? "border-(--color-accent) bg-[rgba(112,241,201,0.14)] text-(--color-accent) shadow-[0_0_24px_rgba(112,241,201,0.16)]"
                      : "border-transparent text-(--color-muted) hover:bg-(--color-surface-strong) hover:text-(--color-text)",
                  ].join(" ")
                }
                key={item.to}
                to={item.to}
              >
                <span className="relative shrink-0">
                  <Icon size={20} aria-hidden="true" />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-(--color-danger) px-1 text-[10px] font-black leading-none text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-(--color-border) bg-(--color-surface) lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const count = counts[item.countKey] || 0;

          return (
            <NavLink
              className={({ isActive }) =>
                [
                  "grid justify-items-center gap-1 border-t-2 px-2 py-2 text-[11px]",
                  isActive
                    ? "border-(--color-accent) text-(--color-accent)"
                    : "border-transparent text-(--color-muted)",
                ].join(" ")
              }
              key={item.to}
              to={item.to}
            >
              <span className="relative">
                <Icon size={19} aria-hidden="true" />
                {count > 0 && (
                  <span className="absolute -right-2.5 -top-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-(--color-danger) px-1 text-[10px] font-black leading-none text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="min-h-screen pb-16 lg:pb-0">
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarLayout;
