const projectServices = require("../services/project.service");
const { catchAsync } = require("../utilities/catchAsync");

module.exports.createProject = catchAsync(async (req, res) => {
  const project = await projectServices.createProject(
    req.user._id,
    req.body,
    req.files,
  );

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    project,
  });
});

module.exports.getMyProjects = catchAsync(async (req, res) => {
  const projects = await projectServices.getMyProjects(req.user._id);

  res.status(200).json({
    success: true,
    message: "Projects fetched successfully",
    projects,
  });
});

module.exports.getProjectById = catchAsync(async (req, res) => {
  const project = await projectServices.getProjectById(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: "Project fetched successfully",
    project,
  });
});

module.exports.updateProject = catchAsync(async (req, res) => {
  const project = await projectServices.updateProject(
    req.user._id,
    req.params.id,
    req.body,
    req.files,
  );

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project,
  });
});

module.exports.deleteProject = catchAsync(async (req, res) => {
  await projectServices.deleteProject(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});
