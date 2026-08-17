import { z } from "zod";

const slugSchema = z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200)
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug may only contain lowercase letters, numbers, and single hyphens.",
    );

const optionalUrl = z
    .string()
    .trim()
    .url("Must be a valid URL.")
    .max(2048)
    .optional()
    .or(z.literal(""));

export const portfolioProjectFormSchema = z
    .object({
        title: z.string().trim().min(1, "Title is required.").max(200),
        slug: slugSchema,
        excerpt: z.string().trim().max(500).optional().or(z.literal("")),
        description: z.string().trim().max(5000).optional().or(z.literal("")),
        content: z.string().optional().or(z.literal("")),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
        visibility: z.enum(["INTERNAL", "PUBLIC"]),
        featured: z.boolean(),
        clientName: z.string().trim().max(200).optional().or(z.literal("")),
        clientIndustry: z.string().trim().max(200).optional().or(z.literal("")),
        projectUrl: optionalUrl,
        repositoryUrl: optionalUrl,
        startDate: z.string().optional().or(z.literal("")),
        completionDate: z.string().optional().or(z.literal("")),
        categoryId: z.string().optional().or(z.literal("")),
        technologyIds: z.array(z.string()),
        seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
        seoDescription: z.string().trim().max(320).optional().or(z.literal("")),
        seoKeywords: z.string().trim().max(500).optional().or(z.literal("")),
        canonicalUrl: optionalUrl,
    })
    .superRefine((data, ctx) => {
        if (
            data.startDate &&
            data.completionDate &&
            data.completionDate < data.startDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["completionDate"],
                message: "Completion date cannot be earlier than the start date.",
            });
        }
    });

export type PortfolioProjectFormInput = z.infer<typeof portfolioProjectFormSchema>;

export const EMPTY_PORTFOLIO_PROJECT_FORM: PortfolioProjectFormInput = {
    title: "",
    slug: "",
    excerpt: "",
    description: "",
    content: "",
    status: "DRAFT",
    visibility: "INTERNAL",
    featured: false,
    clientName: "",
    clientIndustry: "",
    projectUrl: "",
    repositoryUrl: "",
    startDate: "",
    completionDate: "",
    categoryId: "",
    technologyIds: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    canonicalUrl: "",
};
