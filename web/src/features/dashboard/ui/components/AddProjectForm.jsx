import { ImagePlus, Send, X } from "lucide-react";
import { useState } from "react";

import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";

function AddProjectForm({
  initialProject = null,
  isCreating,
  onClose,
  onSubmit,
  submitLabel = "Post project",
}) {
  const [title, setTitle] = useState(initialProject?.title || "");
  const [description, setDescription] = useState(initialProject?.description || "");
  const [githubLink, setGithubLink] = useState(initialProject?.githubLink || "");
  const [liveLink, setLiveLink] = useState(initialProject?.liveLink || "");
  const [tags, setTags] = useState(initialProject?.tags || []);
  const [tagDraft, setTagDraft] = useState("");
  const [images, setImages] = useState([]);

  function addTagsFromText(value) {
    const nextTags = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!nextTags.length) return;

    setTags((current) => {
      const existing = new Set(current.map((tag) => tag.toLowerCase()));
      const freshTags = nextTags.filter((tag) => !existing.has(tag.toLowerCase()));
      return [...current, ...freshTags].slice(0, 12);
    });
  }

  function handleTagChange(event) {
    const value = event.target.value;

    if (!value.includes(",")) {
      setTagDraft(value);
      return;
    }

    const parts = value.split(",");
    const remainingText = parts.pop() || "";
    addTagsFromText(parts.join(","));
    setTagDraft(remainingText.trimStart());
  }

  function handleTagKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTagsFromText(tagDraft);
      setTagDraft("");
      return;
    }

    if (event.key === "Backspace" && !tagDraft && tags.length) {
      setTags((current) => current.slice(0, -1));
    }
  }

  function removeTag(tagToRemove) {
    setTags((current) => current.filter((tag) => tag !== tagToRemove));
  }

  function handleSubmit() {
    addTagsFromText(tagDraft);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description);
    formData.append("githubLink", githubLink);
    formData.append("liveLink", liveLink);
    formData.append("tags", [...tags, tagDraft.trim()].filter(Boolean).join(","));
    images.forEach((image) => formData.append("images", image));

    onSubmit(formData);
  }

  return (
    <form
      className="mb-5 grid gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5"
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
            onChange={(event) => setImages(Array.from(event.target.files || []))}
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
