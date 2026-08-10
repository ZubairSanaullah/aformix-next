import { prisma } from "@/lib/prisma";

export type CRMCompanyFilters = {
    search?: string;
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

export async function getCRMCompanies(
    filters: CRMCompanyFilters = {}
) {
    const { search, status } = filters;

    return prisma.company.findMany({
        where: {
            ...(search
                ? {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            website: {
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
                    ],
                }
                : {}),

            ...(status
                ? {
                    status,
                }
                : {}),
        },

        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            _count: {
                select: {
                    contacts: true,
                    deals: true,
                    leads: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
}


export type CreateCRMCompanyInput = {
    name: string;
    website?: string;
    industry?: string;
    size?: string;
    phone?: string;
    email?: string;
    location?: string;
    description?: string;
    ownerId: string;
};

export async function createCRMCompany(
    input: CreateCRMCompanyInput
) {
    return prisma.company.create({
        data: {
            name: input.name.trim(),

            website: input.website?.trim() || null,
            industry: input.industry?.trim() || null,
            size: input.size?.trim() || null,
            phone: input.phone?.trim() || null,
            email: input.email?.trim() || null,
            location: input.location?.trim() || null,
            description: input.description?.trim() || null,

            ownerId: input.ownerId,
        },

        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            _count: {
                select: {
                    contacts: true,
                    leads: true,
                    deals: true,
                },
            },
        },
    });
}


export async function getCRMCompanyById(id: string) {
    return prisma.company.findUnique({
        where: {
            id,
        },

        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            _count: {
                select: {
                    contacts: true,
                    leads: true,
                    deals: true,
                },
            },
        },
    });
}

export type UpdateCRMCompanyInput = {
    name: string;
    website?: string;
    industry?: string;
    size?: string;
    phone?: string;
    email?: string;
    location?: string;
    description?: string;
    status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

export async function updateCRMCompany(
    id: string,
    input: UpdateCRMCompanyInput
) {
    return prisma.company.update({
        where: {
            id,
        },

        data: {
            name: input.name.trim(),

            website: input.website?.trim() || null,
            industry: input.industry?.trim() || null,
            size: input.size?.trim() || null,
            phone: input.phone?.trim() || null,
            email: input.email?.trim() || null,
            location: input.location?.trim() || null,
            description: input.description?.trim() || null,

            ...(input.status
                ? {
                    status: input.status,
                }
                : {}),
        },

        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            _count: {
                select: {
                    contacts: true,
                    leads: true,
                    deals: true,
                },
            },
        },
    });
}