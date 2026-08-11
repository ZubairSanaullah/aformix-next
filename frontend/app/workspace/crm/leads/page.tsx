import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import LeadsPageClient from "@/components/workspace/crm/leads/LeadsPageClient";

import {
    getCRMLeads,
    getCRMCompaniesForFilter,
    getCRMContacts,
} from "@/lib/services/crm";

interface LeadsPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        source?: string;
        companyId?: string;
        contactId?: string;
        ownerId?: string;
    }>;
}

export default async function LeadsPage({
    searchParams,
}: LeadsPageProps) {
    const params = await searchParams;

    const search = params.search ?? "";
    const status = params.status ?? "";
    const source = params.source ?? "";
    const companyId = params.companyId ?? "";
    const contactId = params.contactId ?? "";
    const ownerId = params.ownerId ?? "";

    const [
        leads,
        companies,
        contacts,
    ] = await Promise.all([
        getCRMLeads({
            search: search || undefined,
            status: status || undefined,
            source: source || undefined,
            companyId:
                companyId || undefined,
            contactId:
                contactId || undefined,
            ownerId:
                ownerId || undefined,
        }),

        getCRMCompaniesForFilter(),

        getCRMContacts(),
    ]);

    // Serialize Decimal fields so they can be passed to Client Components
    const serializedLeads = leads.map((lead) => ({
        ...lead,
        value: lead.value !== null && lead.value !== undefined
            ? Number(lead.value)
            : null,
    }));


    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    {
                        label: "CRM",
                        href: "/workspace/crm",
                    },
                    {
                        label: "Leads",
                    },
                ]}
            />

            <WorkspacePageHeader
                title="Leads"
                description="Manage and track your sales leads and opportunities."
            />

            <LeadsPageClient
                leads={serializedLeads}
                companies={companies}
                contacts={contacts}
            />
        </div>
    );
}