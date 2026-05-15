import { cn } from "../../utils/cn";

const variants = {
  default:
    "border-(--color-text) bg-(--color-text) text-(--color-bg) shadow-sm hover:opacity-90",
  outline:
    "border-(--color-border) bg-(--color-surface) text-(--color-text) hover:border-(--color-border-strong) hover:bg-(--color-surface-strong)",
  ghost:
    "border-transparent bg-transparent text-(--color-muted) hover:bg-(--color-surface) hover:text-(--color-text)",
};

const sizes = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3",
  lg: "h-10 px-5",
  icon: "h-9 w-9",
};

function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-strong) disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      type={type}
      {...props}
    />
  );
}

export { Button };
