import { Heart, MessageCircle } from "lucide-react";

function FeedActions({
  commentCount = 0,
  isLiked = false,
  likeCount = 0,
  onComment,
  onLike,
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        className={[
          "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-semibold transition hover:bg-(--color-surface-strong)",
          isLiked
            ? "text-(--color-danger)"
            : "text-(--color-muted) hover:text-(--color-text)",
        ].join(" ")}
        type="button"
        onClick={onLike}
      >
        <Heart fill={isLiked ? "currentColor" : "none"} size={22} aria-hidden="true" />
        {likeCount ? <span>{likeCount}</span> : null}
      </button>

      <button
        className="inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-semibold text-(--color-muted) transition hover:bg-(--color-surface-strong) hover:text-(--color-text)"
        type="button"
        onClick={onComment}
      >
        <MessageCircle size={22} aria-hidden="true" />
        {commentCount ? <span>{commentCount}</span> : null}
      </button>
    </div>
  );
}

export default FeedActions;
