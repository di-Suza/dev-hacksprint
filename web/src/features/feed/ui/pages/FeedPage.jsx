import { BookOpenText, FolderGit2, Loader2 } from "lucide-react";

import CommentModal from "../../../comment/ui/components/CommentModal";
import BackButton from "../../../../shared/components/BackButton";
import FeedBlogCard from "../components/FeedBlogCard";
import FeedProjectCard from "../components/FeedProjectCard";
import useFeedPage from "./useFeedPage";

const feedTabs = [
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "blogs", label: "Blogs", icon: BookOpenText },
];

function FeedSkeleton() {
  return (
    <div className="app-card rounded-2xl p-4">
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
  const {
    activeFeed,
    activeTab,
    closeCommentModal,
    commentTarget,
    currentPage,
    handleComment,
    handleTabChange,
    hasMore,
    items,
    loadMoreRef,
  } = useFeedPage();

  return (
    <main className="app-page px-5 py-8">
      <section className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <BackButton className="mb-4" />
          <p className="text-sm text-(--color-muted)">DevHub Feed</p>
          <h1 className="mt-1 text-3xl font-black">Discover what developers ship</h1>
        </header>

        <div className="app-panel sticky top-3 z-20 mb-6 rounded-2xl p-2">
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
            <div className="app-panel grid min-h-80 place-items-center rounded-2xl border-dashed p-8 text-center">
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
        onClose={closeCommentModal}
      />
    </main>
  );
}

export default FeedPage;
