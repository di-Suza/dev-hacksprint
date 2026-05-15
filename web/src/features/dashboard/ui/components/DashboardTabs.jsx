const tabs = [
  { id: "details", label: "Edit your details" },
  { id: "projects", label: "Your projects" },
  { id: "blogs", label: "Your blogs" },
];

function DashboardTabs({ activeTab, onTabChange }) {
  return (
    <div className="mb-6 overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface) p-2">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => (
          <button
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              activeTab === tab.id
                ? "bg-(--color-text) text-(--color-bg)"
                : "text-(--color-muted) hover:bg-(--color-surface-strong) hover:text-(--color-text)",
            ].join(" ")}
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DashboardTabs;
