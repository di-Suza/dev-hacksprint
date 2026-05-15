import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router";

import CommentModal from "../../../comment/ui/components/CommentModal";
import BackButton from "../../../../shared/components/BackButton";
import { formatRelativeTime } from "../../../../shared/utils/formatRelativeTime";
import useBlogPage from "./useBlogPage";

function BlogPage() {
  const {
    author,
    authorPicture,
    blog,
    blogLike,
    error,
    isCommentModalOpen,
    isError,
    isLoading,
    refetch,
    setIsCommentModalOpen,
  } = useBlogPage();

  if (isLoading) {
    return (
      <main className="app-page px-5 py-8">
        <div className="app-panel mx-auto max-w-4xl rounded-2xl p-6">
          <BackButton className="mb-4" />
          <div className="h-12 w-52 animate-pulse rounded-xl bg-(--color-surface-strong)" />
          <div className="mt-8 h-12 w-3/4 animate-pulse rounded-xl bg-(--color-surface-strong)" />
          <div className="mt-5 h-72 animate-pulse rounded-2xl bg-(--color-surface-strong)" />
        </div>
      </main>
    );
  }

  if (isError || !blog) {
    return (
      <main className="app-page grid place-items-center px-5 py-8">
        <section className="app-panel w-full max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-(--color-surface-strong) text-(--color-danger)">
            !
          </div>
          <h1 className="mt-4 text-2xl font-black">Blog not found</h1>
          <p className="mt-2 text-sm leading-6 text-(--color-muted)">
            {error?.data?.message || "This blog could not be loaded right now."}
          </p>
          <button
            className="mt-5 rounded-lg border border-(--color-border) px-4 py-2 text-sm font-semibold transition hover:border-(--color-border-strong)"
            type="button"
            onClick={refetch}
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-page px-5 py-8">
      <div className="mx-auto mb-4 max-w-4xl">
        <BackButton />
      </div>
      <article className="app-panel mx-auto max-w-4xl overflow-hidden rounded-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-(--color-border) px-4 py-4 sm:px-5">
          <Link
            className="flex min-w-0 items-center gap-3"
            to={author?._id ? `/profile/${author._id}` : "/feed"}
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-(--color-border-strong) bg-(--color-surface-strong)">
              {authorPicture ? (
                <img
                  alt={author?.userName || "Blog author"}
                  className="h-full w-full object-cover"
                  src={authorPicture}
                />
              ) : (
                <span className="text-sm font-black">
                  {(author?.userName || "D").slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black">
                {author?.userName || "Developer"}
              </p>
              <p className="truncate text-xs text-(--color-muted)">
                {formatRelativeTime(blog.createdAt)}
              </p>
            </div>
          </Link>
        </header>

        <section className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
            {!blog.isPublished ? (
              <span className="app-chip mb-4 inline-flex rounded-full px-3 py-1.5 text-xs font-bold text-(--color-warn)">
                Draft preview
              </span>
            ) : null}
            <h1 className="text-4xl font-black leading-tight text-balance">
              {blog.title}
            </h1>

            {blog.categories?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {blog.categories.map((category) => (
                  <span
                    className="app-chip rounded-full px-3 py-1.5 text-xs font-semibold"
                    key={category}
                  >
                    #{category}
                  </span>
                ))}
              </div>
            ) : null}
            </div>

            <div className="flex shrink-0 flex-col items-center gap-2">
              <button
                className={[
                  "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-semibold transition hover:bg-(--color-surface-strong) disabled:cursor-not-allowed disabled:opacity-60",
                  blogLike.isLiked
                    ? "text-(--color-danger)"
                    : "text-(--color-muted) hover:text-(--color-text)",
                ].join(" ")}
                disabled={blogLike.isSyncingLike}
                type="button"
                onClick={blogLike.toggleLike}
              >
                <Heart
                  fill={blogLike.isLiked ? "currentColor" : "none"}
                  size={22}
                  aria-hidden="true"
                />
                {blogLike.likeCount ? <span>{blogLike.likeCount}</span> : null}
                <span className="sr-only">Like blog</span>
              </button>
              <button
                className="inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-semibold text-(--color-muted) transition hover:bg-(--color-surface-strong) hover:text-(--color-text)"
                type="button"
                onClick={() => setIsCommentModalOpen(true)}
              >
                <MessageCircle size={22} aria-hidden="true" />
                {blog.commentCount ? <span>{blog.commentCount}</span> : null}
                <span className="sr-only">Comment on blog</span>
              </button>
            </div>
          </div>

          <div
            className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-bg)/70 p-4 shadow-inner sm:p-6"
            data-color-mode="dark"
          >
            <MDEditor.Markdown
              source={blog.content}
              style={{
                backgroundColor: "transparent",
                color: "var(--color-text)",
              }}
            />
          </div>
        </section>
      </article>
      <CommentModal
        commentCount={blog.commentCount || 0}
        contentId={blog._id}
        contentType="blog"
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </main>
  );
}

export default BlogPage;
