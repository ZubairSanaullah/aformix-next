import { z } from "zod";

import { Prisma, TaskPriority, TaskStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const taskSchema = z.object({
    title: z
        .string()
        .min(1, "Task title is required")
        .max(255, "Title must be 255 characters or fewer"),

    description: z
        .string()
        .max(5000, "Description must be 5000 characters or fewer")
        .nullable()
        .optional(),

    status: z
        .enum(["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
        .default("TODO"),

    priority: z
        .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
        .default("MEDIUM"),

    dueAt: z.string().nullable().optional(),

    contactId: z.string().nullable().optional(),

    companyId: z.string().nullable().optional(),

    leadId: z.string().nullable().optional(),

    dealId: z.string().nullable().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;


export interface GetTasksOptions {
    ownerId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    contactId?: string;
    companyId?: string;
    leadId?: string;
    dealId?: string;
    search?: string;
}

export interface CreateTaskData {
    title: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueAt?: Date | null;
    contactId?: string | null;
    companyId?: string | null;
    leadId?: string | null;
    dealId?: string | null;
}

export interface UpdateTaskData {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueAt?: Date | null;
    contactId?: string | null;
    companyId?: string | null;
    leadId?: string | null;
    dealId?: string | null;
}

const taskInclude = {
    owner: true,
    contact: true,
    company: true,
    lead: true,
    deal: true,
} satisfies Prisma.TaskInclude;

/**
 * Get tasks with optional filters.
 */
export async function getTasks(options: GetTasksOptions = {}) {
    const {
        ownerId,
        status,
        priority,
        contactId,
        companyId,
        leadId,
        dealId,
        search,
    } = options;

    const where: Prisma.TaskWhereInput = {};

    if (ownerId) {
        where.ownerId = ownerId;
    }

    if (status) {
        where.status = status;
    }

    if (priority) {
        where.priority = priority;
    }

    if (contactId) {
        where.contactId = contactId;
    }

    if (companyId) {
        where.companyId = companyId;
    }

    if (leadId) {
        where.leadId = leadId;
    }

    if (dealId) {
        where.dealId = dealId;
    }

    if (search?.trim()) {
        where.OR = [
            {
                title: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },
        ];
    }

    return prisma.task.findMany({
        where,
        include: taskInclude,
        orderBy: [
            {
                dueAt: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
}

/**
 * Get a single task by ID.
 */
export async function getTaskById(id: string) {
    return prisma.task.findUnique({
        where: {
            id,
        },
        include: taskInclude,
    });
}

/**
 * Create a new task.
 *
 * ownerId is intentionally supplied separately from the client data.
 */
export async function createTask(
    data: CreateTaskData,
    ownerId: string
) {
    const completedAt =
        data.status === TaskStatus.COMPLETED
            ? new Date()
            : null;

    return prisma.task.create({
        data: {
            title: data.title,
            description: data.description ?? null,
            status: data.status ?? TaskStatus.TODO,
            priority: data.priority ?? TaskPriority.MEDIUM,
            dueAt: data.dueAt ?? null,
            completedAt,
            ownerId,
            contactId: data.contactId ?? null,
            companyId: data.companyId ?? null,
            leadId: data.leadId ?? null,
            dealId: data.dealId ?? null,
        },
        include: taskInclude,
    });
}

/**
 * Update an existing task.
 */
export async function updateTask(
    id: string,
    data: UpdateTaskData
) {
    const updateData: Prisma.TaskUpdateInput = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueAt: data.dueAt,
        contact: data.contactId
            ? {
                connect: {
                    id: data.contactId,
                },
            }
            : data.contactId === null
                ? {
                    disconnect: true,
                }
                : undefined,
        company: data.companyId
            ? {
                connect: {
                    id: data.companyId,
                },
            }
            : data.companyId === null
                ? {
                    disconnect: true,
                }
                : undefined,
        lead: data.leadId
            ? {
                connect: {
                    id: data.leadId,
                },
            }
            : data.leadId === null
                ? {
                    disconnect: true,
                }
                : undefined,
        deal: data.dealId
            ? {
                connect: {
                    id: data.dealId,
                },
            }
            : data.dealId === null
                ? {
                    disconnect: true,
                }
                : undefined,
    };

    if (data.status !== undefined) {
        updateData.status = data.status;

        if (data.status === TaskStatus.COMPLETED) {
            updateData.completedAt = new Date();
        } else {
            updateData.completedAt = null;
        }
    }

    return prisma.task.update({
        where: {
            id,
        },
        data: updateData,
        include: taskInclude,
    });
}

/**
 * Delete a task.
 */
export async function deleteTask(id: string) {
    return prisma.task.delete({
        where: {
            id,
        },
    });
}
