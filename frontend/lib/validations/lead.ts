import { z } from "zod";

export const leadSchema = z.object({
    title: z
        .string()
        .min(1, "Lead title is required")
        .max(255, "Title must be 255 characters or fewer"),

    description: z
        .string()
        .max(5000, "Description must be 5000 characters or fewer")
        .optional(),

    status: z
        .enum([
            "NEW",
            "CONTACTED",
            "QUALIFIED",
            "CONVERTED",
            "LOST",
        ])
        .default("NEW"),

    source: z
        .enum([
            "WEBSITE",
            "LINKEDIN",
            "INSTAGRAM",
            "FACEBOOK",
            "REFERRAL",
            "EMAIL",
            "COLD_OUTREACH",
            "GOOGLE",
            "OTHER",
        ])
        .optional(),

    value: z
        .number()
        .nonnegative("Value must be a positive number")
        .optional(),

    contactId: z.string().optional(),

    companyId: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;