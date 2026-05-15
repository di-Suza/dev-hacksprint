import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitBranch,
  Heart,
  Image,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

import CommentModal from "../../../comment/ui/components/CommentModal";
import { useDebouncedLike } from "../../../like/hooks/useDebouncedLike";
import { formatRelativeTime } from "../../../../shared/utils/formatRelativeTime";
import { useGetProjectByIdQuery } from "../../api/project.api";

function ProjectPage() {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { data, error, isError, isLoading, refetch } =
    useGetProjectByIdQuery(id, {
      skip: !id,
    });

  const project = data?.project;
  const images = project?.images || [];
  const activeImage = images[activeImageIndex]?.url;
  const author = project?.user;
  const authorPicture = author?.profilePicture?.url;
  const hasMultipleImages = images.length > 1;
  const projectLike = useDebouncedLike({
    contentId: project?._id,
    contentType: "project",
    isLiked: project?.isLiked,
    likeCount: project?.likeCount,
  });

  function showPreviousImage() {
    setActiveImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }

  function showNextImage() {
    setActiveImageIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--color-bg) px-5 py-8 text-(--color-text)">
        <div className="mx-auto max-w-5xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
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
      <main className="grid min-h-screen place-items-center bg-(--color-bg) px-5 py-8 text-(--color-text)">
        <section className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-center">
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_22%_0%,rgba(112,241,201,0.08),transparent_24%),var(--color-bg)] px-5 py-8 text-(--color-text)">
      <article className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
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

          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-(--color-border) text-(--color-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text)"
            type="button"
          >
            <MoreHorizontal size={20} aria-hidden="true" />
            <span className="sr-only">Project options</span>
          </button>
        </header>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-(--color-border) lg:border-b-0 lg:border-r">
            <div className="relative grid aspect-[4/3] max-h-[720px] min-h-[320px] place-items-center bg-black">
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
                    className="rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1.5 text-xs font-semibold text-(--color-muted)"
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-strong) px-4 py-3 text-sm font-bold transition hover:border-(--color-border-strong)"
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--color-text) px-4 py-3 text-sm font-bold text-(--color-bg) transition hover:bg-white"
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
