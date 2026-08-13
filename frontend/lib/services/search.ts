import { prisma } from "@/lib/prisma";

export type SearchResultType =
    | "contact"
    | "company"
    | "lead"
    | "deal"
    | "activity"
    | "note";

export interface SearchResult {
    id: string;
    type: SearchResultType;
    title: string;
    subtitle: string | null;
    href: string;
}

interface SearchCRMOptions {
    // Max results per entity type. The quick dropdown uses a small
    // number (e.g. 5); the full results page uses a larger one.
    limitPerType?: number;
}

function contactName(contact: {
    firstName: string;
    lastName: string | null;
}) {
    return [contact.firstName, contact.lastName]
        .filter(Boolean)
        .join(" ");
}

export async function searchCRM(
    query: string,
    options: SearchCRMOptions = {}
): Promise<Record<SearchResultType, SearchResult[]>> {
    const limit = options.limitPerType ?? 5;

    const empty: Record<SearchResultType, SearchResult[]> = {
        contact: [],
        company: [],
        lead: [],
        deal: [],
        activity: [],
        note: [],
    };

    const trimmed = query.trim();

    if (!trimmed) {
        return empty;
    }

    const [contacts, companies, leads, deals, activities, notes] =
        await Promise.all([
            prisma.contact.findMany({
                where: {
                    deletedAt: null,
                    OR: [
                        { firstName: { contains: trimmed, mode: "insensitive" } },
                        { lastName: { contains: trimmed, mode: "insensitive" } },
                        { email: { contains: trimmed, mode: "insensitive" } },
                    ],
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    jobTitle: true,
                },
                take: limit,
            }),

            prisma.company.findMany({
                where: {
                    name: { contains: trimmed, mode: "insensitive" },
                },
                select: {
                    id: true,
                    name: true,
                    industry: true,
                },
                take: limit,
            }),

            prisma.lead.findMany({
                where: {
                    OR: [
                        { title: { contains: trimmed, mode: "insensitive" } },
                        { description: { contains: trimmed, mode: "insensitive" } },
                    ],
                },
                select: {
                    id: true,
                    title: true,
                    status: true,
                },
                take: limit,
            }),

            prisma.deal.findMany({
                where: {
                    OR: [
                        { title: { contains: trimmed, mode: "insensitive" } },
                        { description: { contains: trimmed, mode: "insensitive" } },
                    ],
                },
                select: {
                    id: true,
                    title: true,
                    stage: {
                        select: { name: true },
                    },
                },
                take: limit,
            }),

            prisma.activity.findMany({
                where: {
                    OR: [
                        { title: { contains: trimmed, mode: "insensitive" } },
                        { description: { contains: trimmed, mode: "insensitive" } },
                    ],
                },
                select: {
                    id: true,
                    title: true,
                    type: true,
                },
                take: limit,
            }),

            prisma.note.findMany({
                where: {
                    content: { contains: trimmed, mode: "insensitive" },
                },
                select: {
                    id: true,
                    content: true,
                },
                take: limit,
            }),
        ]);

    return {
        contact: contacts.map((contact) => ({
            id: contact.id,
            type: "contact" as const,
            title: contactName(contact) || contact.email || "Unnamed Contact",
            subtitle: contact.jobTitle || contact.email,
            href: `/workspace/crm/contacts/${contact.id}`,
        })),

        company: companies.map((company) => ({
            id: company.id,
            type: "company" as const,
            title: company.name,
            subtitle: company.industry,
            href: `/workspace/crm/companies/${company.id}`,
        })),

        lead: leads.map((lead) => ({
            id: lead.id,
            type: "lead" as const,
            title: lead.title,
            subtitle: lead.status,
            href: `/workspace/crm/leads/${lead.id}`,
        })),

        deal: deals.map((deal) => ({
            id: deal.id,
            type: "deal" as const,
            title: deal.title,
            subtitle: deal.stage?.name ?? null,
            href: `/workspace/crm/deals/${deal.id}`,
        })),

        activity: activities.map((activity) => ({
            id: activity.id,
            type: "activity" as const,
            title: activity.title,
            subtitle: activity.type,
            href: `/workspace/crm/activities/${activity.id}/edit`,
        })),

        note: notes.map((note) => ({
            id: note.id,
            type: "note" as const,
            title:
                note.content.length > 80
                    ? `${note.content.slice(0, 80)}...`
                    : note.content,
            subtitle: null,
            href: `/workspace/crm/notes/${note.id}/edit`,
        })),
    };
}