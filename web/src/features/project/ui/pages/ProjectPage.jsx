import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitBranch,
  Heart,
  Image,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router";

import CommentModal from "../../../comment/ui/components/CommentModal";
import BackButton from "../../../../shared/components/BackButton";
import { formatRelativeTime } from "../../../../shared/utils/formatRelativeTime";
import useProjectPage from "./useProjectPage";

function ProjectPage() {
  const {
    activeImage,
    activeImageIndex,
    author,
    authorPicture,
    error,
    hasMultipleImages,
    images,
    isCommentModalOpen,
    isError,
    isLoading,
    project,
    projectLike,
    refetch,
    setActiveImageIndex,
    setIsCommentModalOpen,
    showNextImage,
    showPreviousImage,
  } = useProjectPage();

  if (isLoading) {
    return (
      <main className="app-page px-5 py-8">
        <div className="app-panel mx-auto max-w-5xl rounded-2xl p-6">
          <BackButton className="mb-4" />
          <div className="h-12 w-52 animate-pulse rounded-xl bg-(--color-surface-strong)" />
          <div className="mt-5 aspect-video animate-pulse rounded-2xl bg-(--color-surface-strong)" />
          <div className="mt-5 h-8 w-2/3 animate-pulse rounded-lg bg-(--color-surface-strong)" />
          <div className="mt-3 h-20 animate-pulse rounded-lg bg-(--color-surface-strong)" />
        </div>
      </main>
    );
  }

  if (isError || !project) {
    return (
      <main className="app-page grid place-items-center px-5 py-8">
        <section className="app-panel w-full max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-(--color-surface-strong) text-(--color-danger)">
            !
          </div>
          <h1 className="mt-4 text-2xl font-black">Project not found</h1>
          <p className="mt-2 text-sm leading-6 text-(--color-muted)">
            {error?.data?.message || "This project could not be loaded right now."}
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
      <div className="mx-auto mb-4 max-w-5xl">
        <BackButton />
      </div>
      <article className="app-panel mx-auto max-w-5xl overflow-hidden rounded-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-(--color-border) px-4 py-4 sm:px-5">
          <Link
            className="flex min-w-0 items-center gap-3"
            to={author?._id ? `/profile/${author._id}` : "/feed"}
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-(--color-border-strong) bg-(--color-surface-strong)">
              {authorPicture ? (
                <img
                  alt={author?.userName || "Project owner"}
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
                {formatRelativeTime(project.createdAt)}
              </p>
            </div>
          </Link>
        </header>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-(--color-border) lg:border-b-0 lg:border-r">
            <div className="media-frame relative grid aspect-[4/3] max-h-[720px] min-h-[320px] place-items-center">
              {activeImage ? (
                <img
                  alt={project.title}
                  className="h-full w-full object-contain object-center"
                  src={activeImage}
                />
              ) : (
                <div className="grid gap-3 justify-items-center text-(--color-muted)">
                  <Image size={34} aria-hidden="true" />
                  <p className="text-sm">No project image added</p>
                </div>
              )}

              {hasMultipleImages ? (
                <>
                  <button
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:bg-black/80"
                    type="button"
                    onClick={showPreviousImage}
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                    <span className="sr-only">Previous image</span>
                  </button>
                  <button
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:bg-black/80"
                    type="button"
                    onClick={showNextImage}
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                    <span className="sr-only">Next image</span>
                  </button>
                </>
              ) : null}
            </div>

            {hasMultipleImages ? (
              <div className="flex items-center justify-center gap-2 border-t border-(--color-border) bg-(--color-surface) px-4 py-3">
                {images.map((image, index) => (
                  <button
                    aria-label={`Show image ${index + 1}`}
                    className={[
                      "h-2.5 rounded-full transition-all",
                      index === activeImageIndex
                        ? "w-7 bg-(--color-accent)"
                        : "w-2.5 bg-(--color-border-strong) hover:bg-(--color-muted)",
                    ].join(" ")}
                    key={image.fileId || image.url}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <button
                className={[
                  "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-semibold transition hover:bg-(--color-surface-strong) disabled:cursor-not-allowed disabled:opacity-60",
                  projectLike.isLiked
                    ? "text-(--color-danger)"
                    : "text-(--color-muted) hover:text-(--color-text)",
                ].join(" ")}
                disabled={projectLike.isSyncingLike}
                type="button"
                onClick={projectLike.toggleLike}
              >
                <Heart
                  fill={projectLike.isLiked ? "currentColor" : "none"}
                  size={22}
                  aria-hidden="true"
                />
                {projectLike.likeCount ? <span>{projectLike.likeCount}</span> : null}
                <span className="sr-only">Like project</span>
              </button>
              <button
                className="inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-semibold text-(--color-muted) transition hover:bg-(--color-surface-strong) hover:text-(--color-text)"
                type="button"
                onClick={() => setIsCommentModalOpen(true)}
              >
                <MessageCircle size={22} aria-hidden="true" />
                {project.commentCount ? <span>{project.commentCount}</span> : null}
                <span className="sr-only">Comment on project</span>
              </button>
            </div>

            <div className="mt-6">
              <h1 className="text-3xl font-black leading-tight">{project.title}</h1>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-(--color-muted)">
                {project.description || "No description added for this project."}
              </p>
            </div>

            {project.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    className="app-chip rounded-full px-3 py-1.5 text-xs font-semibold"
                    key={tag}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {project.githubLink ? (
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-strong) px-4 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-(--color-border-strong)"
                  href={project.githubLink}
                  rel="noreferrer"
                  target="_blank"
                >
                  <GitBranch size={18} aria-hidden="true" />
                  GitHub
                </a>
              ) : null}

              {project.liveLink ? (
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-accent) bg-(--color-accent) px-4 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:opacity-90"
                  href={project.liveLink}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink size={18} aria-hidden="true" />
                  Live Preview
                </a>
              ) : null}
            </div>

          </div>
        </section>
      </article>
      <CommentModal
        commentCount={project.commentCount || 0}
        contentId={project._id}
        contentType="project"
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </main>
  );
}

export default ProjectPage;
