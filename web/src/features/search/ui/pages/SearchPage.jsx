import { BookOpenText, FolderGit2, Loader2, Search, Users } from "lucide-react";

import CommentModal from "../../../comment/ui/components/CommentModal";
import FeedBlogCard from "../../../feed/ui/components/FeedBlogCard";
import FeedProjectCard from "../../../feed/ui/components/FeedProjectCard";
import BackButton from "../../../../shared/components/BackButton";
import UserCard from "../components/UserCard";
import useSearchPage from "./useSearchPage";

const searchTabs = [
  { id: "users", label: "Users", icon: Users },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "blogs", label: "Blogs", icon: BookOpenText },
];

function SearchSkeleton() {
  return (
    <div className="app-card rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-full bg-(--color-surface-strong)" />
        <div className="grid gap-2 flex-1">
          <div className="h-4 w-32 animate-pulse rounded bg-(--color-surface-strong)" />
          <div className="h-3 w-20 animate-pulse rounded bg-(--color-surface-strong)" />
        </div>
      </div>
      <div className="mt-5 h-16 animate-pulse rounded bg-(--color-surface-strong)" />
    </div>
  );
}

function SearchPage() {
  const {
    activeSearch,
    activeTab,
    closeCommentModal,
    commentTarget,
    debouncedQuery,
    handleComment,
    handleTabChange,
    hasMore,
    items,
    loadMoreRef,
    localQuery,
    setLocalQuery,
    totalItems,
  } = useSearchPage();

  return (
    <main className="app-page px-5 py-8">
      <section className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <BackButton className="mb-4" />
          <p className="text-sm text-(--color-muted)">DevHub Search</p>
          <h1 className="mt-1 text-3xl font-black">Find developers, projects & blogs</h1>
        </header>

        <form className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-muted)"
              size={20}
              aria-hidden="true"
            />
            <input
              className="w-full rounded-2xl border border-(--color-border) bg-(--color-surface)/92 py-3 pl-12 pr-4 text-(--color-text) shadow-sm outline-none transition placeholder:text-(--color-muted) focus:border-(--color-accent) focus:ring-2 focus:ring-[var(--ring-soft)]"
              placeholder="Search users, projects, skills, topics..."
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>
        </form>

        {debouncedQuery && (
          <>
            <div className="app-panel sticky top-3 z-20 mb-6 rounded-2xl p-2">
              <div className="grid grid-cols-3 gap-2">
                {searchTabs.map((tab) => {
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

            <p className="mb-4 text-sm text-(--color-muted)">
              Found {totalItems} {activeTab === "users" ? "user" : activeTab === "projects" ? "project" : "blog"}
              {totalItems !== 1 ? "s" : ""} for "{debouncedQuery}"
            </p>

            <div className="grid gap-6">
              {activeSearch.isLoading ? (
                <>
                  <SearchSkeleton />
                  <SearchSkeleton />
                  <SearchSkeleton />
                </>
              ) : null}

              {!activeSearch.isLoading && !items.length ? (
                <div className="app-panel grid min-h-80 place-items-center rounded-2xl border-dashed p-8 text-center">
                  <div>
                    <p className="text-2xl font-black">No results found</p>
                    <p className="mt-2 text-sm leading-6 text-(--color-muted)">
                      Try searching with different keywords
                    </p>
                  </div>
                </div>
              ) : null}

              {activeTab === "users"
                ? items.map((user) => <UserCard key={user._id} user={user} />)
                : activeTab === "projects"
                  ? items.map((project) => (
                      <FeedProjectCard
                        key={project._id}
                        project={project}
                        onComment={handleComment}
                      />
                    ))
                  : items.map((blog) => (
                      <FeedBlogCard
                        key={blog._id}
                        blog={blog}
                        onComment={handleComment}
                      />
                    ))}

              <div className="h-10" ref={loadMoreRef} />

              {activeSearch.isFetching && (
                <div className="flex justify-center py-4 text-(--color-muted)">
                  <Loader2 className="animate-spin" size={22} aria-hidden="true" />
                </div>
              )}

              {!hasMore && items.length ? (
                <p className="pb-4 text-center text-xs text-(--color-muted)">
                  You've seen all results
                </p>
              ) : null}
            </div>
          </>
        )}

        {!debouncedQuery && (
          <div className="app-panel grid min-h-[60vh] place-items-center rounded-2xl border-dashed p-8 text-center">
            <div>
              <Search size={48} className="mx-auto mb-4 text-(--color-muted)" aria-hidden="true" />
              <p className="text-2xl font-black">Start searching</p>
              <p className="mt-2 text-sm leading-6 text-(--color-muted)">
                Search for developers by name, skills, interests, or find projects and blogs by tags and topics
              </p>
            </div>
          </div>
        )}
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

export default SearchPage;
