const { z } = require("zod");

const title = z.string().trim().min(3, "Title must be at least 3 chars");
const content = z
  .string()
  .trim()
  .min(20, "Blog content must be at least 20 chars")
  .max(30000, "Blog content is too long");

const categories = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}, z.array(z.string().trim().min(1)).max(10, "Maximum 10 categories allowed").optional());

const isPublished = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean().optional());

const idParams = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid blog id"),
  }),
});

const createBlogSchema = z.object({
  body: z.object({
    title,
    content,
    categories,
    isPublished,
  }),
});

const updateBlogSchema = z
  .object({
    body: z
      .object({
        title: title.optional(),
        content: content.optional(),
        categories,
        isPublished,
      })
      .strict(),
    params: idParams.shape.params,
  })
  .refine(
    (data) => Object.keys(data.body).length > 0,
    "Please provide blog fields to update",
  );

const updateBlogPublishStatusSchema = z.object({
  body: z.object({
    isPublished: z.preprocess((value) => {
      if (value === "true") return true;
      if (value === "false") return false;
      return value;
    }, z.boolean()),
  }),
  params: idParams.shape.params,
});

module.exports = {
  createBlogSchema,
  idParams,
  updateBlogPublishStatusSchema,
  updateBlogSchema,
};
