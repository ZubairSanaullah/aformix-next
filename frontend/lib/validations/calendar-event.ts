import { z } from "zod";

const calendarEventTypeSchema = z.enum([
    "MEETING",
    "APPOINTMENT",
    "CALL",
    "REMINDER",
    "OTHER",
]);

const calendarEventStatusSchema = z.enum([
    "SCHEDULED",
    "COMPLETED",
    "CANCELLED",
]);

/**
 * Validate that a string represents a valid ISO timestamp
 * containing explicit timezone information.
 *
 * Examples:
 *
 * 2026-08-20T10:00:00+05:00
 * 2026-08-20T05:00:00Z
 */
const isoDateTimeSchema = z
    .string()
    .min(1, "Date and time are required")
    .refine(
        (value) => {
            const parsed = Date.parse(value);

            return !Number.isNaN(parsed);
        },
        "Date and time must be valid"
    )
    .refine(
        (value) => {
            /**
             * Require either:
             *
             * Z
             *
             * or an explicit UTC offset such as:
             *
             * +05:00
             * -04:00
             */
            return /(?:Z|[+-]\d{2}:\d{2})$/i.test(
                value
            );
        },
        "Date and time must include a timezone"
    );


/**
 * Complete Calendar Event validation schema.
 *
 * This schema represents data received from the API/client.
 *
 * Dates remain strings here because HTTP request bodies
 * contain JSON values. The API layer is responsible for
 * converting validated ISO strings into JavaScript Date
 * objects before passing data to the service layer.
 */
export const calendarEventSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Event title is required")
            .max(
                255,
                "Title must be 255 characters or fewer"
            ),

        description: z
            .string()
            .max(
                5000,
                "Description must be 5000 characters or fewer"
            )
            .nullable()
            .optional(),

        type: calendarEventTypeSchema.default(
            "MEETING"
        ),

        status: calendarEventStatusSchema.default(
            "SCHEDULED"
        ),

        startAt: isoDateTimeSchema,

        endAt: isoDateTimeSchema,

        allDay: z.boolean().default(false),

        location: z
            .string()
            .trim()
            .max(
                500,
                "Location must be 500 characters or fewer"
            )
            .nullable()
            .optional(),

        contactId: z
            .string()
            .nullable()
            .optional()
            .transform((value) => (value === "" ? null : value)),

        companyId: z
            .string()
            .nullable()
            .optional()
            .transform((value) => (value === "" ? null : value)),

        leadId: z
            .string()
            .nullable()
            .optional()
            .transform((value) => (value === "" ? null : value)),

        dealId: z
            .string()
            .nullable()
            .optional()
            .transform((value) => (value === "" ? null : value)),

        taskId: z
            .string()
            .nullable()
            .optional()
            .transform((value) => (value === "" ? null : value)),
    })
    .refine(
        (data) => {
            const start = new Date(data.startAt);
            const end = new Date(data.endAt);

            return end > start;
        },
        {
            message:
                "End date and time must be after start date and time",
            path: ["endAt"],
        }
    );


export type CalendarEventInput = z.infer<
    typeof calendarEventSchema
>;


/**
 * Data passed from the API layer into the Scheduler
 * service when creating an event.
 *
 * At this point dates have already been converted from
 * validated ISO strings into JavaScript Date objects.
 */
export interface CreateCalendarEventData {
    title: string;

    description?: string | null;

    type?:
    | "MEETING"
    | "APPOINTMENT"
    | "CALL"
    | "REMINDER"
    | "OTHER";

    status?:
    | "SCHEDULED"
    | "COMPLETED"
    | "CANCELLED";

    startAt: Date;

    endAt: Date;

    allDay?: boolean;

    location?: string | null;

    contactId?: string | null;

    companyId?: string | null;

    leadId?: string | null;

    dealId?: string | null;

    taskId?: string | null;
}


/**
 * Data passed from the API layer into the Scheduler
 * service when updating an event.
 */
export interface UpdateCalendarEventData {
    title?: string;

    description?: string | null;

    type?:
    | "MEETING"
    | "APPOINTMENT"
    | "CALL"
    | "REMINDER"
    | "OTHER";

    status?:
    | "SCHEDULED"
    | "COMPLETED"
    | "CANCELLED";

    startAt?: Date;

    endAt?: Date;

    allDay?: boolean;

    location?: string | null;

    contactId?: string | null;

    companyId?: string | null;

    leadId?: string | null;

    dealId?: string | null;

    taskId?: string | null;
}