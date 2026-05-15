import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useLogoutMutation } from "../../../auth/api/auth.api";
import { clearUser, selectAuthUser } from "../../../auth/state/authSlice";
import {
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useGetMyBlogsQuery,
  useUpdateBlogMutation,
  useUpdateBlogPublishStatusMutation,
} from "../../../blog/api/blog.api";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetMyProjectsQuery,
  useUpdateProjectMutation,
} from "../../../project/api/project.api";
import {
  useUpdateGeneralInfoMutation,
  useUpdateProfessionalInfoMutation,
  useUpdateProfilePictureMutation,
  useUpdateSocialLinksMutation,
} from "../../api/dashboard.api";

const emptySocialLinks = {
  github: "",
  linkedin: "",
  x: "",
  youtube: "",
  portfolio: "",
  instagram: "",
};

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

function useDashboard() {
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
          (item) => item.companyName || item.timePeriod,
        ),
        educations: form.educations.filter(
          (item) => item.collegeName || item.course || item.timePeriod,
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

  return {
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
  };
}

export default useDashboard;
