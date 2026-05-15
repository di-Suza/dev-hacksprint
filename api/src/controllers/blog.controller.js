const blogServices = require("../services/blog.service");
const { catchAsync } = require("../utilities/catchAsync");

module.exports.createBlog = catchAsync(async (req, res) => {
  const blog = await blogServices.createBlog(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
});

module.exports.getMyBlogs = catchAsync(async (req, res) => {
  const blogs = await blogServices.getMyBlogs(req.user._id);

  res.status(200).json({
    success: true,
    message: "Blogs fetched successfully",
    blogs,
  });
});

module.exports.getBlogById = catchAsync(async (req, res) => {
  const blog = await blogServices.getBlogById(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: "Blog fetched successfully",
    blog,
  });
});

module.exports.updateBlog = catchAsync(async (req, res) => {
  const blog = await blogServices.updateBlog(
    req.user._id,
    req.params.id,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog,
  });
});

module.exports.updateBlogPublishStatus = catchAsync(async (req, res) => {
  const blog = await blogServices.updateBlogPublishStatus(
    req.user._id,
    req.params.id,
    req.body.isPublished,
  );

  res.status(200).json({
    success: true,
    message: blog.isPublished
      ? "Blog published successfully"
      : "Blog moved to draft successfully",
    blog,
  });
});

module.exports.deleteBlog = catchAsync(async (req, res) => {
  await blogServices.deleteBlog(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});
