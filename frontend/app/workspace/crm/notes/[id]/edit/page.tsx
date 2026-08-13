import { notFound } from "next/navigation";

import { WorkspaceBreadcrumbs } from "@/components/workspace/ui";

import { getNoteById } from "@/lib/services/note";
import { getDeals } from "@/lib/services/deal";
import {
    getCRMCompaniesForFilter,
    getCRMContacts,
    getCRMLeads,
} from "@/lib/services/crm";

import NoteEditForm from "@/components/workspace/crm/notes/NoteEditForm";

interface NoteEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function NoteEditPage({
    params,
}: NoteEditPageProps) {
    const { id } = await params;

    const [note, companies, contacts, leads, deals] =
        await Promise.all([
            getNoteById(id),
            getCRMCompaniesForFilter(),
            getCRMContacts(),
            getCRMLeads(),
            getDeals(),
        ]);

    if (!note) {
        notFound();
    }

    const dealsForFilter = deals.map((deal) => ({
        id: deal.id,
        title: deal.title,
    }));

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    { label: "CRM", href: "/workspace/crm" },
                    { label: "Notes", href: "/workspace/crm/notes" },
                    { label: "Edit" },
                ]}
            />

            <div>
                <h1 className="text-xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-2xl">
                    Edit Note
                </h1>

                <p className="mt-1.5 text-sm text-[var(--workspace-text-muted)]">
                    Update the note and its relationships.
                </p>
            </div>

            <NoteEditForm
                note={{
                    id: note.id,
                    content: note.content,
                    contactId: note.contactId,
                    companyId: note.companyId,
                    leadId: note.leadId,
                    dealId: note.dealId,
                }}
                companies={companies}
                contacts={contacts}
                leads={leads}
                deals={dealsForFilter}
            />
        </div>
    );
}
