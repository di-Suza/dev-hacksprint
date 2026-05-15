import { Link } from "react-router";

import { formatRelativeTime } from "../../../../shared/utils/formatRelativeTime";

function FeedAuthor({ createdAt, user }) {
  const profileUrl = user?.profilePicture?.url;

  return (
    <Link
      className="flex min-w-0 items-center gap-3"
      to={user?._id ? `/profile/${user._id}` : "/feed"}
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-(--color-border-strong) bg-(--color-surface-strong)">
        {profileUrl ? (
          <img
            alt={user?.userName || "Developer"}
            className="h-full w-full object-cover"
            src={profileUrl}
          />
        ) : (
          <span className="text-sm font-black">
            {(user?.userName || "D").slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-black">{user?.userName || "Developer"}</p>
        <p className="truncate text-xs text-(--color-muted)">
          {formatRelativeTime(createdAt)}
        </p>
      </div>
    </Link>
  );
}

export default FeedAuthor;
