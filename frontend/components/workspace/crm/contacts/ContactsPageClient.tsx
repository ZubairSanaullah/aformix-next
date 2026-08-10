"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
    AddContactInlineForm,
    ContactFilters,
    ContactTable,
} from "@/components/workspace/crm/contacts";

import {
    WorkspaceButton,
} from "@/components/workspace/ui";

interface Company {
    id: string;
    name: string;
}

interface Contact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    jobTitle: string | null;
    status: string;
    company?: {
        id: string;
        name: string;
    } | null;
}

interface ContactsPageClientProps {
    contacts: Contact[];
    companies: Company[];
    search: string;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | "";
    companyId: string;
}

export default function ContactsPageClient({
    contacts,
    companies,
    search,
    status,
    companyId,
}: ContactsPageClientProps) {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <>
            <div className="flex justify-end">
                {!showAddForm && (
                    <WorkspaceButton
                        type="button"
                        onClick={() => setShowAddForm(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Contact
                    </WorkspaceButton>
                )}
            </div>

            {showAddForm && (
                <AddContactInlineForm
                    companies={companies}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            <ContactFilters
                search={search}
                status={status}
                companyId={companyId}
                companies={companies}
            />

            <ContactTable contacts={contacts} />
        </>
    );
}