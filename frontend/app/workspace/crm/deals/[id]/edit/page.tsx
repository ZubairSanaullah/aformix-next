import { notFound } from "next/navigation";

import {
    WorkspaceBreadcrumbs,
} from "@/components/workspace/ui";

import {
    getCRMDeal,
    getCRMCompaniesForFilter,
    getCRMContacts,
    getCRMLeads,
    getCRMPipelinesForFilter,
} from "@/lib/services/crm";

import DealEditForm from "@/components/workspace/crm/deals/DealEditForm";

interface DealEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function DealEditPage({
    params,
}: DealEditPageProps) {
    const { id } = await params;

    const [
        deal,
        companies,
        contacts,
        leads,
        pipelines,
    ] = await Promise.all([
        getCRMDeal(id),
        getCRMCompaniesForFilter(),
        getCRMContacts(),
        getCRMLeads(),
        getCRMPipelinesForFilter(),
    ]);

    if (!deal) {
        notFound();
    }

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
                        href: "/workspace/crm/deals",
                    },
                    {
                        label: deal.title,
                        href: `/workspace/crm/deals/${deal.id}`,
                    },
                    {
                        label: "Edit",
                    },
                ]}
            />

            <div>
                <h1 className="text-xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-2xl">
                    Edit Deal
                </h1>

                <p className="mt-1.5 text-sm text-[var(--workspace-text-muted)]">
                    Update deal information,
                    relationships, and pipeline stage.
                </p>
            </div>

            <DealEditForm
                deal={deal}
                companies={companies}
                contacts={contacts}
                leads={leads}
                pipelines={pipelines}
            />
        </div>
    );
}