import { ExternalLink, GitBranch, Image } from "lucide-react";
import { Link } from "react-router";

import { useDebouncedLike } from "../../../like/hooks/useDebouncedLike";
import FeedActions from "./FeedActions";
import FeedAuthor from "./FeedAuthor";

function FeedProjectCard({ onComment, project }) {
  const coverImage = project?.images?.[0]?.url;
  const projectLike = useDebouncedLike({
    contentId: project._id,
    contentType: "project",
    isLiked: project.isLiked,
    likeCount: project.likeCount,
  });

  return (
    <article className="app-card overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between gap-4 border-b border-(--color-border) px-4 py-4">
        <FeedAuthor createdAt={project.createdAt} user={project.user} />
        <span className="app-chip rounded-full px-3 py-1 text-xs font-bold text-(--color-accent)">
          Project
        </span>
      </header>

      <Link
        className="media-frame relative grid h-[360px] max-h-[56vh] min-h-[240px] place-items-center overflow-hidden sm:h-[430px]"
        to={`/projects/${project._id}`}
      >
        {coverImage ? (
          <img
            alt={project.title}
            className="block h-full w-full object-contain object-center"
            src={coverImage}
          />
        ) : (
          <div className="grid gap-3 justify-items-center text-(--color-muted)">
            <Image size={34} aria-hidden="true" />
            <p className="text-sm">No project image added</p>
          </div>
        )}
      </Link>

      <div className="p-4">
        <FeedActions
          commentCount={project.commentCount}
          isLiked={projectLike.isLiked}
          likeCount={projectLike.likeCount}
          onComment={() => onComment(project, "project")}
          onLike={projectLike.toggleLike}
        />

        <Link to={`/projects/${project._id}`}>
          <h2 className="mt-4 text-2xl font-black">{project.title}</h2>
        </Link>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-(--color-muted)">
          {project.description || "No description added yet."}
        </p>

        {project.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 6).map((tag) => (
              <span
                className="app-chip rounded-full px-3 py-1 text-xs font-semibold"
                key={tag}
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {project.githubLink ? (
            <a
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-strong) px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 hover:border-(--color-border-strong)"
              href={project.githubLink}
              rel="noreferrer"
              target="_blank"
            >
              <GitBranch size={16} aria-hidden="true" />
              GitHub
            </a>
          ) : null}

          {project.liveLink ? (
            <a
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-accent) bg-(--color-accent) px-4 py-2 text-sm font-black text-black transition hover:-translate-y-0.5 hover:opacity-90"
              href={project.liveLink}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink size={16} aria-hidden="true" />
              Live
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default FeedProjectCard;
