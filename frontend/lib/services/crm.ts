import { getContacts } from "@/lib/services/contacts";

interface CRMContactFilters {
    search?: string;
    status?: string;
    companyId?: string;
}

export async function getCRMContacts(
    filters: CRMContactFilters = {}
) {
    return getContacts(filters);
}

export async function getCRMCompaniesForFilter() {
    const { prisma } = await import("@/lib/prisma");
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