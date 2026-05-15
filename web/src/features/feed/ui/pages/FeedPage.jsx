import { BookOpenText, FolderGit2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import CommentModal from "../../../comment/ui/components/CommentModal";
import { useGetBlogFeedQuery, useGetProjectFeedQuery } from "../../api/feed.api";
import FeedBlogCard from "../components/FeedBlogCard";
import FeedProjectCard from "../components/FeedProjectCard";

const feedTabs = [
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "blogs", label: "Blogs", icon: BookOpenText },
];

function FeedSkeleton() {
  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-full bg-(--color-surface-strong)" />
        <div className="grid gap-2">
          <div className="h-4 w-32 animate-pulse rounded bg-(--color-surface-strong)" />
          <div className="h-3 w-20 animate-pulse rounded bg-(--color-surface-strong)" />
        </div>
      </div>
      <div className="mt-5 h-64 animate-pulse rounded-2xl bg-(--color-surface-strong)" />
      <div className="mt-5 h-6 w-2/3 animate-pulse rounded bg-(--color-surface-strong)" />
      <div className="mt-3 h-16 animate-pulse rounded bg-(--color-surface-strong)" />
    </div>
  );
}

function FeedPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projectPage, setProjectPage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [commentTarget, setCommentTarget] = useState(null);
  const loadMoreRef = useRef(null);
  const limit = 10;

  const projectFeed = useGetProjectFeedQuery(
    { limit, page: projectPage },
    { skip: activeTab !== "projects" },
  );
  const blogFeed = useGetBlogFeedQuery(
    { limit, page: blogPage },
    { skip: activeTab !== "blogs" },
  );

  const activeFeed = activeTab === "projects" ? projectFeed : blogFeed;
  const items = activeFeed.data?.items || [];
  const hasMore = Boolean(activeFeed.data?.hasMore);
  const currentPage = activeTab === "projects" ? projectPage : blogPage;

  const observerOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "300px 0px",
      threshold: 0,
    }),
    [],
  );

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || activeFeed.isFetching) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      if (activeTab === "projects") {
        setProjectPage((page) => page + 1);
      } else {
        setBlogPage((page) => page + 1);
      }
    }, observerOptions);

    observer.observe(target);

    return () => observer.disconnect();
  }, [activeFeed.isFetching, activeTab, hasMore, observerOptions]);

  function handleTabChange(tab) {
    setActiveTab(tab);
  }

  function handleComment(content, contentType) {
    setCommentTarget({
      contentId: content._id,
      contentType,
      commentCount: content.commentCount || 0,
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_22%_0%,rgba(112,241,201,0.08),transparent_24%),var(--color-bg)] px-5 py-8 text-(--color-text)">
      <section className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <p className="text-sm text-(--color-muted)">DevHub Feed</p>
          <h1 className="mt-1 text-3xl font-black">Discover what developers ship</h1>
        </header>

        <div className="sticky top-3 z-20 mb-6 rounded-2xl border border-(--color-border) bg-(--color-surface)/90 p-2 backdrop-blur">
          <div className="grid grid-cols-2 gap-2">
            {feedTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  className={[
                    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition",
                    isActive
                      ? "bg-(--color-text) text-(--color-bg)"
                      : "text-(--color-muted) hover:bg-(--color-surface-strong) hover:text-(--color-text)",
                  ].join(" ")}
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                >
                  <Icon size={17} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6">
          {activeFeed.isLoading ? (
            <>
              <FeedSkeleton />
              <FeedSkeleton />
            </>
          ) : null}

          {!activeFeed.isLoading && !items.length ? (
            <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface) p-8 text-center">
              <div>
                <p className="text-2xl font-black">Nothing here yet</p>
                <p className="mt-2 text-sm leading-6 text-(--color-muted)">
                  {activeTab === "projects"
                    ? "Projects will appear here once developers publish them."
                    : "Published blogs will appear here once developers write them."}
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === "projects"
            ? items.map((project) => (
                <FeedProjectCard
                  key={project._id}
                  project={project}
                  onComment={handleComment}
                />
              ))
            : items.map((blog) => (
                <FeedBlogCard key={blog._id} blog={blog} onComment={handleComment} />
              ))}

          <div className="h-10" ref={loadMoreRef} />

          {activeFeed.isFetching && currentPage > 1 ? (
            <div className="flex justify-center py-4 text-(--color-muted)">
              <Loader2 className="animate-spin" size={22} aria-hidden="true" />
            </div>
          ) : null}

          {!hasMore && items.length ? (
            <p className="pb-4 text-center text-xs text-(--color-muted)">
              You are all caught up.
            </p>
          ) : null}
        </div>
      </section>

      <CommentModal
        commentCount={commentTarget?.commentCount || 0}
        contentId={commentTarget?.contentId}
        contentType={commentTarget?.contentType}
        isOpen={Boolean(commentTarget)}
        onClose={() => setCommentTarget(null)}
      />
    </main>
  );
}

export default FeedPage;
