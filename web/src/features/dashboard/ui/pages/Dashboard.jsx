import { useMemo, useState } from "react";
import { LogOut, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useLogoutMutation } from "../../../auth/api/auth.api";
import {
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useGetMyBlogsQuery,
  useUpdateBlogMutation,
  useUpdateBlogPublishStatusMutation,
} from "../../../blog/api/blog.api";
import { clearUser, selectAuthUser } from "../../../auth/state/authSlice";
import {
  useUpdateGeneralInfoMutation,
  useUpdateProfessionalInfoMutation,
  useUpdateProfilePictureMutation,
  useUpdateSocialLinksMutation,
} from "../../api/dashboard.api";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetMyProjectsQuery,
  useUpdateProjectMutation,
} from "../../../project/api/project.api";
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

const emptySocialLinks = {
  github: "",
  linkedin: "",
  x: "",
  youtube: "",
  portfolio: "",
  instagram: "",
};

const sampleActivities = [
  {
    title: "Profile updates",
    description: "Recent changes to profile, skills, projects, and public links will appear here.",
  },
  {
    title: "Engagement",
    description: "Likes, saves, follows, comments, and discovery activity will appear here.",
  },
];

function buildInitialForm(user) {
  return {
    userName: user?.userName || "",
    email: user?.email || "",
    headline: user?.headline || "",
    about: user?.about || "",
    skills: user?.skills || [],
    experiences: user?.experiences?.length
      ? user.experiences
      : [{ companyName: "", timePeriod: "" }],
    educations: user?.educations?.length
      ? user.educations
      : [{ collegeName: "", course: "", timePeriod: "" }],
    interests: user?.interests || [],
    languages: user?.languages || [],
    socialLinks: {
      ...emptySocialLinks,
      ...(user?.socialLinks || {}),
    },
  };
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const initialForm = useMemo(() => buildInitialForm(user), [user]);
  const [form, setForm] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState("");
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlogId, setDeletingBlogId] = useState("");
  const [followModalType, setFollowModalType] = useState("");
  const [logout, { isLoading }] = useLogoutMutation();
  const [updateProfilePicture, { isLoading: isSavingPicture }] =
    useUpdateProfilePictureMutation();
  const [updateGeneralInfo, { isLoading: isSavingGeneral }] =
    useUpdateGeneralInfoMutation();
  const [updateProfessionalInfo, { isLoading: isSavingProfessional }] =
    useUpdateProfessionalInfoMutation();
  const [updateSocialLinks, { isLoading: isSavingSocial }] =
    useUpdateSocialLinksMutation();
  const { data: projectsData, isLoading: isLoadingProjects } =
    useGetMyProjectsQuery(undefined, {
      skip: activeTab !== "projects",
    });
  const { data: blogsData, isLoading: isLoadingBlogs } =
    useGetMyBlogsQuery(undefined, {
      skip: activeTab !== "blogs",
    });
  const [createProject, { isLoading: isCreatingProject }] =
    useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdatingProject }] =
    useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeletingProject }] =
    useDeleteProjectMutation();
  const [createBlog, { isLoading: isCreatingBlog }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdatingBlog }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeletingBlog }] = useDeleteBlogMutation();
  const [updateBlogPublishStatus, { isLoading: isUpdatingBlogStatus }] =
    useUpdateBlogPublishStatusMutation();

  const projects = projectsData?.projects || [];
  const blogs = blogsData?.blogs || [];

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateProfessional(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateSocial(field, value) {
    setForm((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [field]: value,
      },
    }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfilePictureFile(file);
    setSelectedFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSavePicture() {
    if (!profilePictureFile) return;

    const formData = new FormData();
    formData.append("profilePicture", profilePictureFile);

    try {
      await updateProfilePicture(formData).unwrap();
      toast.success("Profile picture updated");
      setProfilePictureFile(null);
      setSelectedFileName("");
      setPreviewUrl("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile picture");
    }
  }

  async function handleRemovePicture() {
    const formData = new FormData();
    formData.append("removeProfilePicture", "true");

    try {
      await updateProfilePicture(formData).unwrap();
      toast.success("Profile picture removed");
      setProfilePictureFile(null);
      setSelectedFileName("");
      setPreviewUrl("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove profile picture");
    }
  }

  async function handleSaveGeneral(event) {
    event.preventDefault();

    try {
      await updateGeneralInfo({
        userName: form.userName,
        headline: form.headline,
        about: form.about,
      }).unwrap();
      toast.success("General info updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update general info");
    }
  }

  async function handleSaveProfessional(event) {
    event.preventDefault();

    try {
      await updateProfessionalInfo({
        skills: form.skills,
        experiences: form.experiences.filter(
          (item) => item.companyName || item.timePeriod
        ),
        educations: form.educations.filter(
          (item) => item.collegeName || item.course || item.timePeriod
        ),
        interests: form.interests,
        languages: form.languages,
      }).unwrap();
      toast.success("Professional info updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update professional info");
    }
  }

  async function handleSaveSocial(event) {
    event.preventDefault();

    try {
      await updateSocialLinks(form.socialLinks).unwrap();
      toast.success("Social links updated");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update social links");
    }
  }

  async function handleLogout() {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      toast.success("Logged out successfully");
      navigate("/signin", { replace: true });
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed");
    }
  }

  function handleCloseProjectForm() {
    setIsProjectFormOpen(false);
    setEditingProject(null);
  }

  function handleOpenCreateProject() {
    setEditingProject(null);
    setIsProjectFormOpen(true);
  }

  function handleEditProject(project) {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  }

  async function handleSubmitProject(formData) {
    try {
      if (editingProject?._id) {
        await updateProject({ id: editingProject._id, data: formData }).unwrap();
        toast.success("Project updated successfully");
      } else {
        await createProject(formData).unwrap();
        toast.success("Project added successfully");
      }
      handleCloseProjectForm();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save project");
    }
  }

  async function handleDeleteProject(project) {
    const shouldDelete = window.confirm(`Delete "${project.title}" project?`);
    if (!shouldDelete) return;

    setDeletingProjectId(project._id);
    try {
      await deleteProject(project._id).unwrap();
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete project");
    } finally {
      setDeletingProjectId("");
    }
  }

  function handleCloseBlogForm() {
    setIsBlogFormOpen(false);
    setEditingBlog(null);
  }

  function handleOpenCreateBlog() {
    setEditingBlog(null);
    setIsBlogFormOpen(true);
  }

  function handleEditBlog(blog) {
    setEditingBlog(blog);
    setIsBlogFormOpen(true);
  }

  async function handleSubmitBlog(blogData) {
    try {
      if (editingBlog?._id) {
        await updateBlog({ id: editingBlog._id, data: blogData }).unwrap();
        toast.success(
          blogData.isPublished ? "Blog published successfully" : "Blog saved as draft",
        );
      } else {
        await createBlog(blogData).unwrap();
        toast.success(
          blogData.isPublished ? "Blog published successfully" : "Draft saved",
        );
      }
      handleCloseBlogForm();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save blog");
    }
  }

  async function handleToggleBlogPublishStatus(blog) {
    try {
      const nextStatus = !blog.isPublished;
      await updateBlogPublishStatus({
        id: blog._id,
        isPublished: nextStatus,
      }).unwrap();
      toast.success(nextStatus ? "Blog published" : "Blog moved to draft");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update blog status");
    }
  }

  async function handleDeleteBlog(blog) {
    const shouldDelete = window.confirm(`Delete "${blog.title}" blog?`);
    if (!shouldDelete) return;

    setDeletingBlogId(blog._id);
    try {
      await deleteBlog(blog._id).unwrap();
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete blog");
    } finally {
      setDeletingBlogId("");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_10%,rgba(112,241,201,0.08),transparent_24%),var(--color-bg)] px-5 py-6 text-(--color-text)">
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

        <section className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-(--color-muted)">Developer Dashboard</p>
              <h1 className="mt-1 text-3xl font-black">Edit your portfolio profile</h1>
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
                <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 text-sm text-(--color-muted)">
                  Loading projects...
                </div>
              ) : null}

              {!isLoadingProjects && projects.length && !isProjectFormOpen ? (
                <>
                  <div className="flex justify-end">
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--color-text) px-4 py-2 text-sm font-bold text-(--color-bg) transition hover:bg-white"
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
                <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 text-sm text-(--color-muted)">
                  Loading blogs...
                </div>
              ) : null}

              {!isLoadingBlogs && blogs.length && !isBlogFormOpen ? (
                <>
                  <div className="flex justify-end">
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--color-text) px-4 py-2 text-sm font-bold text-(--color-bg) transition hover:bg-white"
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
                        isDeleting={isDeletingBlog && deletingBlogId === blog._id}
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
