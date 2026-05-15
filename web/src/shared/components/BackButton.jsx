import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router";

function BackButton({ className = "", fallback = "/feed", label = "Back" }) {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallback, { replace: true });
  }

  return (
    <button
      aria-label={label}
      className={`fixed left-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-full border border-(--color-border) bg-(--color-surface)/90 text-(--color-muted) shadow-lg shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:border-(--color-border-strong) hover:bg-(--color-surface-strong) hover:text-(--color-text) sm:left-6 lg:left-52 ${className}`}
      title={label}
      type="button"
      onClick={handleBack}
    >
      <Undo2 size={18} aria-hidden="true" />
    </button>
  );
}

export default BackButton;
