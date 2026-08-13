import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import NotesPageClient from "@/components/workspace/crm/notes/NotesPageClient";

import { getNotes } from "@/lib/services/note";
import { getDeals } from "@/lib/services/deal";
import {
    getCRMCompaniesForFilter,
    getCRMContacts,
    getCRMLeads,
} from "@/lib/services/crm";

interface NotesPageProps {
    searchParams: Promise<{
        search?: string;
        companyId?: string;
        contactId?: string;
        leadId?: string;
        dealId?: string;
        ownerId?: string;
    }>;
}

export default async function NotesPage({
    searchParams,
}: NotesPageProps) {
    const params = await searchParams;

    const search = params.search ?? "";
    const companyId = params.companyId ?? "";
    const contactId = params.contactId ?? "";
    const leadId = params.leadId ?? "";
    const dealId = params.dealId ?? "";
    const ownerId = params.ownerId ?? "";

    const [notes, companies, contacts, leads, deals] =
        await Promise.all([
            getNotes({
                search: search || undefined,
                companyId: companyId || undefined,
                contactId: contactId || undefined,
                leadId: leadId || undefined,
                dealId: dealId || undefined,
                userId: ownerId || undefined,
            }),

            getCRMCompaniesForFilter(),
            getCRMContacts(),
            getCRMLeads(),
            getDeals(),
        ]);

    const serializedNotes = notes.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
    }));

    const dealsForFilter = deals.map((deal) => ({
        id: deal.id,
        title: deal.title,
    }));

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    { label: "CRM", href: "/workspace/crm" },
                    { label: "Notes" },
                ]}
            />

            <WorkspacePageHeader
                title="Notes"
                description="Freeform notes attached to contacts, companies, leads, and deals."
            />

            <NotesPageClient
                notes={serializedNotes as any}
                companies={companies}
                contacts={contacts}
                leads={leads}
                deals={dealsForFilter}
            />
        </div>
    );
}
