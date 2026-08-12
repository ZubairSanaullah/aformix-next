import { z } from "zod";

export const activityTypeValues = [
    "CALL",
    "EMAIL",
    "MEETING",
    "FOLLOW_UP",
    "NOTE",
    "OTHER",
] as const;

export const activitySchema = z
    .object({
        type: z.enum(activityTypeValues),
        title: z
            .string()
            .min(1, "Title is required")
            .max(200, "Title must be less than 200 characters"),
        description: z
            .string()
            .max(2000, "Description must be less than 2000 characters")
            .optional()
            .nullable(),
        contactId: z.string().optional().nullable(),
        companyId: z.string().optional().nullable(),
        leadId: z.string().optional().nullable(),
        dealId: z.string().optional().nullable(),
        userId: z.string().min(1, "Owner is required"),
        dueAt: z.coerce.date().optional().nullable(),
        completedAt: z.coerce.date().optional().nullable(),
    })
    .refine(
        (data) =>
            data.contactId ||
            data.companyId ||
            data.leadId ||
            data.dealId,
        {
            message:
                "An activity must be linked to at least one of: contact, company, lead, or deal.",
            path: ["contactId"],
        }
    );

export type ActivityInput = z.infer<typeof activitySchema>;

export const activityUpdateSchema = z.object({
    type: z.enum(activityTypeValues).optional(),
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters")
        .optional(),
    description: z
        .string()
        .max(2000, "Description must be less than 2000 characters")
        .optional()
        .nullable(),
    contactId: z.string().optional().nullable(),
    companyId: z.string().optional().nullable(),
    leadId: z.string().optional().nullable(),
    dealId: z.string().optional().nullable(),
    userId: z.string().min(1).optional(),
    dueAt: z.coerce.date().optional().nullable(),
    completedAt: z.coerce.date().optional().nullable(),
});

export type ActivityUpdateInput = z.infer<typeof activityUpdateSchema>;