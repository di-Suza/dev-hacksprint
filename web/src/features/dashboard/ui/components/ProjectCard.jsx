import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";

function ProjectCard({ isDeleting, onDelete, onEdit, project }) {
  const coverImage = project?.images?.[0]?.url;

  return (
    <article className="app-card flex h-full min-h-[430px] flex-col overflow-hidden rounded-2xl">
      <div className="media-frame relative h-52 shrink-0 overflow-hidden">
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <button
            aria-label={`Edit ${project.title}`}
            className="grid h-9 w-9 place-items-center rounded-lg border border-(--color-border) bg-(--color-surface)/90 text-(--color-text) backdrop-blur transition hover:border-(--color-border-strong) hover:bg-(--color-surface-strong)"
            type="button"
            onClick={() => onEdit?.(project)}
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
          <button
            aria-label={`Delete ${project.title}`}
            className="grid h-9 w-9 place-items-center rounded-lg border border-red-500/30 bg-(--color-surface)/90 text-red-300 backdrop-blur transition hover:border-red-400/70 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDeleting}
            type="button"
            onClick={() => onDelete?.(project)}
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>

        {coverImage ? (
          <img
            alt={project.title}
            className="block h-full w-full object-cover object-center"
            src={coverImage}
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-(--color-muted)">
            Project highlight
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-lg font-black">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-(--color-muted)">
            {project.description || "No description added yet."}
          </p>
        </div>

        <div className="min-h-8">
          {project.tags?.length ? (
            <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                className="app-chip rounded-full px-2.5 py-1 text-xs"
                key={tag}
              >
                {tag}
              </span>
            ))}
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex justify-center pt-2">
          <Link
            className="rounded-lg border border-(--color-border) px-4 py-2 text-sm font-semibold transition hover:border-(--color-border-strong)"
            to={`/projects/${project._id}`}
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
