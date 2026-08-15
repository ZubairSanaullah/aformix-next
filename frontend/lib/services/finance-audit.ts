import { Prisma } from "@prisma/client";

import { prisma } from "../prisma";

export interface FinanceAuditLogQuery {
    page?: number;
    limit?: number;
    action?: string;
    resource?: string;
    resourceId?: string;
    userId?: string;
}

export interface FinanceAuditLogInput {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string | null;
    metadata?: Record<string, unknown> | null;
}

export async function getFinanceAuditLogs(query: FinanceAuditLogQuery = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.FinanceAuditLogWhereInput = {
        ...(query.action ? { action: { contains: query.action, mode: "insensitive" } } : {}),
        ...(query.resource ? { resource: { contains: query.resource, mode: "insensitive" } } : {}),
        ...(query.resourceId ? { resourceId: query.resourceId } : {}),
        ...(query.userId ? { userId: query.userId } : {}),
    };

    const [logs, total] = await prisma.$transaction([
        prisma.financeAuditLog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),
        prisma.financeAuditLog.count({ where }),
    ]);

    return {
        logs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function createFinanceAuditLog(input: FinanceAuditLogInput) {
    return prisma.financeAuditLog.create({
        data: {
            userId: input.userId,
            action: input.action,
            resource: input.resource,
            resourceId: input.resourceId ?? undefined,
            metadata: input.metadata != null
                ? (input.metadata as Prisma.InputJsonValue)
                : undefined,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
}
