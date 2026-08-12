"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
    WorkspaceButton,
    WorkspacePageActions,
} from "@/components/workspace/ui";

import NoteFilters from "@/components/workspace/crm/notes/NoteFilters";
import NoteList, {
    type CRMNote,
} from "@/components/workspace/crm/notes/NoteList";
import NoteForm from "@/components/workspace/crm/notes/NoteForm";

interface NoteFilterCompany {
    id: string;
    name: string;
}

interface NoteFilterContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface NoteFilterLead {
    id: string;
    title: string;
}

interface NoteFilterDeal {
    id: string;
    title: string;
}

interface NotesPageClientProps {
    notes: CRMNote[];
    companies: NoteFilterCompany[];
    contacts: NoteFilterContact[];
    leads: NoteFilterLead[];
    deals: NoteFilterDeal[];
}

export default function NotesPageClient({
    notes,
    companies,
    contacts,
    leads,
    deals,
}: NotesPageClientProps) {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <>
            <div className="flex items-center justify-end">
                <WorkspacePageActions>
                    <WorkspaceButton
                        type="button"
                        onClick={() => setIsAdding(true)}
                        disabled={isAdding}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Note
                    </WorkspaceButton>
                </WorkspacePageActions>
            </div>

            {isAdding && (
                <NoteForm
                    companies={companies}
                    contacts={contacts}
                    leads={leads}
                    deals={deals}
                    onCancel={() => setIsAdding(false)}
                />
            )}

            {!isAdding && (
                <>
                    <NoteFilters
                        companies={companies}
                        contacts={contacts}
                        leads={leads}
                        deals={deals}
                    />

                    <NoteList notes={notes} />
                </>
            )}
        </>
    );
}