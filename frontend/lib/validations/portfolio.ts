import { z } from "zod";

const cuidSchema = z.string().cuid();

const slugSchema = z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200, "Slug must be 200 characters or fewer.")
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug may only contain lowercase letters, numbers, and single hyphens.",
    );

const optionalTrimmedString = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .optional()
        .nullable();

const optionalUrlSchema = z
    .string()
    .trim()
    .url("Must be a valid URL.")
    .max(2048, "URL must be 2048 characters or fewer.")
    .optional()
    .nullable();

const sortOrderSchema = z
    .number()
    .int("Sort order must be an integer.")
    .min(0, "Sort order cannot be negative.")
    .max(1_000_000, "Sort order is too large.");

const pageSchema = z.coerce.number().int().min(1).max(10_000).default(1);
const limitSchema = z.coerce.number().int().min(1).max(100).default(20);

export const portfolioCategorySortFieldSchema = z.enum([
    "name",
    "sortOrder",
    "createdAt",
    "updatedAt",
]);

export const portfolioCategorySortDirectionSchema = z.enum([
    "asc",
    "desc",
]);

export const portfolioProjectStatusSchema = z.enum([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
]);

export const portfolioProjectVisibilitySchema = z.enum([
    "INTERNAL",
    "PUBLIC",
]);

export const portfolioProjectSortFieldSchema = z.enum([
    "title",
    "featured",
    "sortOrder",
    "createdAt",
    "updatedAt",
    "publishedAt",
    "completionDate",
]);

export const portfolioProjectSortDirectionSchema = z.enum([
    "asc",
    "desc",
]);

export const createPortfolioCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(100, "Category name must be 100 characters or fewer."),

    slug: slugSchema,

    description: optionalTrimmedString(1000),

    icon: z
        .string()
        .trim()
        .max(100, "Icon name must be 100 characters or fewer.")
        .optional()
        .nullable(),

    sortOrder: sortOrderSchema.default(0),
});

export const updatePortfolioCategorySchema = createPortfolioCategorySchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one field must be provided.",
    );

export const portfolioCategoryIdSchema = z.object({
    id: cuidSchema,
});

export const portfolioCategoryListQuerySchema = z.object({
    search: z
        .string()
        .trim()
        .max(200, "Search must be 200 characters or fewer.")
        .optional(),

    includeDeleted: z.coerce.boolean().default(false),

    page: pageSchema,

    limit: limitSchema,

    sortBy: portfolioCategorySortFieldSchema.default("sortOrder"),

    sortOrder: portfolioCategorySortDirectionSchema.default("asc"),
});

export const createPortfolioProjectSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Project title is required.")
            .max(200, "Project title must be 200 characters or fewer."),

        slug: slugSchema,

        excerpt: optionalTrimmedString(500),

        description: optionalTrimmedString(5000),

        content: z
            .string()
            .trim()
            .min(1, "Project content is required.")
            .optional()
            .nullable(),

        status: portfolioProjectStatusSchema.default("DRAFT"),

        visibility: portfolioProjectVisibilitySchema.default("INTERNAL"),

        featured: z.boolean().default(false),

        sortOrder: sortOrderSchema.default(0),

        clientName: optionalTrimmedString(200),

        clientIndustry: optionalTrimmedString(200),

        projectUrl: optionalUrlSchema,

        repositoryUrl: optionalUrlSchema,

        startDate: z.coerce.date().optional().nullable(),

        completionDate: z.coerce.date().optional().nullable(),

        categoryId: cuidSchema.optional().nullable(),

        authorId: cuidSchema,

        seoTitle: optionalTrimmedString(200),

        seoDescription: optionalTrimmedString(320),

        seoKeywords: optionalTrimmedString(500),

        canonicalUrl: optionalUrlSchema,

        publishedAt: z.coerce.date().optional().nullable(),

        technologyIds: z.array(cuidSchema).default([]),
    })
    .superRefine((data, ctx) => {
        if (data.startDate && data.completionDate && data.completionDate < data.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["completionDate"],
                message: "Completion date cannot be earlier than the start date.",
            });
        }

        if (data.status === "PUBLISHED" && !data.publishedAt) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["publishedAt"],
                message: "Published projects must include a published date.",
            });
        }
    });

export const updatePortfolioProjectSchema = createPortfolioProjectSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one field must be provided.",
    );

export const portfolioProjectIdSchema = z.object({
    id: cuidSchema,
});

export const portfolioProjectListQuerySchema = z.object({
    search: z
        .string()
        .trim()
        .max(200, "Search must be 200 characters or fewer.")
        .optional(),

    categoryId: cuidSchema.optional(),

    status: portfolioProjectStatusSchema.optional(),

    visibility: portfolioProjectVisibilitySchema.optional(),

    featured: z.coerce.boolean().optional(),

    technologyId: cuidSchema.optional(),

    startDateFrom: z.coerce.date().optional(),

    startDateTo: z.coerce.date().optional(),

    completionDateFrom: z.coerce.date().optional(),

    completionDateTo: z.coerce.date().optional(),

    includeDeleted: z.coerce.boolean().default(false),

    page: pageSchema,

    limit: limitSchema,

    sortBy: portfolioProjectSortFieldSchema.default("updatedAt"),

    sortOrder: portfolioProjectSortDirectionSchema.default("desc"),
});

export const portfolioSlugSchema = z.object({
    slug: slugSchema,
});

export type CreatePortfolioCategoryInput = z.infer<typeof createPortfolioCategorySchema>;
export type UpdatePortfolioCategoryInput = z.infer<typeof updatePortfolioCategorySchema>;
export type PortfolioCategoryIdInput = z.infer<typeof portfolioCategoryIdSchema>;
export type PortfolioCategoryListQuery = z.infer<typeof portfolioCategoryListQuerySchema>;

export type CreatePortfolioProjectInput = z.infer<typeof createPortfolioProjectSchema>;
export type UpdatePortfolioProjectInput = z.infer<typeof updatePortfolioProjectSchema>;
export type PortfolioProjectIdInput = z.infer<typeof portfolioProjectIdSchema>;
export type PortfolioProjectListQuery = z.infer<typeof portfolioProjectListQuerySchema>;
