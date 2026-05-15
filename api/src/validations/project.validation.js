const { z } = require("zod");

const title = z.string().trim().min(3, "Title must be at least 3 chars");
const description = z.string().trim().max(2000, "Description is too long").optional();
const link = z
  .string()
  .trim()
  .max(300, "Link is too long")
  .refine(
    (value) => !value || /^https?:\/\/\S+$/i.test(value),
    "Link must start with http:// or https://",
  )
  .optional();

const tags = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}, z.array(z.string().trim().min(1)).max(12, "Maximum 12 tags allowed").optional());

const idParams = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project id"),
  }),
});

const createProjectSchema = z.object({
  body: z.object({
    title,
    description,
    githubLink: link,
    liveLink: link,
    tags,
  }),
});

const updateProjectSchema = z
  .object({
    body: z
      .object({
        title: title.optional(),
        description,
        githubLink: link,
        liveLink: link,
        tags,
        removeImages: z
          .union([z.boolean(), z.enum(["true", "false"])])
          .optional(),
      })
      .strict(),
    params: idParams.shape.params,
  })
  .refine(
    (data) => Object.keys(data.body).length > 0,
    "Please provide project fields to update",
  );

module.exports = {
  createProjectSchema,
  idParams,
  updateProjectSchema,
};
