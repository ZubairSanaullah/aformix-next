import { z } from "zod";

export const contactSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(100, "First name is too long"),

    lastName: z
        .string()
        .trim()
        .max(100, "Last name is too long")
        .optional()
        .or(z.literal("")),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address")
        .optional()
        .or(z.literal("")),

    phone: z
        .string()
        .trim()
        .max(30, "Phone number is too long")
        .optional()
        .or(z.literal("")),

    jobTitle: z
        .string()
        .trim()
        .max(150, "Job title is too long")
        .optional()
        .or(z.literal("")),

    website: z
        .string()
        .trim()
        .url("Enter a valid website URL")
        .optional()
        .or(z.literal("")),

    linkedinUrl: z
        .string()
        .trim()
        .url("Enter a valid LinkedIn URL")
        .optional()
        .or(z.literal("")),

    description: z
        .string()
        .trim()
        .max(2000, "Description is too long")
        .optional()
        .or(z.literal("")),

    companyId: z
        .string()
        .optional()
        .or(z.literal("")),

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

    status: z
        .enum([
            "ACTIVE",
            "INACTIVE",
            "ARCHIVED",
        ])
        .default("ACTIVE"),
});

export type ContactInput = z.infer<typeof contactSchema>;