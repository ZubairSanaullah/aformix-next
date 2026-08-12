"use client";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    WorkspaceFilterBar,
    WorkspaceInput,
    WorkspaceSelect,
} from "@/components/workspace/ui";

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

interface NoteFiltersProps {
    companies: NoteFilterCompany[];
    contacts: NoteFilterContact[];
    leads: NoteFilterLead[];
    deals: NoteFilterDeal[];
}

export default function NoteFilters({
    companies,
    contacts,
    leads,
    deals,
}: NoteFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search = searchParams.get("search") ?? "";
    const companyId = searchParams.get("companyId") ?? "";
    const contactId = searchParams.get("contactId") ?? "";
    const leadId = searchParams.get("leadId") ?? "";
    const dealId = searchParams.get("dealId") ?? "";

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(`/workspace/crm/notes?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push("/workspace/crm/notes");
    };

    const hasFilters = Boolean(
        search || companyId || contactId || leadId || dealId
    );

    return (
        <WorkspaceFilterBar
            onClear={hasFilters ? clearFilters : undefined}
        >
            {/* Search */}

            <WorkspaceInput
                value={search}
                onChange={(event) =>
                    updateFilter("search", event.target.value)
                }
                placeholder="Search notes..."
                aria-label="Search notes"
            />

            {/* Company */}

            <WorkspaceSelect
                value={companyId}
                onChange={(event) =>
                    updateFilter("companyId", event.target.value)
                }
                aria-label="Filter notes by company"
            >
                <option value="">All companies</option>
                {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                        {company.name}
                    </option>
                ))}
            </WorkspaceSelect>

            {/* Contact */}

            <WorkspaceSelect
                value={contactId}
                onChange={(event) =>
                    updateFilter("contactId", event.target.value)
                }
                aria-label="Filter notes by contact"
            >
                <option value="">All contacts</option>
                {contacts.map((contact) => {
                    const name = [
                        contact.firstName,
                        contact.lastName,
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <option key={contact.id} value={contact.id}>
                            {name ||
                                contact.email ||
                                "Unnamed Contact"}
                        </option>
                    );
                })}
            </WorkspaceSelect>

            {/* Lead */}

            <WorkspaceSelect
                value={leadId}
                onChange={(event) =>
                    updateFilter("leadId", event.target.value)
                }
                aria-label="Filter notes by lead"
            >
                <option value="">All leads</option>
                {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                        {lead.title}
                    </option>
                ))}
            </WorkspaceSelect>

            {/* Deal */}

            <WorkspaceSelect
                value={dealId}
                onChange={(event) =>
                    updateFilter("dealId", event.target.value)
                }
                aria-label="Filter notes by deal"
            >
                <option value="">All deals</option>
                {deals.map((deal) => (
                    <option key={deal.id} value={deal.id}>
                        {deal.title}
                    </option>
                ))}
            </WorkspaceSelect>
        </WorkspaceFilterBar>
    );
}