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

interface ActivityFilterCompany {
    id: string;
    name: string;
}

interface ActivityFilterContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface ActivityFilterLead {
    id: string;
    title: string;
}

interface ActivityFilterDeal {
    id: string;
    title: string;
}

interface ActivityFiltersProps {
    companies: ActivityFilterCompany[];
    contacts: ActivityFilterContact[];
    leads: ActivityFilterLead[];
    deals: ActivityFilterDeal[];
}

export default function ActivityFilters({
    companies,
    contacts,
    leads,
    deals,
}: ActivityFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search = searchParams.get("search") ?? "";
    const type = searchParams.get("type") ?? "";
    const completed = searchParams.get("completed") ?? "";
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

        router.push(`/workspace/crm/activities?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push("/workspace/crm/activities");
    };

    const hasFilters = Boolean(
        search ||
        type ||
        completed ||
        companyId ||
        contactId ||
        leadId ||
        dealId
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
                placeholder="Search activities..."
                aria-label="Search activities"
            />

            {/* Type */}

            <WorkspaceSelect
                value={type}
                onChange={(event) =>
                    updateFilter("type", event.target.value)
                }
                aria-label="Filter activities by type"
            >
                <option value="">All types</option>
                <option value="CALL">Call</option>
                <option value="EMAIL">Email</option>
                <option value="MEETING">Meeting</option>
                <option value="FOLLOW_UP">Follow-up</option>
                <option value="NOTE">Note</option>
                <option value="OTHER">Other</option>
            </WorkspaceSelect>

            {/* Status */}

            <WorkspaceSelect
                value={completed}
                onChange={(event) =>
                    updateFilter("completed", event.target.value)
                }
                aria-label="Filter activities by completion status"
            >
                <option value="">All statuses</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
            </WorkspaceSelect>

            {/* Company */}

            <WorkspaceSelect
                value={companyId}
                onChange={(event) =>
                    updateFilter("companyId", event.target.value)
                }
                aria-label="Filter activities by company"
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
                aria-label="Filter activities by contact"
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
                aria-label="Filter activities by lead"
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
                aria-label="Filter activities by deal"
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