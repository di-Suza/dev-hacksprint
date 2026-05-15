import { Camera, FileText, FolderGit2, UsersRound } from "lucide-react";

function ProfileSidebar({
  isSavingPicture,
  user,
  previewUrl,
  selectedFileName,
  onFileChange,
  onOpenFollowers,
  onOpenFollowing,
  onRemovePicture,
  onSavePicture,
}) {
  const profileUrl = previewUrl || user?.profilePicture?.url;
  const stats = [
    { label: "Blogs", value: user?.blogsCount || 0, icon: FileText },
    { label: "Projects", value: user?.projectsCount || 0, icon: FolderGit2 },
    {
      action: onOpenFollowers,
      label: "Followers",
      value: user?.followersCount || 0,
      icon: UsersRound,
    },
    {
      action: onOpenFollowing,
      label: "Following",
      value: user?.followingCount || 0,
      icon: UsersRound,
    },
  ];

  return (
    <aside className="app-panel h-fit rounded-2xl p-5 lg:sticky lg:top-6">
      <div>
        <p className="text-lg font-bold">My Profile</p>
        <p className="mt-1 text-sm leading-5 text-(--color-muted)">
          Manage your developer identity, portfolio details, and public presence.
        </p>
      </div>

      <div className="mt-7 grid justify-items-center">
        <div className="relative">
          <img
            alt={user?.userName || "Profile"}
            className="h-28 w-28 rounded-full border-4 border-(--color-border) object-cover"
            src={profileUrl}
          />
          <label className="absolute bottom-1 right-1 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-(--color-border-strong) bg-(--color-bg) text-(--color-text) transition hover:bg-(--color-surface-strong)">
            <Camera size={16} aria-hidden="true" />
            <span className="sr-only">Upload profile picture</span>
            <input accept="image/*" className="hidden" type="file" onChange={onFileChange} />
          </label>
        </div>

        <h1 className="mt-4 text-center text-2xl font-black">
          {user?.userName || "Developer"}
        </h1>
        <p className="mt-1 max-w-56 text-center text-sm text-(--color-muted)">
          {user?.headline || "Add a headline to tell people what you build."}
        </p>

        {selectedFileName ? (
          <p className="mt-3 max-w-48 truncate rounded-full border border-(--color-border) px-3 py-1 text-xs text-(--color-muted)">
            {selectedFileName}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            className="rounded-lg border border-(--color-accent) bg-(--color-accent) px-4 py-2 text-sm font-black text-black transition hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-60"
            disabled={isSavingPicture || !selectedFileName}
            type="button"
            onClick={onSavePicture}
          >
            {isSavingPicture ? "Saving..." : "Save picture"}
          </button>
          <button
            className="rounded-lg border border-(--color-border) px-4 py-2 text-sm transition hover:border-(--color-border-strong) disabled:opacity-60"
            disabled={isSavingPicture}
            type="button"
            onClick={onRemovePicture}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const Component = stat.action ? "button" : "div";
          return (
            <Component
              className="rounded-xl border border-(--color-border) bg-(--color-bg)/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-(--color-border-strong) hover:bg-(--color-surface-strong)"
              key={stat.label}
              type={stat.action ? "button" : undefined}
              onClick={stat.action}
            >
              <Icon className="text-(--color-accent)" size={17} aria-hidden="true" />
              <strong className="mt-3 block text-2xl">{stat.value}</strong>
              <span className="text-xs text-(--color-muted)">{stat.label}</span>
            </Component>
          );
        })}
      </div>
    </aside>
  );
}

export default ProfileSidebar;
