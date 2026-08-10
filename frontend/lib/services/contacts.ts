import { prisma } from "@/lib/prisma";

export async function getContacts(options?: {
    search?: string;
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    companyId?: string;
    ownerId?: string;
}) {
    const { search, status, companyId, ownerId } = options ?? {};

    return prisma.contact.findMany({
        where: {
            deletedAt: null,

            ...(status ? { status } : {}),

            ...(companyId ? { companyId } : {}),

            ...(ownerId ? { ownerId } : {}),

            ...(search
                ? {
                    OR: [
                        {
                            firstName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            lastName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            phone: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            company: {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                }
                : {}),
        },

        include: {
            company: {
                select: {
                    id: true,
                    name: true,
                },
            },

            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getContactById(id: string) {
    return prisma.contact.findFirst({
        where: {
            id,
            deletedAt: null,
        },

        include: {
            company: true,

            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            leads: true,
            deals: true,
            notes: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            activities: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
}