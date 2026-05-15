const { z } = require("zod");

const likeContentSchema = z.object({
  body: z.object({
    contentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid content id"),
    contentType: z.enum(["project", "blog"]),
  }),
});

module.exports = {
  likeContentSchema,
};
