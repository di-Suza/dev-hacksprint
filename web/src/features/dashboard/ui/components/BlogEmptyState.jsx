import { PenLine } from "lucide-react";

function BlogEmptyState({ onAddBlog }) {
  return (
    <div className="app-panel grid min-h-96 place-items-center rounded-2xl border-dashed p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-(--color-border) bg-(--color-bg) text-(--color-accent)">
          <PenLine size={24} aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-black">No blogs published yet</h2>
        <p className="mt-2 text-sm leading-6 text-(--color-muted)">
          Share build notes, tutorials, technical decisions, and learnings with a
          markdown-powered blog page.
        </p>
        <button
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-(--color-accent) bg-(--color-accent) px-4 py-2 text-sm font-black text-black transition hover:-translate-y-0.5 hover:opacity-90"
          type="button"
          onClick={onAddBlog}
        >
          <PenLine size={16} aria-hidden="true" />
          Write blog
        </button>
      </div>
    </div>
  );
}

export default BlogEmptyState;
