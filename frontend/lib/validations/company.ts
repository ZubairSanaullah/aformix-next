import { z } from "zod";

export const companySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Company name is required")
        .max(200, "Company name is too long"),

    website: z
        .string()
        .trim()
        .url("Enter a valid website URL")
        .optional()
        .or(z.literal("")),

    industry: z
        .string()
        .trim()
        .max(150, "Industry is too long")
        .optional()
        .or(z.literal("")),

    size: z
        .string()
        .trim()
        .max(100, "Company size is too long")
        .optional()
        .or(z.literal("")),

    phone: z
        .string()
        .trim()
        .max(30, "Phone number is too long")
        .optional()
        .or(z.literal("")),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address")
        .optional()
        .or(z.literal("")),

    location: z
        .string()
        .trim()
        .max(200, "Location is too long")
        .optional()
        .or(z.literal("")),

    description: z
        .string()
        .trim()
        .max(2000, "Description is too long")
        .optional()
        .or(z.literal("")),

    status: z
        .enum(["ACTIVE", "INACTIVE", "ARCHIVED"])
        .default("ACTIVE"),
});

export type CompanyInput = z.infer<typeof companySchema>;