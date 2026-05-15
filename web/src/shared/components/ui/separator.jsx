import { cn } from "../../utils/cn";

function Separator({ className, ...props }) {
  return (
    <div
      className={cn("h-px w-full bg-(--color-border)", className)}
      role="separator"
      {...props}
    />
  );
}

export { Separator };
