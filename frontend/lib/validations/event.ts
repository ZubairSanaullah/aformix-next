import { z } from "zod";

export const eventSchema = z
    .object({
        title: z
            .string()
            .min(1, "Title is required.")
            .max(200, "Title must be under 200 characters."),

        description: z.string().max(5000).optional().nullable(),

        type: z.enum([
            "MEETING",
            "APPOINTMENT",
            "CALL",
            "REMINDER",
            "OTHER",
        ]),

        status: z.enum([
            "SCHEDULED",
            "COMPLETED",
            "CANCELLED",
        ]),

        // datetime-local input values, e.g. "2026-08-12T14:30"
        startAt: z.string().min(1, "Start date/time is required."),
        endAt: z.string().min(1, "End date/time is required."),

        allDay: z.boolean(),

        location: z.string().max(300).optional().nullable(),

        contactId: z.string().optional().nullable(),
        companyId: z.string().optional().nullable(),
        leadId: z.string().optional().nullable(),
        dealId: z.string().optional().nullable(),
        taskId: z.string().optional().nullable(),
    })
    .refine(
        (data) => new Date(data.endAt) >= new Date(data.startAt),
        {
            message: "End must be on or after the start.",
            path: ["endAt"],
        }
    );

export type EventInput = z.infer<typeof eventSchema>;

export const EMPTY_EVENT_VALUES: EventInput = {
    title: "",
    description: "",
    type: "MEETING",
    status: "SCHEDULED",
    startAt: "",
    endAt: "",
    allDay: false,
    location: "",
    contactId: "",
    companyId: "",
    leadId: "",
    dealId: "",
    taskId: "",
};
