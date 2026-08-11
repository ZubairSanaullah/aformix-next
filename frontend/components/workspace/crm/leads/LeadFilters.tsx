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

interface LeadFilterCompany {
    id: string;
    name: string;
}

interface LeadFilterContact {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
}

interface LeadFiltersProps {
    companies: LeadFilterCompany[];
    contacts: LeadFilterContact[];
}

export default function LeadFilters({
    companies,
    contacts,
}: LeadFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search =
        searchParams.get("search") ?? "";

    const status =
        searchParams.get("status") ?? "";

    const source =
        searchParams.get("source") ?? "";

    const companyId =
        searchParams.get("companyId") ?? "";

    const contactId =
        searchParams.get("contactId") ?? "";

    const updateFilter = (
        key: string,
        value: string
    ) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(
            `/workspace/crm/leads?${params.toString()}`
        );
    };

    const clearFilters = () => {
        router.push(
            "/workspace/crm/leads"
        );
    };

    const hasFilters = Boolean(
        search ||
        status ||
        source ||
        companyId ||
        contactId
    );

    return (
        <WorkspaceFilterBar
            onClear={
                hasFilters
                    ? clearFilters
                    : undefined
            }
        >
            {/* Search */}

            <WorkspaceInput
                value={search}
                onChange={(event) =>
                    updateFilter(
                        "search",
                        event.target.value
                    )
                }
                placeholder="Search leads..."
                aria-label="Search leads"
            />

            {/* Status */}

            <WorkspaceSelect
                value={status}
                onChange={(event) =>
                    updateFilter(
                        "status",
                        event.target.value
                    )
                }
                aria-label="Filter leads by status"
            >
                <option value="">
                    All statuses
                </option>

                <option value="NEW">
                    New
                </option>

                <option value="CONTACTED">
                    Contacted
                </option>

                <option value="QUALIFIED">
                    Qualified
                </option>

                <option value="CONVERTED">
                    Converted
                </option>

                <option value="LOST">
                    Lost
                </option>
            </WorkspaceSelect>

            {/* Source */}

            <WorkspaceSelect
                value={source}
                onChange={(event) =>
                    updateFilter(
                        "source",
                        event.target.value
                    )
                }
                aria-label="Filter leads by source"
            >
                <option value="">
                    All sources
                </option>

                <option value="WEBSITE">
                    Website
                </option>

                <option value="LINKEDIN">
                    LinkedIn
                </option>

                <option value="INSTAGRAM">
                    Instagram
                </option>

                <option value="FACEBOOK">
                    Facebook
                </option>

                <option value="REFERRAL">
                    Referral
                </option>

                <option value="EMAIL">
                    Email
                </option>

                <option value="COLD_OUTREACH">
                    Cold Outreach
                </option>

                <option value="GOOGLE">
                    Google
                </option>

                <option value="OTHER">
                    Other
                </option>
            </WorkspaceSelect>

            {/* Company */}

            <WorkspaceSelect
                value={companyId}
                onChange={(event) =>
                    updateFilter(
                        "companyId",
                        event.target.value
                    )
                }
                aria-label="Filter leads by company"
            >
                <option value="">
                    All companies
                </option>

                {companies.map((company) => (
                    <option
                        key={company.id}
                        value={company.id}
                    >
                        {company.name}
                    </option>
                ))}
            </WorkspaceSelect>

            {/* Contact */}

            <WorkspaceSelect
                value={contactId}
                onChange={(event) =>
                    updateFilter(
                        "contactId",
                        event.target.value
                    )
                }
                aria-label="Filter leads by contact"
            >
                <option value="">
                    All contacts
                </option>

                {contacts.map((contact) => {
                    const name = [
                        contact.firstName,
                        contact.lastName,
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <option
                            key={contact.id}
                            value={contact.id}
                        >
                            {name ||
                                contact.email ||
                                "Unnamed Contact"}
                        </option>
                    );
                })}
            </WorkspaceSelect>
        </WorkspaceFilterBar>
    );
}