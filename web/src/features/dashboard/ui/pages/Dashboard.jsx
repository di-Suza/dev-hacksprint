import { LogOut, Plus } from "lucide-react";

import ActivityCard from "../components/ActivityCard";
import AddBlogForm from "../components/AddBlogForm";
import AddProjectForm from "../components/AddProjectForm";
import BlogCard from "../components/BlogCard";
import BlogEmptyState from "../components/BlogEmptyState";
import DashboardTabs from "../components/DashboardTabs";
import ProfileEditor from "../components/ProfileEditor";
import ProfileSidebar from "../components/ProfileSidebar";
import ProjectCard from "../components/ProjectCard";
import ProjectEmptyState from "../components/ProjectEmptyState";
import FollowListModal from "../../../profile/ui/components/FollowListModal";
import BackButton from "../../../../shared/components/BackButton";
import useDashboard from "./useDashboard";

const sampleActivities = [
  {
    title: "Profile updates",
    description:
      "Recent changes to profile, skills, projects, and public links will appear here.",
  },
  {
    title: "Engagement",
    description:
      "Likes, saves, follows, comments, and discovery activity will appear here.",
  },
];

const Dashboard = () => {
  const {
    activeTab,
    blogs,
    deletingBlogId,
    deletingProjectId,
    editingBlog,
    editingProject,
    followModalType,
    form,
    handleCloseBlogForm,
    handleCloseProjectForm,
    handleDeleteBlog,
    handleDeleteProject,
    handleEditBlog,
    handleEditProject,
    handleFileChange,
    handleLogout,
    handleOpenCreateBlog,
    handleOpenCreateProject,
    handleRemovePicture,
    handleSaveGeneral,
    handleSavePicture,
    handleSaveProfessional,
    handleSaveSocial,
    handleSubmitBlog,
    handleSubmitProject,
    handleToggleBlogPublishStatus,
    isBlogFormOpen,
    isCreatingBlog,
    isCreatingProject,
    isDeletingBlog,
    isDeletingProject,
    isLoading,
    isLoadingBlogs,
    isLoadingProjects,
    isProjectFormOpen,
    isSavingGeneral,
    isSavingPicture,
    isSavingProfessional,
    isSavingSocial,
    isUpdatingBlog,
    isUpdatingBlogStatus,
    isUpdatingProject,
    previewUrl,
    projects,
    selectedFileName,
    setActiveTab,
    setFollowModalType,
    updateField,
    updateProfessional,
    updateSocial,
    user,
  } = useDashboard();

  return (
    <main className="app-page px-5 py-6">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <ProfileSidebar
          isSavingPicture={isSavingPicture}
          previewUrl={previewUrl}
          selectedFileName={selectedFileName}
          user={user}
          onFileChange={handleFileChange}
          onOpenFollowers={() => setFollowModalType("followers")}
          onOpenFollowing={() => setFollowModalType("following")}
          onRemovePicture={handleRemovePicture}
          onSavePicture={handleSavePicture}
        />
        <BackButton className="mb-4" />

        <section className="min-w-0">
          <div className="app-panel mb-6 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-(--color-muted)">
                Developer Dashboard
              </p>
              <h1 className="mt-1 text-3xl font-black">
                Edit your portfolio profile
              </h1>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-(--color-border) px-4 py-2 text-sm font-semibold text-(--color-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text)"
              disabled={isLoading}
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={16} aria-hidden="true" />
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>

          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "details" ? (
            <ProfileEditor
              form={form}
              isSavingGeneral={isSavingGeneral}
              isSavingProfessional={isSavingProfessional}
              isSavingSocial={isSavingSocial}
              onFieldChange={updateField}
              onProfessionalChange={updateProfessional}
              onSaveGeneral={handleSaveGeneral}
              onSaveProfessional={handleSaveProfessional}
              onSaveSocial={handleSaveSocial}
              onSocialChange={updateSocial}
            />
          ) : null}

          {activeTab === "projects" ? (
            <div className="space-y-5">
              {isProjectFormOpen ? (
                <AddProjectForm
                  initialProject={editingProject}
                  isCreating={isCreatingProject || isUpdatingProject}
                  key={editingProject?._id || "new-project"}
                  submitLabel={editingProject ? "Save project" : "Post project"}
                  onClose={handleCloseProjectForm}
                  onSubmit={handleSubmitProject}
                />
              ) : null}

              {!isProjectFormOpen && isLoadingProjects ? (
                <div className="app-panel rounded-2xl p-5 text-sm text-(--color-muted)">
                  Loading projects...
                </div>
              ) : null}

              {!isLoadingProjects && projects.length && !isProjectFormOpen ? (
                <>
                  <div className="flex justify-end">
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-(--color-accent) bg-(--color-accent) px-4 py-2 text-sm font-black text-black transition hover:-translate-y-0.5 hover:opacity-90"
                      type="button"
                      onClick={handleOpenCreateProject}
                    >
                      <Plus size={16} aria-hidden="true" />
                      Add project
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                      <ProjectCard
                        isDeleting={
                          isDeletingProject && deletingProjectId === project._id
                        }
                        key={project._id}
                        project={project}
                        onDelete={handleDeleteProject}
                        onEdit={handleEditProject}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {!isLoadingProjects && !projects.length && !isProjectFormOpen ? (
                <ProjectEmptyState onAddProject={handleOpenCreateProject} />
              ) : null}
            </div>
          ) : null}

          {activeTab === "blogs" ? (
            <div className="space-y-5">
              {isBlogFormOpen ? (
                <AddBlogForm
                  initialBlog={editingBlog}
                  isSaving={isCreatingBlog || isUpdatingBlog}
                  key={editingBlog?._id || "new-blog"}
                  onClose={handleCloseBlogForm}
                  onSubmit={handleSubmitBlog}
                />
              ) : null}

              {!isBlogFormOpen && isLoadingBlogs ? (
                <div className="app-panel rounded-2xl p-5 text-sm text-(--color-muted)">
                  Loading blogs...
                </div>
              ) : null}

              {!isLoadingBlogs && blogs.length && !isBlogFormOpen ? (
                <>
                  <div className="flex justify-end">
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-(--color-accent) bg-(--color-accent) px-4 py-2 text-sm font-black text-black transition hover:-translate-y-0.5 hover:opacity-90"
                      type="button"
                      onClick={handleOpenCreateBlog}
                    >
                      <Plus size={16} aria-hidden="true" />
                      Write blog
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {blogs.map((blog) => (
                      <BlogCard
                        blog={blog}
                        isDeleting={
                          isDeletingBlog && deletingBlogId === blog._id
                        }
                        isUpdatingStatus={isUpdatingBlogStatus}
                        key={blog._id}
                        onDelete={handleDeleteBlog}
                        onEdit={handleEditBlog}
                        onTogglePublishStatus={handleToggleBlogPublishStatus}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {!isLoadingBlogs && !blogs.length && !isBlogFormOpen ? (
                <BlogEmptyState onAddBlog={handleOpenCreateBlog} />
              ) : null}
            </div>
          ) : null}

          {activeTab === "activities" ? (
            <div className="grid gap-4 md:grid-cols-2">
              {sampleActivities.map((activity) => (
                <ActivityCard activity={activity} key={activity.title} />
              ))}
            </div>
          ) : null}
        </section>
      </div>

      {followModalType ? (
        <FollowListModal
          type={followModalType}
          userId={user?._id}
          onClose={() => setFollowModalType("")}
        />
      ) : null}
    </main>
  );
};

export default Dashboard;
