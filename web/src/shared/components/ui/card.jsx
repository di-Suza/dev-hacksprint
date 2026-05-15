import { cn } from "../../utils/cn";

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text)",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("grid gap-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return (
    <h1
      className={cn("text-lg font-bold leading-none tracking-normal", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-(--color-muted)", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
