import { Link } from "react-router";

import { useDebouncedLike } from "../../../like/hooks/useDebouncedLike";
import FeedActions from "./FeedActions";
import FeedAuthor from "./FeedAuthor";

function buildExcerpt(markdown = "") {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function FeedBlogCard({ blog, onComment }) {
  const excerpt = buildExcerpt(blog.content);
  const blogLike = useDebouncedLike({
    contentId: blog._id,
    contentType: "blog",
    isLiked: blog.isLiked,
    likeCount: blog.likeCount,
  });

  return (
    <article className="app-card rounded-2xl">
      <header className="flex items-center justify-between gap-4 border-b border-(--color-border) px-4 py-4">
        <FeedAuthor createdAt={blog.createdAt} user={blog.user} />
        <span className="app-chip rounded-full px-3 py-1 text-xs font-bold text-(--color-warn)">
          Blog
        </span>
      </header>

      <div className="p-4">
        <FeedActions
          commentCount={blog.commentCount}
          isLiked={blogLike.isLiked}
          likeCount={blogLike.likeCount}
          onComment={() => onComment(blog, "blog")}
          onLike={blogLike.toggleLike}
        />

        <Link to={`/blogs/${blog._id}`}>
          <h2 className="mt-4 text-3xl font-black leading-tight text-balance">
            {blog.title}
          </h2>
        </Link>

        <p className="mt-4 line-clamp-5 text-sm leading-7 text-(--color-muted)">
          {excerpt || "No blog content added yet."}
        </p>

        {blog.categories?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {blog.categories.slice(0, 8).map((category) => (
              <span
                className="app-chip rounded-full px-3 py-1 text-xs font-semibold"
                key={category}
              >
                #{category}
              </span>
            ))}
          </div>
        ) : null}

        <Link
          className="mt-5 inline-flex rounded-xl border border-(--color-border) bg-(--color-surface-strong) px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:border-(--color-border-strong)"
          to={`/blogs/${blog._id}`}
        >
          Read blog
        </Link>
      </div>
    </article>
  );
}

export default FeedBlogCard;
