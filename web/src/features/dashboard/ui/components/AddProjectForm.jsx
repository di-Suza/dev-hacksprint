import { ImagePlus, Send, X } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import useAddProjectForm from "./useAddProjectForm";

function AddProjectForm({
  initialProject = null,
  isCreating,
  onClose,
  onSubmit,
  submitLabel = "Post project",
}) {
  const {
    description,
    githubLink,
    handleImageChange,
    handleSubmit,
    handleTagChange,
    handleTagKeyDown,
    images,
    liveLink,
    removeTag,
    setDescription,
    setGithubLink,
    setLiveLink,
    setTitle,
    tagDraft,
    tags,
    title,
  } = useAddProjectForm({ initialProject, onSubmit });

  return (
    <form
      className="app-panel mb-5 grid gap-4 rounded-2xl p-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">
            {initialProject ? "Edit project" : "Add project"}
          </h2>
          <p className="mt-1 text-sm text-(--color-muted)">
            {initialProject
              ? "Update project details, links, tech tags, or replace images."
              : "Add a showcase card with images, links, and tech tags."}
          </p>
        </div>
        <button
          className="rounded-lg border border-(--color-border) p-2 text-(--color-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text)"
          type="button"
          onClick={onClose}
        >
          <X size={16} aria-hidden="true" />
          <span className="sr-only">Close add project form</span>
        </button>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-(--color-muted)">Images</span>
        <div className="grid min-h-28 place-items-center rounded-xl border border-dashed border-(--color-border) bg-(--color-bg) p-4 text-center">
          <ImagePlus className="text-(--color-accent)" size={24} aria-hidden="true" />
          <p className="mt-2 text-sm text-(--color-muted)">
            {images.length
              ? `${images.length} image selected`
              : initialProject?.images?.length
                ? `${initialProject.images.length} current image`
                : "Upload project highlights"}
          </p>
          <input
            accept="image/*"
            className="mt-3 max-w-full text-sm text-(--color-muted)"
            multiple
            type="file"
            onChange={handleImageChange}
          />
        </div>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-(--color-muted)">Title</span>
          <Input
            placeholder="Project title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-(--color-muted)">Tags</span>
          <div className="rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 transition focus-within:border-(--color-border-strong) focus-within:bg-(--color-surface-strong) focus-within:ring-2 focus-within:ring-white/5">
            {tags.length ? (
              <div className="mb-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    className="inline-flex items-center gap-1 rounded-full border border-(--color-border-strong) bg-(--color-bg) px-2.5 py-1 text-xs font-semibold text-(--color-text)"
                    key={tag}
                    type="button"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X size={12} aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : null}
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-(--color-muted)"
              placeholder="Type tag and press comma or Enter"
              value={tagDraft}
              onChange={handleTagChange}
              onKeyDown={handleTagKeyDown}
            />
          </div>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-(--color-muted)">Description</span>
        <textarea
          className="min-h-28 resize-y rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-3 text-sm outline-none transition placeholder:text-(--color-muted) focus:border-(--color-border-strong) focus:bg-(--color-surface-strong) focus:ring-2 focus:ring-white/5"
          placeholder="What does this project do?"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-(--color-muted)">GitHub link</span>
          <Input
            placeholder="https://github.com/you/project"
            value={githubLink}
            onChange={(event) => setGithubLink(event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-(--color-muted)">Live link</span>
          <Input
            placeholder="https://project.dev"
            value={liveLink}
            onChange={(event) => setLiveLink(event.target.value)}
          />
        </label>
      </div>

      <Button
        className="w-fit"
        disabled={!title.trim() || isCreating}
        type="button"
        onClick={handleSubmit}
      >
        <Send size={16} aria-hidden="true" />
        {isCreating ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

export default AddProjectForm;
