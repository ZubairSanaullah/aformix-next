import { notFound } from "next/navigation";

import { WorkspaceBreadcrumbs } from "@/components/workspace/ui";

import { getActivityById } from "@/lib/services/activity";
import { getDeals } from "@/lib/services/deal";
import {
    getCRMCompaniesForFilter,
    getCRMContacts,
    getCRMLeads,
} from "@/lib/services/crm";

import ActivityEditForm from "@/components/workspace/crm/activities/ActivityEditForm";

interface ActivityEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ActivityEditPage({
    params,
}: ActivityEditPageProps) {
    const { id } = await params;

    const [activity, companies, contacts, leads, deals] =
        await Promise.all([
            getActivityById(id),
            getCRMCompaniesForFilter(),
            getCRMContacts(),
            getCRMLeads(),
            getDeals(),
        ]);

    if (!activity) {
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
                    {
                        label: "Activities",
                        href: "/workspace/crm/activities",
                    },
                    { label: "Edit" },
                ]}
            />

            <div>
                <h1 className="text-xl font-semibold tracking-tight text-[var(--workspace-text)] sm:text-2xl">
                    Edit Activity
                </h1>

                <p className="mt-1.5 text-sm text-[var(--workspace-text-muted)]">
                    Update activity details and relationships.
                </p>
            </div>

            <ActivityEditForm
                activity={{
                    id: activity.id,
                    type: activity.type as any,
                    title: activity.title,
                    description: activity.description,
                    dueAt: activity.dueAt
                        ? activity.dueAt.toISOString()
                        : null,
                    completedAt: activity.completedAt
                        ? activity.completedAt.toISOString()
                        : null,
                    contactId: activity.contactId,
                    companyId: activity.companyId,
                    leadId: activity.leadId,
                    dealId: activity.dealId,
                }}
                companies={companies}
                contacts={contacts}
                leads={leads}
                deals={dealsForFilter}
            />
        </div>
    );
}