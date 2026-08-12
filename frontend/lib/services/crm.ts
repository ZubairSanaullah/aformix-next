import { getContacts } from "@/lib/services/contacts";
import { prisma } from "@/lib/prisma";

interface CRMContactFilters {
    search?: string;
    status?: string;
    companyId?: string;
}

interface CRMLeadFilters {
    search?: string;
    status?: string;
    source?: string;
    companyId?: string;
    contactId?: string;
    ownerId?: string;
}


export async function getCRMContacts(
    filters: CRMContactFilters = {}
) {
    return getContacts(filters as any);
}

export async function getCRMCompaniesForFilter() {
    return prisma.company.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}

export async function getCRMOverviewMetrics() {
    const [
        contacts,
        activeLeads,
        openDeals,
        pipelineValue,
    ] = await Promise.all([
        prisma.contact.count({
            where: {
                deletedAt: null,
            },
        }),

        prisma.lead.count({
            where: {
                status: {
                    in: [
                        "NEW",
                        "CONTACTED",
                        "QUALIFIED",
                    ],
                },
            },
        }),

        prisma.deal.count({
            where: {
                closedAt: null,
            },
        }),

        prisma.deal.aggregate({
            where: {
                closedAt: null,
            },
            _sum: {
                value: true,
            },
        }),
    ]);

    return {
        contacts,
        activeLeads,
        openDeals,
        pipelineValue: pipelineValue._sum.value
            ? Number(pipelineValue._sum.value)
            : 0,
    };
}


