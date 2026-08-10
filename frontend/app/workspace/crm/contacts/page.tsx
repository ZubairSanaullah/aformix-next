import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import ContactsPageClient from "@/components/workspace/crm/contacts/ContactsPageClient";

import {
    getCRMCompaniesForFilter,
    getCRMContacts,
} from "@/lib/services/crm";

interface ContactsPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        companyId?: string;
    }>;
}

export default async function ContactsPage({
    searchParams,
}: ContactsPageProps) {
    const params = await searchParams;

    const search = params.search ?? "";

    const status =
        params.status as
        | "ACTIVE"
        | "INACTIVE"
        | "ARCHIVED"
        | "";

    const companyId = params.companyId ?? "";

    const filters = {
        search,
        status: status || undefined,
        companyId: companyId || undefined,
    };

    const [contacts, companies] = await Promise.all([
        getCRMContacts(filters),
        getCRMCompaniesForFilter(),
    ]);

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    {
                        label: "CRM",
                        href: "/workspace/crm",
                    },
                    {
                        label: "Contacts",
                    },
                ]}
            />

            <WorkspacePageHeader
                title="Contacts"
                description="Manage your contacts and customer relationships."
            />

            <ContactsPageClient
                contacts={contacts}
                companies={companies}
                search={search}
                status={status}
                companyId={companyId}
            />
        </div>
    );
}