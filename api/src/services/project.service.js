const imagekit = require("../utilities/imageKit");
const Likes = require("../models/like.model");
const Project = require("../models/project.model");
const Users = require("../models/user.model");
const { AppError } = require("../utilities/appError");

async function uploadProjectImages(files = [], userId) {
  if (!files.length) return [];

  return Promise.all(
    files.map(async (file) => {
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: `project-${userId}-${Date.now()}-${file.originalname}`,
        folder: "/Developer/ProjectImages",
      });

      return {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
      };
    }),
  );
}

async function deleteProjectImages(images = []) {
  await Promise.all(
    images
      .filter((image) => image.fileId)
      .map((image) => imagekit.deleteFile(image.fileId)),
  );
}

module.exports.createProject = async (userId, projectData, files) => {
  const images = await uploadProjectImages(files, userId);
  const project = await Project.create({
    user: userId,
    ...projectData,
    images,
  });

  await Users.findByIdAndUpdate(userId, { $inc: { projectsCount: 1 } });

  return project;
};

module.exports.getMyProjects = async (userId) => {
  return Project.find({ user: userId }).sort({ createdAt: -1 });
};

module.exports.getProjectById = async (projectId, currentUserId) => {
  const project = await Project.findById(projectId).populate(
    "user",
    "userName profilePicture headline",
  );

  if (!project) {
    throw new AppError("Project not found!", 404);
  }

  const isLiked = await Likes.exists({
    content: projectId,
    contentType: "project",
    user: currentUserId,
  });

  return {
    ...project.toObject(),
    isLiked: Boolean(isLiked),
  };
};

module.exports.updateProject = async (userId, projectId, updates, files) => {
  const project = await Project.findOne({ _id: projectId, user: userId });

  if (!project) {
    throw new AppError("Project not found!", 404);
  }

  const allowedUpdates = [
    "title",
    "description",
    "githubLink",
    "liveLink",
    "tags",
  ];

  allowedUpdates.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      project[field] = updates[field];
    }
  });

  const shouldRemoveImages =
    updates.removeImages === true || updates.removeImages === "true";

  if (shouldRemoveImages && project.images.length) {
    await deleteProjectImages(project.images);
    project.images = [];
  }

  if (files?.length) {
    if (project.images.length) {
      await deleteProjectImages(project.images);
    }
    project.images = await uploadProjectImages(files, userId);
  }

  await project.save();
  return project;
};

module.exports.deleteProject = async (userId, projectId) => {
  const project = await Project.findOne({ _id: projectId, user: userId });

  if (!project) {
    throw new AppError("Project not found!", 404);
  }

  if (project.images.length) {
    await deleteProjectImages(project.images);
  }

  await project.deleteOne();
  await Users.findByIdAndUpdate(userId, { $inc: { projectsCount: -1 } });
};
