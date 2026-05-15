import { X } from "lucide-react";
import { Link } from "react-router";

import {
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "../../api/profile.api";

function FollowListModal({ onClose, type, userId }) {
  const isFollowers = type === "followers";
  const title = isFollowers ? "Followers" : "Following";
  const followersQuery = useGetFollowersQuery(
    { page: 1, userId },
    { skip: !userId || !isFollowers },
  );
  const followingQuery = useGetFollowingQuery(
    { page: 1, userId },
    { skip: !userId || isFollowers },
  );
  const activeQuery = isFollowers ? followersQuery : followingQuery;
  const users =
    (isFollowers
      ? activeQuery.data?.followers
      : activeQuery.data?.following) || [];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <section className="flex h-[70vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) text-(--color-text) shadow-2xl">
        <header className="flex items-center justify-between border-b border-(--color-border) px-5 py-4">
          <div>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="text-sm text-(--color-muted)">
              {activeQuery.data?.hasMore
                ? "Showing latest people"
                : `${users.length} ${users.length === 1 ? "person" : "people"}`}
            </p>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-(--color-bg)"
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-3">
          {activeQuery.isLoading ? (
            <p className="p-4 text-sm text-(--color-muted)">Loading...</p>
          ) : users.length ? (
            users.map((user) => (
              <Link
                className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-(--color-bg)"
                key={user._id}
                to={`/profile/${user._id}`}
                onClick={onClose}
              >
                {user.profilePicture?.url ? (
                  <img
                    alt={user.userName}
                    className="h-12 w-12 rounded-full object-cover"
                    src={user.profilePicture.url}
                  />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-(--color-bg) font-black">
                    {user.userName?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold">{user.userName}</p>
                  <p className="truncate text-sm text-(--color-muted)">
                    {user.headline || "Developer on DevHub"}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="grid h-full place-items-center p-8 text-center">
              <div>
                <p className="text-lg font-black">No {title.toLowerCase()} yet</p>
                <p className="mt-2 text-sm text-(--color-muted)">
                  This list will appear here once people connect.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default FollowListModal;
