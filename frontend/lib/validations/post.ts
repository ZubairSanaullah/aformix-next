import { z } from "zod";

export const postSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters.")
        .max(150, "Title cannot exceed 150 characters."),

    excerpt: z
        .string()
        .min(20, "Excerpt must be at least 20 characters.")
        .max(300, "Excerpt cannot exceed 300 characters."),

    content: z
        .string()
        .min(50, "Content must be at least 50 characters."),

    categoryId: z
        .string()
        .min(1, "Please select a category."),

    tagIds: z
        .array(z.string()),

    seoTitle: z
        .string()
        .max(60, "SEO title cannot exceed 60 characters.")
        .optional()
        .or(z.literal("")),

    seoDescription: z
        .string()
        .max(160, "SEO description cannot exceed 160 characters.")
        .optional()
        .or(z.literal("")),

    featuredImage: z
        .string()
        .nullable()
        .optional(),
});

export type PostInput = z.infer<typeof postSchema>;