import { cn } from "../../utils/cn";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1 text-sm text-(--color-text) shadow-sm transition placeholder:text-(--color-muted) focus-visible:border-(--color-accent) focus-visible:bg-(--color-surface-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-soft)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      type={type}
      {...props}
    />
  );
}

export { Input };
