import { z } from "zod";

export const categorySchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name cannot exceed 100 characters."),

    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters.")
        .optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;