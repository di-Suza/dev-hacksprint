import { cn } from "../../utils/cn";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      className={cn(
        "flex h-8 w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1 text-sm text-(--color-text) transition placeholder:text-(--color-muted) focus-visible:border-(--color-border-strong) focus-visible:bg-(--color-surface-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/5 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      type={type}
      {...props}
    />
  );
}

export { Input };
