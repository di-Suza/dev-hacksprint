const { z } = require("zod");

const contentType = z.enum(["project", "blog"]);
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const getCommentsSchema = z.object({
  query: z.object({
    contentId: objectId,
    contentType,
  }),
});

const createCommentSchema = z.object({
  body: z.object({
    contentId: objectId,
    contentType,
    comment: z
      .string()
      .trim()
      .min(1, "Comment cannot be empty")
      .max(1000, "Comment is too long"),
  }),
});

const deleteCommentSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

module.exports = {
  createCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
};
