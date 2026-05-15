const { z } = require("zod");

const feedQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(20).default(10),
  }),
});

module.exports = {
  feedQuerySchema,
};
