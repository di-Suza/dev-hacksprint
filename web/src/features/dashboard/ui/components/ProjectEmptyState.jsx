import { Plus } from "lucide-react";

function ProjectEmptyState({ onAddProject }) {
  return (
    <div className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface) p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-(--color-border) bg-(--color-bg) text-(--color-accent)">
          <Plus size={24} aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-black">No projects added yet</h2>
        <p className="mt-2 text-sm leading-6 text-(--color-muted)">
          Start your portfolio by adding a project with a title, description,
          images, links, and tech tags.
        </p>
        <button
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-(--color-text) px-4 py-2 text-sm font-bold text-(--color-bg) transition hover:bg-white"
          type="button"
          onClick={onAddProject}
        >
          <Plus size={16} aria-hidden="true" />
          Add project
        </button>
      </div>
    </div>
  );
}

export default ProjectEmptyState;