export async function getCRMLeads(
    filters: CRMLeadFilters = {}
) {
    const {
        search,
        status,
        source,
        companyId,
        contactId,
        ownerId,
    } = filters;

    return prisma.lead.findMany({
        where: {
            ...(search
                ? {
                    OR: [
                        {
                            title: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            contact: {
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
                                ],
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

            ...(status ? { status: status as any } : {}),
            ...(source ? { source: source as any } : {}),
            ...(companyId ? { companyId } : {}),
            ...(contactId ? { contactId } : {}),
            ...(ownerId ? { ownerId } : {}),
        },

        include: {
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

            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            _count: {
                select: {
                    activities: true,
                    notes: true,
                    deal: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getCRMLead(id: string) {
    return prisma.lead.findUnique({
        where: {
            id,
        },

        include: {
            contact: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    jobTitle: true,
                },
            },

            company: {
                select: {
                    id: true,
                    name: true,
                    website: true,
                    industry: true,
                    size: true,
                    email: true,
                    phone: true,
                },
            },

            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            activities: {
                orderBy: {
                    createdAt: "desc",
                },
            },

            notes: {
                orderBy: {
                    createdAt: "desc",
                },
            },

            deal: {
                orderBy: {
                    createdAt: "desc",
                },
            },

            _count: {
                select: {
                    activities: true,
                    notes: true,
                    deal: true,
                },
            },
        },
    });
}

export async function createCRMLead(data: {
    title: string;
    description?: string;
    status?: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
    source?:
    | "WEBSITE"
    | "LINKEDIN"
    | "INSTAGRAM"
    | "FACEBOOK"
    | "REFERRAL"
    | "EMAIL"
    | "COLD_OUTREACH"
    | "GOOGLE"
    | "OTHER";
    value?: number;
    contactId?: string;
    companyId?: string;
    ownerId: string;
}) {
    if (data.contactId) {
        const contact = await prisma.contact.findUnique({
            where: {
                id: data.contactId,
            },
            select: {
                id: true,
            },
        });

        if (!contact) {
            throw new Error("CONTACT_NOT_FOUND");
        }
    }

    if (data.companyId) {
        const company = await prisma.company.findUnique({
            where: {
                id: data.companyId,
            },
            select: {
                id: true,
            },
        });

        if (!company) {
            throw new Error("COMPANY_NOT_FOUND");
        }
    }

    return prisma.lead.create({
        data: {
            title: data.title,
            description: data.description || null,
            status: data.status ?? "NEW",
            source: data.source ?? null,
            value: data.value ?? null,
            contactId: data.contactId || null,
            companyId: data.companyId || null,
            ownerId: data.ownerId,
        },

        include: {
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

            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
}

export async function updateCRMLead(
    id: string,
    data: {
        title: string;
        description?: string;
        status?:
        | "NEW"
        | "CONTACTED"
        | "QUALIFIED"
        | "CONVERTED"
        | "LOST";
        source?:
        | "WEBSITE"
        | "LINKEDIN"
        | "INSTAGRAM"
        | "FACEBOOK"
        | "REFERRAL"
        | "EMAIL"
        | "COLD_OUTREACH"
        | "GOOGLE"
        | "OTHER";
        value?: number;
        contactId?: string;
        companyId?: string;
    }
) {
    const existingLead =
        await prisma.lead.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });

    if (!existingLead) {
        throw new Error(
            "LEAD_NOT_FOUND"
        );
    }

    if (data.contactId) {
        const contact =
            await prisma.contact.findUnique({
                where: {
                    id: data.contactId,
                },
                select: {
                    id: true,
                },
            });

        if (!contact) {
            throw new Error(
                "CONTACT_NOT_FOUND"
            );
        }
    }

    if (data.companyId) {
        const company =
            await prisma.company.findUnique({
                where: {
                    id: data.companyId,
                },
                select: {
                    id: true,
                },
            });

        if (!company) {
            throw new Error(
                "COMPANY_NOT_FOUND"
            );
        }
    }

    return prisma.lead.update({
        where: {
            id,
        },

        data: {
            title: data.title,
            description:
                data.description || null,
            status:
                data.status ?? "NEW",
            source:
                data.source ?? null,
            value:
                data.value ?? null,
            contactId:
                data.contactId || null,
            companyId:
                data.companyId || null,
        },

        include: {
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

            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
}

export async function deleteCRMLead(id: string) {
    const lead = await prisma.lead.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
        },
    });

    if (!lead) {
        throw new Error("LEAD_NOT_FOUND");
    }

    return prisma.lead.delete({
        where: {
            id,
        },
    });
}

interface GetCRMDealsParams {
    search?: string;
    pipelineId?: string;
    stageId?: string;
    companyId?: string;
    contactId?: string;
    leadId?: string;
    ownerId?: string;
    minValue?: number;
    maxValue?: number;
}

export async function getCRMDeals(params: GetCRMDealsParams = {}) {
    const {
        search,
        pipelineId,
        stageId,
        companyId,
        contactId,
        leadId,
        ownerId,
        minValue,
        maxValue,
    } = params;

    return prisma.deal.findMany({
        where: {
            ...(search && {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }),
            ...(pipelineId && { pipelineId }),
            ...(stageId && { stageId }),
            ...(companyId && { companyId }),
            ...(contactId && { contactId }),
            ...(leadId && { leadId }),
            ...(ownerId && { ownerId }),
            ...((minValue !== undefined || maxValue !== undefined) && {
                value: {
                    ...(minValue !== undefined && { gte: minValue }),
                    ...(maxValue !== undefined && { lte: maxValue }),
                },
            }),
        },
        include: {
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
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            pipeline: {
                select: {
                    id: true,
                    name: true,
                },
            },
            stage: {
                select: {
                    id: true,
                    name: true,
                    color: true,
                },
            },
            lead: {
                select: {
                    id: true,
                    title: true,
                },
            },
            _count: {
                select: {
                    activities: true,
                    notes: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function getCRMPipelinesForFilter() {
    return prisma.pipeline.findMany({
        select: {
            id: true,
            name: true,
            stages: {
                select: {
                    id: true,
                    name: true,
                    color: true,
                },
                orderBy: { order: "asc" },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

export async function getCRMDeal(id: string) {
    return prisma.deal.findUnique({
        where: { id },
        include: {
            contact: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    jobTitle: true,
                    phone: true,
                },
            },
            company: {
                select: {
                    id: true,
                    name: true,
                    industry: true,
                    website: true,
                    phone: true,
                    email: true,
                },
            },
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            lead: {
                select: {
                    id: true,
                    title: true,
                },
            },
            pipeline: {
                select: {
                    id: true,
                    name: true,
                },
            },
            stage: {
                select: {
                    id: true,
                    name: true,
                    color: true,
                },
            },
            activities: true,
            notes: true,
        },
    });
}