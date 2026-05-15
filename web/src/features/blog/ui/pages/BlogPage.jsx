import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

import CommentModal from "../../../comment/ui/components/CommentModal";
import { useDebouncedLike } from "../../../like/hooks/useDebouncedLike";
import { formatRelativeTime } from "../../../../shared/utils/formatRelativeTime";
import { useGetBlogByIdQuery } from "../../api/blog.api";

function BlogPage() {
  const { id } = useParams();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { data, error, isError, isLoading, refetch } = useGetBlogByIdQuery(id, {
    skip: !id,
  });

  const blog = data?.blog;
  const author = blog?.user;
  const authorPicture = author?.profilePicture?.url;
  const blogLike = useDebouncedLike({
    contentId: blog?._id,
    contentType: "blog",
    isLiked: blog?.isLiked,
    likeCount: blog?.likeCount,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--color-bg) px-5 py-8 text-(--color-text)">
        <div className="mx-auto max-w-4xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
          <div className="h-12 w-52 animate-pulse rounded-xl bg-(--color-surface-strong)" />
          <div className="mt-8 h-12 w-3/4 animate-pulse rounded-xl bg-(--color-surface-strong)" />
          <div className="mt-5 h-72 animate-pulse rounded-2xl bg-(--color-surface-strong)" />
        </div>
      </main>
    );
  }

  if (isError || !blog) {
    return (
      <main className="grid min-h-screen place-items-center bg-(--color-bg) px-5 py-8 text-(--color-text)">
        <section className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-center">
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_22%_0%,rgba(112,241,201,0.08),transparent_24%),var(--color-bg)] px-5 py-8 text-(--color-text)">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
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

          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-(--color-border) text-(--color-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text)"
            type="button"
          >
            <MoreHorizontal size={20} aria-hidden="true" />
            <span className="sr-only">Blog options</span>
          </button>
        </header>

        <section className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
            {!blog.isPublished ? (
              <span className="mb-4 inline-flex rounded-full bg-(--color-bg) px-3 py-1.5 text-xs font-bold text-(--color-warn)">
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
                    className="rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1.5 text-xs font-semibold text-(--color-muted)"
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
            className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-bg) p-4 sm:p-6"
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
