function FullPageLoader({ isLoading = false }) {
  if (!isLoading) return null;

  return (
    <main className="grid min-h-screen place-items-center bg-(--color-bg) text-(--color-muted)">
      <div className="grid justify-items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-text)" />
        <span className="text-sm">Checking session...</span>
      </div>
    </main>
  );
}

export default FullPageLoader;
