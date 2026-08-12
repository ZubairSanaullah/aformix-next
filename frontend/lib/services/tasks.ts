import { prisma } from "@/lib/prisma";
import type {
    Prisma,
    TaskPriority,
    TaskStatus,
} from "@prisma/client";

export type TaskDueFilter =
    | "overdue"
    | "today"
    | "upcoming"
    | "none";

export interface GetTasksOptions {
    ownerId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due?: TaskDueFilter;
    search?: string;
    contactId?: string;
    companyId?: string;
    leadId?: string;
    dealId?: string;
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
 * Get tasks with optional filtering.
 */
export async function getTasks(
    options: GetTasksOptions = {}
) {
    const {
        ownerId,
        status,
        priority,
        due,
        search,
        contactId,
        companyId,
        leadId,
        dealId,
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

    if (due) {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        if (due === "overdue") {
            where.dueAt = {
                lt: startOfToday,
            };
        } else if (due === "today") {
            where.dueAt = {
                gte: startOfToday,
                lte: endOfToday,
            };
        } else if (due === "upcoming") {
            where.dueAt = {
                gt: endOfToday,
            };
        } else if (due === "none") {
            where.dueAt = null;
        }
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
        const searchTerm = search.trim();

        where.OR = [
            {
                title: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: searchTerm,
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
 * Create a task.
 *
 * ownerId is supplied by the server from the authenticated user.
 */
export async function createTask(
    data: CreateTaskData,
    ownerId: string
) {
    const completedAt =
        data.status === "COMPLETED"
            ? new Date()
            : null;

    return prisma.task.create({
        data: {
            title: data.title,
            description: data.description ?? null,
            status: data.status ?? "TODO",
            priority: data.priority ?? "MEDIUM",
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
 * Update a task.
 */
export async function updateTask(
    id: string,
    data: UpdateTaskData
) {
    const updateData: Prisma.TaskUpdateInput = {};

    if (data.title !== undefined) {
        updateData.title = data.title;
    }

    if (data.description !== undefined) {
        updateData.description = data.description;
    }

    if (data.priority !== undefined) {
        updateData.priority = data.priority;
    }

    if (data.dueAt !== undefined) {
        updateData.dueAt = data.dueAt;
    }

    if (data.status !== undefined) {
        updateData.status = data.status;

        if (data.status === "COMPLETED") {
            updateData.completedAt = new Date();
        } else {
            updateData.completedAt = null;
        }
    }

    if (data.contactId !== undefined) {
        updateData.contact = data.contactId
            ? {
                connect: {
                    id: data.contactId,
                },
            }
            : {
                disconnect: true,
            };
    }

    if (data.companyId !== undefined) {
        updateData.company = data.companyId
            ? {
                connect: {
                    id: data.companyId,
                },
            }
            : {
                disconnect: true,
            };
    }

    if (data.leadId !== undefined) {
        updateData.lead = data.leadId
            ? {
                connect: {
                    id: data.leadId,
                },
            }
            : {
                disconnect: true,
            };
    }

    if (data.dealId !== undefined) {
        updateData.deal = data.dealId
            ? {
                connect: {
                    id: data.dealId,
                },
            }
            : {
                disconnect: true,
            };
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
