import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { FileText, Send, X } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import useAddBlogForm from "./useAddBlogForm";

function AddBlogForm({
  initialBlog = null,
  isSaving,
  onClose,
  onSubmit,
}) {
  const {
    categories,
    categoryDraft,
    content,
    handleCategoryChange,
    handleCategoryKeyDown,
    handleSubmit,
    removeCategory,
    setContent,
    setTitle,
    title,
  } = useAddBlogForm({ initialBlog, onSubmit });

  return (
    <form
      className="app-panel mb-5 grid gap-4 rounded-2xl p-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">
            {initialBlog ? "Edit blog" : "Write blog"}
          </h2>
          <p className="mt-1 text-sm text-(--color-muted)">
            Write technical notes with markdown, categories, and a clean publish flow.
          </p>
        </div>
        <button
          className="rounded-lg border border-(--color-border) p-2 text-(--color-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text)"
          type="button"
          onClick={onClose}
        >
          <X size={16} aria-hidden="true" />
          <span className="sr-only">Close blog form</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-(--color-muted)">Title</span>
          <Input
            placeholder="How I built my project"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-(--color-muted)">
            Categories
          </span>
          <div className="rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 transition focus-within:border-(--color-border-strong) focus-within:bg-(--color-surface-strong) focus-within:ring-2 focus-within:ring-white/5">
            {categories.length ? (
              <div className="mb-2 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    className="inline-flex items-center gap-1 rounded-full border border-(--color-border-strong) bg-(--color-bg) px-2.5 py-1 text-xs font-semibold text-(--color-text)"
                    key={category}
                    type="button"
                    onClick={() => removeCategory(category)}
                  >
                    {category}
                    <X size={12} aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : null}
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-(--color-muted)"
              placeholder="React, Backend, Learning"
              value={categoryDraft}
              onChange={handleCategoryChange}
              onKeyDown={handleCategoryKeyDown}
            />
          </div>
        </label>
      </div>

      <div className="grid gap-2" data-color-mode="dark">
        <span className="text-sm font-semibold text-(--color-muted)">
          Blog content
        </span>
        <MDEditor
          height={420}
          preview="live"
          textareaProps={{ placeholder: "Write your technical blog in markdown..." }}
          value={content}
          onChange={(value) => setContent(value || "")}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={!title.trim() || content.trim().length < 20 || isSaving}
          type="button"
          onClick={() => handleSubmit(false)}
        >
          <FileText size={16} aria-hidden="true" />
          {isSaving ? "Saving..." : "Save as draft"}
        </Button>

        <Button
          disabled={!title.trim() || content.trim().length < 20 || isSaving}
          type="button"
          onClick={() => handleSubmit(true)}
        >
          <Send size={16} aria-hidden="true" />
          {isSaving
            ? "Publishing..."
            : initialBlog?.isPublished
              ? "Save & keep published"
              : "Publish"}
        </Button>
      </div>
    </form>
  );
}

export default AddBlogForm;
