const { z } = require("zod");

const nonEmptyTrimmed = z
  .string()
  .trim()
  .min(1, "Cannot be empty");

const optionalText = z.string().trim().optional();

const userName = z
  .string()
  .trim()
  .min(3, "User name must be at least 3 chars")
  .transform((value) => value.replace(/\s+/g, " "));

const stringArray = z.array(nonEmptyTrimmed).default([]);

const experience = z.object({
  companyName: z.string().trim().default(""),
  timePeriod: z.string().trim().default(""),
});

const education = z.object({
  collegeName: z.string().trim().default(""),
  timePeriod: z.string().trim().default(""),
  course: z.string().trim().default(""),
});

const socialLink = z
  .string()
  .trim()
  .max(300, "Link is too long")
  .refine(
    (value) => !value || /^https?:\/\/\S+$/i.test(value),
    "Link must start with http:// or https://",
  );

const updateProfilePictureSchema = z
  .object({
    body: z
      .object({
        removeProfilePicture: z
          .union([z.boolean(), z.enum(["true", "false"])])
          .optional(),
      })
      .default({}),
  })
  .passthrough();

const updateGeneralInfoSchema = z.object({
  body: z
    .object({
      userName: userName.optional(),
      headline: optionalText,
      about: optionalText,
    })
    .strict()
    .refine((body) => Object.keys(body).length > 0, {
      message: "Please provide userName, headline, or about to update",
    }),
});

const updateProfessionalInfoSchema = z.object({
  body: z
    .object({
      skills: stringArray.optional(),
      experiences: z.array(experience).optional(),
      educations: z.array(education).optional(),
      interests: stringArray.optional(),
      languages: stringArray.optional(),
    })
    .strict()
    .refine((body) => Object.keys(body).length > 0, {
      message: "Please provide professional info to update",
    }),
});

const updateSocialLinksSchema = z.object({
  body: z
    .object({
      github: socialLink.optional(),
      linkedin: socialLink.optional(),
      x: socialLink.optional(),
      youtube: socialLink.optional(),
      portfolio: socialLink.optional(),
      instagram: socialLink.optional(),
    })
    .strict()
    .refine((body) => Object.keys(body).length > 0, {
      message: "Please provide social links to update",
    }),
});

const userIdParamsSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id"),
  }),
});

module.exports = {
  updateGeneralInfoSchema,
  updateProfessionalInfoSchema,
  updateProfilePictureSchema,
  updateSocialLinksSchema,
  userIdParamsSchema,
};
