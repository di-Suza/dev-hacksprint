import { Send, X } from "lucide-react";
import {
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Link } from "react-router";

import BackButton from "../../../../shared/components/BackButton";
import FollowListModal from "../components/FollowListModal";
import useProfilePage from "./useProfilePage";

const socialLinkMeta = [
  { key: "github", label: "GitHub", icon: FaGithub },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin },
  { key: "x", label: "X", icon: FaXTwitter },
  { key: "youtube", label: "YouTube", icon: FaYoutube },
  { key: "instagram", label: "Instagram", icon: FaInstagram },
  { key: "portfolio", label: "Portfolio", icon: FaGlobe },
];

function ProfilePage() {
  const {
    blogs,
    followModalType,
    handleStartChat,
    isLoading,
    isMessageModalOpen,
    messageText,
    profileFollow,
    projects,
    sendingMessage,
    setFollowModalType,
    setIsMessageModalOpen,
    setMessageText,
    shouldSkip,
    socialLinks,
    user,
  } = useProfilePage(socialLinkMeta);

  if (shouldSkip) {
    return null;
  }

  if (isLoading) {
    return (
      <main className="app-page px-5 py-8">
        <div className="mx-auto max-w-4xl">
          <BackButton className="mb-4" />
          <div className="animate-pulse space-y-8">
            <div className="app-panel rounded-2xl p-8">
              <div className="flex gap-6">
                <div className="h-32 w-32 shrink-0 rounded-full bg-(--color-surface-strong)" />
                <div className="flex-1 space-y-4">
                  <div className="h-8 w-32 rounded bg-(--color-surface-strong)" />
                  <div className="h-4 w-48 rounded bg-(--color-surface-strong)" />
                  <div className="flex gap-6">
                    <div className="h-4 w-24 rounded bg-(--color-surface-strong)" />
                    <div className="h-4 w-24 rounded bg-(--color-surface-strong)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="app-page grid place-items-center">
        <div className="text-center">
          <p className="text-2xl font-black">User not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page px-5 py-8">
      <section className="mx-auto max-w-4xl">
        <BackButton className="mb-4" />
        {/* Header Section */}
        <div className="app-panel mb-8 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Profile Picture */}
            <div className="shrink-0">
              <img
                alt={user.userName}
                className="h-32 w-32 rounded-full object-cover border-4 border-(--color-border)"
                src={user.profilePicture?.url}
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-black">{user.userName}</h1>
                {user.headline && (
                  <p className="mt-1 text-lg text-(--color-muted)">
                    {user.headline}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-(--color-border)">
                <button
                  className="rounded-xl p-2 text-left transition hover:bg-(--color-bg)"
                  type="button"
                  onClick={() => setFollowModalType("followers")}
                >
                  <p className="text-2xl font-black">
                    {profileFollow.followersCount || 0}
                  </p>
                  <p className="text-sm text-(--color-muted)">Followers</p>
                </button>
                <button
                  className="rounded-xl p-2 text-left transition hover:bg-(--color-bg)"
                  type="button"
                  onClick={() => setFollowModalType("following")}
                >
                  <p className="text-2xl font-black">
                    {user.followingCount || 0}
                  </p>
                  <p className="text-sm text-(--color-muted)">Following</p>
                </button>
                <div>
                  <p className="text-2xl font-black">
                    {user.projectsCount || 0}
                  </p>
                  <p className="text-sm text-(--color-muted)">Projects</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  className={[
                    "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-70",
                    profileFollow.isFollowed
                      ? "border border-(--color-border) bg-(--color-surface-strong) text-(--color-text) hover:border-(--color-border-strong)"
                      : "bg-(--color-text) text-(--color-bg) hover:opacity-90",
                  ].join(" ")}
                  disabled={profileFollow.isSyncingFollow}
                  type="button"
                  onClick={profileFollow.toggleFollow}
                >
                  {/* <Mail size={18} /> */}
                  {profileFollow.isFollowed ? "Following" : "Follow"}
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-(--color-border) px-4 py-3 font-bold transition hover:border-(--color-border-strong)"
                  type="button"
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  Message
                </button>
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <a
                        aria-label={link.label}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-(--color-border) text-(--color-muted) transition hover:border-(--color-border-strong) hover:bg-(--color-bg) hover:text-(--color-text)"
                        href={link.href}
                        key={link.key}
                        rel="noreferrer"
                        target="_blank"
                        title={link.label}
                      >
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          {user.about && (
            <div className="mt-8 pt-6 border-t border-(--color-border)">
              <p className="text-sm leading-6 text-(--color-muted)">
                {user.about}
              </p>
            </div>
          )}
        </div>

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <div className="app-card mb-8 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="app-chip rounded-full px-4 py-2 text-sm font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {user.experiences && user.experiences.length > 0 && (
          <div className="app-card mb-8 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4">Experience</h2>
            <div className="space-y-4">
              {user.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="pb-4 border-b border-(--color-border) last:border-0"
                >
                  <p className="font-bold">{exp.companyName}</p>
                  <p className="text-sm text-(--color-muted)">
                    {exp.timePeriod}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {user.educations && user.educations.length > 0 && (
          <div className="app-card mb-8 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4">Education</h2>
            <div className="space-y-4">
              {user.educations.map((edu, idx) => (
                <div
                  key={idx}
                  className="pb-4 border-b border-(--color-border) last:border-0"
                >
                  <p className="font-bold">{edu.collegeName}</p>
                  <p className="text-sm text-(--color-muted)">{edu.course}</p>
                  <p className="text-sm text-(--color-muted)">
                    {edu.timePeriod}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="app-card mb-8 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="group overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-strong) transition hover:-translate-y-1 hover:border-(--color-border-strong)"
                >
                  <div className="media-frame aspect-video overflow-hidden">
                    {project.images && project.images[0]?.url ? (
                      <img
                        alt={project.title}
                        className="h-full w-full object-contain object-center group-hover:scale-105 transition"
                        src={project.images[0].url}
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center bg-(--color-surface-strong)">
                        <span className="text-xs text-(--color-muted)">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold line-clamp-2 group-hover:text-(--color-accent) transition">
                      {project.title}
                    </p>
                    <p className="mt-2 text-xs text-(--color-muted)">
                      View project
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Section */}
        {blogs.length > 0 && (
          <div className="app-card mb-8 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4">Blogs</h2>
            <div className="space-y-4">
              {blogs.map((blog) => {
                const excerpt = blog.content
                  .replace(/```[\s\S]*?```/g, " ")
                  .replace(/[#>*_`[\]()!-]/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .substring(0, 150);

                return (
                  <Link
                    key={blog._id}
                    to={`/blogs/${blog._id}`}
                    className="block rounded-xl border border-(--color-border) bg-(--color-surface-strong) p-4 transition hover:-translate-y-0.5 hover:border-(--color-border-strong)"
                  >
                    <p className="font-bold hover:text-(--color-accent) transition">
                      {blog.title}
                    </p>
                    <p className="mt-2 text-sm text-(--color-muted) line-clamp-2">
                      {excerpt || "No preview available"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Language Section */}
        {user.languages && user.languages.length > 0 && (
          <div className="app-card mb-8 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4">Languages known</h2>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((skill) => (
                <span
                  key={skill}
                  className="app-chip rounded-full px-4 py-2 text-sm font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests Section */}
        {user.interests && user.interests.length > 0 && (
          <div className="app-card mb-8 rounded-2xl p-6">
            <h2 className="text-xl font-black mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="app-chip rounded-full px-4 py-2 text-sm font-semibold"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty States */}
        {projects.length === 0 && blogs.length === 0 && (
          <div className="app-panel rounded-2xl border-dashed p-12 text-center">
            <p className="text-lg font-black">No projects or blogs yet</p>
            <p className="mt-2 text-sm text-(--color-muted)">
              Check back soon!
            </p>
          </div>
        )}
      </section>

      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 backdrop-blur-md">
          <div className="app-panel w-full max-w-md rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4 border-b border-(--color-border) pb-4">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  alt={user.userName}
                  className="h-12 w-12 rounded-full object-cover"
                  src={user.profilePicture?.url}
                />
                <div className="min-w-0">
                  <p className="font-black">Message {user.userName}</p>
                  <p className="truncate text-sm text-(--color-muted)">
                    Start a private conversation
                  </p>
                </div>
              </div>
              <button
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-(--color-bg)"
                type="button"
                onClick={() => setIsMessageModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              className="mt-4 min-h-32 w-full resize-none rounded-xl border border-(--color-border) bg-(--color-bg) px-4 py-3 text-sm outline-none focus:border-(--color-border-strong)"
              placeholder="Write your message..."
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
            />
            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-text) px-4 py-3 font-bold text-(--color-bg) disabled:opacity-50"
              disabled={!messageText.trim() || sendingMessage}
              type="button"
              onClick={handleStartChat}
            >
              <Send size={17} />
              Send message
            </button>
          </div>
        </div>
      )}

      {followModalType ? (
        <FollowListModal
          type={followModalType}
          userId={user._id}
          onClose={() => setFollowModalType("")}
        />
      ) : null}
    </main>
  );
}

export default ProfilePage;
