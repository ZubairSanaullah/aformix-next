// TODO: point these at your actual CRM/Tasks endpoints or Prisma
// queries. Named/shaped to match EventForm's expected props
// ({ id, name }[]). Swap the fetch calls for direct DB reads if
// these pages are server components running inside your app
// (recommended — avoids an extra network hop for an internal call).

export interface RelationshipOption {
    id: string;
    name: string;
}

export async function getContactOptions(): Promise<RelationshipOption[]> {
    // TODO: replace with e.g. `prisma.contact.findMany({ select: { id: true, name: true } })`
    return [];
}

export async function getCompanyOptions(): Promise<RelationshipOption[]> {
    // TODO: replace with e.g. `prisma.company.findMany(...)`
    return [];
}

export async function getLeadOptions(): Promise<RelationshipOption[]> {
    // TODO: replace with e.g. `prisma.lead.findMany(...)`
    return [];
}

export async function getDealOptions(): Promise<RelationshipOption[]> {
    // TODO: replace with e.g. `prisma.deal.findMany(...)`
    return [];
}

export async function getTaskOptions(): Promise<RelationshipOption[]> {
    // TODO: replace with e.g. `prisma.task.findMany({ select: { id: true, title: true } })`
    // Map `title` -> `name` here to match RelationshipOption.
    return [];
}

export async function getAllRelationshipOptions() {
    const [contacts, companies, leads, deals, tasks] = await Promise.all([
        getContactOptions(),
        getCompanyOptions(),
        getLeadOptions(),
        getDealOptions(),
        getTaskOptions(),
    ]);

    return { contacts, companies, leads, deals, tasks };
}
