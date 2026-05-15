import { Send, Trash2, X } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button";
import { formatRelativeTime } from "../../../../shared/utils/formatRelativeTime";
import useCommentModal from "./useCommentModal";

function CommentAvatar({ user }) {
  const profileUrl = user?.profilePicture?.url;

  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-(--color-border) bg-(--color-surface-strong)">
      {profileUrl ? (
        <img
          alt={user?.userName || "User"}
          className="h-full w-full object-cover"
          src={profileUrl}
        />
      ) : (
        <span className="text-xs font-black">
          {(user?.userName || "D").slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function CommentModal({
  commentCount = 0,
  contentId,
  contentType,
  isOpen,
  onClose,
}) {
  const {
    commentText,
    comments,
    handleCreateComment,
    handleDeleteComment,
    isCreating,
    isDeleting,
    isFetching,
    isLoading,
    setCommentText,
  } = useCommentModal({ commentCount, contentId, contentType, isOpen });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 py-6 backdrop-blur-md">
      <section className="app-panel flex h-[78vh] max-h-[720px] min-h-[560px] w-full max-w-xl flex-col overflow-hidden rounded-2xl">
        <header className="flex items-center justify-between border-b border-(--color-border) px-4 py-3">
          <div>
            <h2 className="text-lg font-black">Comments</h2>
            <p className="text-xs text-(--color-muted)">
              {commentCount ? `${commentCount} comment` : "No comments yet"}
            </p>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-(--color-muted) transition hover:bg-(--color-surface-strong) hover:text-(--color-text)"
            type="button"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
            <span className="sr-only">Close comments</span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {isLoading || isFetching ? (
            <p className="text-sm text-(--color-muted)">Loading comments...</p>
          ) : null}

          {!isLoading && !comments.length ? (
            <div className="grid min-h-48 place-items-center text-center">
              <div>
                <p className="text-lg font-black">Start the conversation</p>
                <p className="mt-2 text-sm text-(--color-muted)">
                  Add the first comment on this {contentType}.
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4">
            {comments.map((comment) => (
              <article
                className="flex items-start gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-3"
                key={comment._id}
              >
                <CommentAvatar user={comment.user} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-black">
                      {comment.user?.userName || "Developer"}
                    </p>
                    <span className="text-xs text-(--color-dim)">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                    {comment.isOptimistic ? (
                      <span className="text-xs text-(--color-accent)">Posting</span>
                    ) : null}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-(--color-muted)">
                    {comment.comment}
                  </p>
                </div>

                {comment.canDelete ? (
                  <button
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-(--color-muted) transition hover:bg-red-500/10 hover:text-(--color-danger) disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isDeleting || comment.isOptimistic}
                    type="button"
                    onClick={() => handleDeleteComment(comment)}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    <span className="sr-only">Delete comment</span>
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <form
          className="flex gap-3 border-t border-(--color-border) p-4"
          onSubmit={handleCreateComment}
        >
          <input
            className="min-w-0 flex-1 rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-sm outline-none transition placeholder:text-(--color-muted) focus:border-(--color-border-strong)"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <Button disabled={!commentText.trim() || isCreating} type="submit">
            <Send size={16} aria-hidden="true" />
            Post
          </Button>
        </form>
      </section>
    </div>
  );
}

export default CommentModal;
