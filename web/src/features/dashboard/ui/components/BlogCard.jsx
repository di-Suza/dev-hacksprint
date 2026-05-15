import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";

function buildExcerpt(markdown = "") {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function BlogCard({
  blog,
  isDeleting,
  isUpdatingStatus,
  onDelete,
  onEdit,
  onTogglePublishStatus,
}) {
  const excerpt = buildExcerpt(blog.content);
  const isPublished = Boolean(blog.isPublished);

  return (
    <article className="app-card flex min-h-[310px] flex-col rounded-2xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase text-(--color-muted)">
              Tech Blog
            </p>
            <span
              className={[
                "rounded-full px-2.5 py-1 text-[11px] font-bold",
                isPublished
                  ? "bg-[rgba(112,241,201,0.12)] text-(--color-accent)"
                  : "bg-(--color-bg) text-(--color-warn)",
              ].join(" ")}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-xl font-black">{blog.title}</h3>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            aria-label={`Edit ${blog.title}`}
            className="grid h-9 w-9 place-items-center rounded-lg border border-(--color-border) text-(--color-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text)"
            type="button"
            onClick={() => onEdit?.(blog)}
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
          <button
            aria-label={`Delete ${blog.title}`}
            className="grid h-9 w-9 place-items-center rounded-lg border border-red-500/30 text-red-300 transition hover:border-red-400/70 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDeleting}
            type="button"
            onClick={() => onDelete?.(blog)}
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="mt-4 line-clamp-4 text-sm leading-6 text-(--color-muted)">
        {excerpt || "No blog content added yet."}
      </p>

      <div className="mt-4 min-h-8">
        {blog.categories?.length ? (
          <div className="flex flex-wrap gap-2">
            {blog.categories.slice(0, 4).map((category) => (
              <span
                className="app-chip rounded-full px-2.5 py-1 text-xs"
                key={category}
              >
                {category}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-auto grid gap-3 pt-5">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-(--color-border) px-4 py-2 text-sm font-semibold text-(--color-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isUpdatingStatus}
          type="button"
          onClick={() => onTogglePublishStatus?.(blog)}
        >
          {isPublished ? (
            <EyeOff size={15} aria-hidden="true" />
          ) : (
            <Eye size={15} aria-hidden="true" />
          )}
          {isPublished ? "Unpublish" : "Publish"}
        </button>

        <Link
          className="mx-auto rounded-lg border border-(--color-border) px-4 py-2 text-sm font-semibold transition hover:border-(--color-border-strong)"
          to={`/blogs/${blog._id}`}
        >
          View
        </Link>
      </div>
    </article>
  );
}

export default BlogCard;
