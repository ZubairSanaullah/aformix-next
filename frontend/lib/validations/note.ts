import { z } from "zod";

export const noteSchema = z
    .object({
        content: z
            .string()
            .min(1, "Note content is required")
            .max(5000, "Note must be less than 5000 characters"),
        contactId: z.string().optional().nullable(),
        companyId: z.string().optional().nullable(),
        leadId: z.string().optional().nullable(),
        dealId: z.string().optional().nullable(),
        userId: z.string().min(1, "Owner is required"),
    })
    .refine(
        (data) =>
            data.contactId ||
            data.companyId ||
            data.leadId ||
            data.dealId,
        {
            message:
                "A note must be linked to at least one of: contact, company, lead, or deal.",
            path: ["contactId"],
        }
    );

export type NoteInput = z.infer<typeof noteSchema>;

export const noteUpdateSchema = z.object({
    content: z
        .string()
        .min(1, "Note content is required")
        .max(5000, "Note must be less than 5000 characters")
        .optional(),
    contactId: z.string().optional().nullable(),
    companyId: z.string().optional().nullable(),
    leadId: z.string().optional().nullable(),
    dealId: z.string().optional().nullable(),
});

export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>;