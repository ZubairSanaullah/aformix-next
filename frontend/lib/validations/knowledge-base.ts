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

const pageSchema = z
    .coerce
    .number()
    .int()
    .min(1)
    .max(10_000)
    .default(1);

const limitSchema = z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20);

export const knowledgeCategorySortFieldSchema = z.enum([
    "name",
    "sortOrder",
    "createdAt",
    "updatedAt",
]);

export const knowledgeCategorySortDirectionSchema = z.enum([
    "asc",
    "desc",
]);


export const knowledgeArticleStatusSchema = z.enum([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
]);

export const knowledgeArticleVisibilitySchema = z.enum([
    "INTERNAL",
    "PUBLIC",
]);

export const knowledgeArticleSortFieldSchema = z.enum([
    "title",
    "sortOrder",
    "createdAt",
    "updatedAt",
    "publishedAt",
]);

export const knowledgeArticleSortDirectionSchema = z.enum([
    "asc",
    "desc",
]);

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(100, "Category name must be 100 characters or fewer."),

    slug: slugSchema,

    description: optionalTrimmedString(500),

    icon: z
        .string()
        .trim()
        .max(100, "Icon name must be 100 characters or fewer.")
        .optional()
        .nullable(),

    sortOrder: sortOrderSchema.default(0),
});

export const updateCategorySchema = createCategorySchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one field must be provided.",
    );

export const categoryIdSchema = z.object({
    id: cuidSchema,
});

export const categoryListQuerySchema = z.object({
    search: z
        .string()
        .trim()
        .max(200, "Search must be 200 characters or fewer.")
        .optional(),

    includeDeleted: z.coerce.boolean().default(false),

    page: pageSchema,

    limit: limitSchema,

    sortBy: knowledgeCategorySortFieldSchema.default("sortOrder"),

    sortOrder: knowledgeCategorySortDirectionSchema.default("asc"),
});

export const createArticleSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Article title is required.")
        .max(200, "Article title must be 200 characters or fewer."),

    slug: slugSchema,

    excerpt: optionalTrimmedString(500),

    content: z
        .string()
        .trim()
        .min(1, "Article content is required."),

    categoryId: cuidSchema,

    status: knowledgeArticleStatusSchema.default("DRAFT"),

    visibility: knowledgeArticleVisibilitySchema.default("INTERNAL"),

    featured: z.boolean().default(false),

    sortOrder: sortOrderSchema.default(0),

    publishedAt: z.coerce
        .date()
        .optional()
        .nullable(),

    metaTitle: z
        .string()
        .trim()
        .max(200, "Meta title must be 200 characters or fewer.")
        .optional()
        .nullable(),

    metaDescription: z
        .string()
        .trim()
        .max(320, "Meta description must be 320 characters or fewer.")
        .optional()
        .nullable(),

    canonicalUrl: optionalUrlSchema,
});

export const updateArticleSchema = createArticleSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one field must be provided.",
    );

export const articleIdSchema = z.object({
    id: cuidSchema,
});

export const articleListQuerySchema = z.object({
    search: z
        .string()
        .trim()
        .max(200, "Search must be 200 characters or fewer.")
        .optional(),

    categoryId: cuidSchema.optional(),

    status: knowledgeArticleStatusSchema.optional(),

    visibility: knowledgeArticleVisibilitySchema.optional(),

    authorId: cuidSchema.optional(),

    featured: z.coerce.boolean().optional(),

    includeDeleted: z.coerce.boolean().default(false),

    page: pageSchema,

    limit: limitSchema,

    sortBy: knowledgeArticleSortFieldSchema.default("updatedAt"),

    sortOrder: knowledgeArticleSortDirectionSchema.default("desc"),
});

export const publishArticleSchema = z.object({
    publishedAt: z.coerce
        .date()
        .optional()
        .nullable(),
});

export const archiveArticleSchema = articleIdSchema;

export const restoreArticleSchema = articleIdSchema;

export const archiveCategorySchema = categoryIdSchema;

export const restoreCategorySchema = categoryIdSchema;

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdInput = z.infer<typeof categoryIdSchema>;
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticleIdInput = z.infer<typeof articleIdSchema>;
export type ArticleListQuery = z.infer<typeof articleListQuerySchema>;
export type PublishArticleInput = z.infer<typeof publishArticleSchema>;