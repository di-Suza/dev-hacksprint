import { Moon, Sun } from "lucide-react";

import useThemeToggle from "./useThemeToggle";

function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeToggle();
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      aria-label={label}
      className="fixed right-3 top-4 z-50 grid h-10 w-10 place-items-center rounded-full border border-(--color-border) bg-(--color-surface)/90 text-(--color-muted) shadow-lg shadow-black/15 backdrop-blur transition hover:-translate-y-0.5 hover:border-(--color-border-strong) hover:bg-(--color-surface-strong) hover:text-(--color-text)"
      title={label}
      type="button"
      onClick={toggleTheme}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}

export default ThemeToggle;
