import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import DealsPageClient from "@/components/workspace/crm/deals/DealsPageClient";

import {
    getCRMDeals,
    getCRMCompaniesForFilter,
    getCRMContacts,
    getCRMLeads,
    getCRMPipelinesForFilter,
} from "@/lib/services/crm";

interface DealsPageProps {
    searchParams: Promise<{
        search?: string;
        pipelineId?: string;
        stageId?: string;
        companyId?: string;
        contactId?: string;
        ownerId?: string;
    }>;
}

export default async function DealsPage({
    searchParams,
}: DealsPageProps) {
    const params = await searchParams;

    const search = params.search ?? "";
    const pipelineId = params.pipelineId ?? "";
    const stageId = params.stageId ?? "";
    const companyId = params.companyId ?? "";
    const contactId = params.contactId ?? "";
    const ownerId = params.ownerId ?? "";

    const [
        deals,
        companies,
        contacts,
        leads,
        pipelines,
    ] = await Promise.all([
        getCRMDeals({
            search: search || undefined,
            pipelineId:
                pipelineId || undefined,
            stageId:
                stageId || undefined,
            companyId:
                companyId || undefined,
            contactId:
                contactId || undefined,
            ownerId:
                ownerId || undefined,
        }),

        getCRMCompaniesForFilter(),

        getCRMContacts(),

        getCRMLeads(),

        getCRMPipelinesForFilter(),
    ]);

    // Serialize Decimal fields so they can be passed to Client Components
    const serializedDeals = deals.map((deal) => ({
        ...deal,
        value: deal.value !== null && deal.value !== undefined
            ? Number(deal.value)
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
                        label: "Deals",
                    },
                ]}
            />

            <WorkspacePageHeader
                title="Deals"
                description="Track deals as they move through your sales pipeline."
            />

            <DealsPageClient
                deals={serializedDeals}
                companies={companies}
                contacts={contacts}
                leads={leads}
                pipelines={pipelines}
            />
        </div>
    );
}