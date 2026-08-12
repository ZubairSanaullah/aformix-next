import { prisma } from "@/lib/prisma";
import type {
    ActivityInput,
    ActivityUpdateInput,
} from "@/lib/validations/activity";

interface GetActivitiesParams {
    search?: string;
    type?: string;
    contactId?: string;
    companyId?: string;
    leadId?: string;
    dealId?: string;
    userId?: string;
    completed?: boolean;
    overdue?: boolean;
}

const activityInclude = {
    contact: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
        },
    },
    company: {
        select: {
            id: true,
            name: true,
        },
    },
    lead: {
        select: {
            id: true,
            title: true,
        },
    },
    deal: {
        select: {
            id: true,
            title: true,
        },
    },
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
} as const;

export async function getActivities(params: GetActivitiesParams = {}) {
    const {
        search,
        type,
        contactId,
        companyId,
        leadId,
        dealId,
        userId,
        completed,
        overdue,
    } = params;

    const now = new Date();

    return prisma.activity.findMany({
        where: {
            ...(search && {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }),
            ...(type && { type: type as any }),
            ...(contactId && { contactId }),
            ...(companyId && { companyId }),
            ...(leadId && { leadId }),
            ...(dealId && { dealId }),
            ...(userId && { userId }),
            ...(completed === true && { completedAt: { not: null } }),
            ...(completed === false && { completedAt: null }),
            ...(overdue && {
                completedAt: null,
                dueAt: { lt: now },
            }),
        },
        include: activityInclude,
        orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    });
}

export async function getActivityById(id: string) {
    return prisma.activity.findUnique({
        where: { id },
        include: activityInclude,
    });
}

export async function createActivity(data: ActivityInput) {
    return prisma.activity.create({
        data: {
            type: data.type,
            title: data.title,
            description: data.description ?? undefined,
            contactId: data.contactId ?? undefined,
            companyId: data.companyId ?? undefined,
            leadId: data.leadId ?? undefined,
            dealId: data.dealId ?? undefined,
            userId: data.userId,
            dueAt: data.dueAt ?? undefined,
            completedAt: data.completedAt ?? undefined,
        },
        include: activityInclude,
    });
}

export async function updateActivity(
    id: string,
    data: ActivityUpdateInput
) {
    return prisma.activity.update({
        where: { id },
        data: {
            ...(data.type !== undefined && { type: data.type }),
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && {
                description: data.description,
            }),
            ...(data.contactId !== undefined && { contactId: data.contactId }),
            ...(data.companyId !== undefined && { companyId: data.companyId }),
            ...(data.leadId !== undefined && { leadId: data.leadId }),
            ...(data.dealId !== undefined && { dealId: data.dealId }),
            ...(data.userId !== undefined && { userId: data.userId }),
            ...(data.dueAt !== undefined && { dueAt: data.dueAt }),
            ...(data.completedAt !== undefined && {
                completedAt: data.completedAt,
            }),
        },
        include: activityInclude,
    });
}

export async function deleteActivity(id: string) {
    return prisma.activity.delete({
        where: { id },
    });
}

// Toggles completion. If marking complete and no explicit timestamp is
// given, stamps "now". If marking incomplete, clears completedAt.
export async function toggleActivityCompletion(
    id: string,
    completed: boolean
) {
    return prisma.activity.update({
        where: { id },
        data: {
            completedAt: completed ? new Date() : null,
        },
        include: activityInclude,
    });
}