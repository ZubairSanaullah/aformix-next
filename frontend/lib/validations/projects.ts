import { z } from "zod";

const projectStatusSchema = z.enum([
    "PLANNING",
    "ACTIVE",
    "ON_HOLD",
    "COMPLETED",
    "CANCELLED",
]);

const projectPrioritySchema = z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
]);

const optionalDateSchema = z
    .union([z.coerce.date(), z.null()])
    .optional();

const baseProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Project name is required.")
        .max(150, "Project name must not exceed 150 characters."),

    slug: z
        .string()
        .trim()
        .min(1, "Project slug is required.")
        .max(180, "Project slug must not exceed 180 characters.")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug may only contain lowercase letters, numbers, and hyphens."
        ),

    description: z
        .string()
        .trim()
        .max(
            5000,
            "Project description must not exceed 5000 characters."
        )
        .nullable()
        .optional(),

    status: projectStatusSchema.optional(),

    priority: projectPrioritySchema.optional(),

    progress: z
        .number()
        .int("Progress must be a whole number.")
        .min(0, "Progress cannot be below 0.")
        .max(100, "Progress cannot exceed 100.")
        .optional(),

    startDate: optionalDateSchema,

    dueDate: optionalDateSchema,

    completedAt: optionalDateSchema,

    ownerId: z
        .string()
        .trim()
        .min(1, "Project owner is required."),

    companyId: z
        .string()
        .trim()
        .min(1, "Company ID cannot be empty.")
        .nullable()
        .optional(),
});

export const createProjectSchema = baseProjectSchema.superRefine(
    (data, ctx) => {
        if (
            data.startDate &&
            data.dueDate &&
            data.dueDate < data.startDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["dueDate"],
                message:
                    "Due date cannot be earlier than the start date.",
            });
        }

        if (
            data.startDate &&
            data.completedAt &&
            data.completedAt < data.startDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["completedAt"],
                message:
                    "Completed date cannot be earlier than the start date.",
            });
        }

        if (
            data.dueDate &&
            data.completedAt &&
            data.completedAt < data.dueDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["completedAt"],
                message:
                    "Completed date cannot be earlier than the due date.",
            });
        }

        if (
            data.status === "COMPLETED" &&
            data.progress !== undefined &&
            data.progress < 100
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["progress"],
                message:
                    "A completed project must have 100% progress.",
            });
        }

        if (
            data.progress === 100 &&
            data.status !== undefined &&
            data.status !== "COMPLETED"
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["status"],
                message:
                    "A project with 100% progress must have COMPLETED status.",
            });
        }
    }
);

export const updateProjectSchema = baseProjectSchema
    .partial()
    .superRefine((data, ctx) => {
        if (
            data.startDate &&
            data.dueDate &&
            data.dueDate < data.startDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["dueDate"],
                message:
                    "Due date cannot be earlier than the start date.",
            });
        }

        if (
            data.startDate &&
            data.completedAt &&
            data.completedAt < data.startDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["completedAt"],
                message:
                    "Completed date cannot be earlier than the start date.",
            });
        }

        if (
            data.dueDate &&
            data.completedAt &&
            data.completedAt < data.dueDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["completedAt"],
                message:
                    "Completed date cannot be earlier than the due date.",
            });
        }

        if (
            data.status === "COMPLETED" &&
            data.progress !== undefined &&
            data.progress < 100
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["progress"],
                message:
                    "A completed project must have 100% progress.",
            });
        }

        if (
            data.progress === 100 &&
            data.status !== undefined &&
            data.status !== "COMPLETED"
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["status"],
                message:
                    "A project with 100% progress must have COMPLETED status.",
            });
        }
    });

export const projectIdSchema = z
    .string()
    .trim()
    .min(1, "Project ID is required.");

export const projectListQuerySchema = z
    .object({
        page: z.coerce
            .number()
            .int()
            .min(1)
            .default(1),

        limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .default(20),

        search: z
            .string()
            .trim()
            .max(100)
            .optional(),

        status: projectStatusSchema.optional(),

        priority: projectPrioritySchema.optional(),

        ownerId: z
            .string()
            .trim()
            .min(1)
            .optional(),

        companyId: z
            .string()
            .trim()
            .min(1)
            .optional(),

        startDateFrom: z.coerce
            .date()
            .optional(),

        startDateTo: z.coerce
            .date()
            .optional(),

        dueDateFrom: z.coerce
            .date()
            .optional(),

        dueDateTo: z.coerce
            .date()
            .optional(),

        sort: z
            .enum([
                "createdAt",
                "updatedAt",
                "name",
                "dueDate",
                "priority",
                "status",
                "progress",
            ])
            .default("createdAt"),

        order: z
            .enum(["asc", "desc"])
            .default("desc"),
    })
    .superRefine((data, ctx) => {
        if (
            data.startDateFrom &&
            data.startDateTo &&
            data.startDateTo < data.startDateFrom
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["startDateTo"],
                message:
                    "Start date end cannot be earlier than start date beginning.",
            });
        }

        if (
            data.dueDateFrom &&
            data.dueDateTo &&
            data.dueDateTo < data.dueDateFrom
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["dueDateTo"],
                message:
                    "Due date end cannot be earlier than due date beginning.",
            });
        }
    });

export type CreateProjectInput = z.infer<
    typeof createProjectSchema
>;

export type UpdateProjectInput = z.infer<
    typeof updateProjectSchema
>;

export type ProjectListQuery = z.infer<
    typeof projectListQuerySchema
>;