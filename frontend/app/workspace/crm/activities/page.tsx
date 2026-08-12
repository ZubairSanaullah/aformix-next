import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import ActivitiesPageClient from "@/components/workspace/crm/activities/ActivitiesPageClient";

import { getActivities } from "@/lib/services/activity";
import { getDeals } from "@/lib/services/deal";
import {
    getCRMCompaniesForFilter,
    getCRMContacts,
    getCRMLeads,
} from "@/lib/services/crm";

interface ActivitiesPageProps {
    searchParams: Promise<{
        search?: string;
        type?: string;
        completed?: string;
        companyId?: string;
        contactId?: string;
        leadId?: string;
        dealId?: string;
        ownerId?: string;
    }>;
}

export default async function ActivitiesPage({
    searchParams,
}: ActivitiesPageProps) {
    const params = await searchParams;

    const search = params.search ?? "";
    const type = params.type ?? "";
    const completed = params.completed ?? "";
    const companyId = params.companyId ?? "";
    const contactId = params.contactId ?? "";
    const leadId = params.leadId ?? "";
    const dealId = params.dealId ?? "";
    const ownerId = params.ownerId ?? "";

    const [activities, companies, contacts, leads, deals] =
        await Promise.all([
            getActivities({
                search: search || undefined,
                type: type || undefined,
                companyId: companyId || undefined,
                contactId: contactId || undefined,
                leadId: leadId || undefined,
                dealId: dealId || undefined,
                userId: ownerId || undefined,
                completed:
                    completed === "true"
                        ? true
                        : completed === "false"
                            ? false
                            : undefined,
            }),

            getCRMCompaniesForFilter(),
            getCRMContacts(),
            getCRMLeads(),
            getDeals(),
        ]);

    // Serialize dates so they can be passed to Client Components
    const serializedActivities = activities.map((activity) => ({
        ...activity,
        dueAt: activity.dueAt
            ? activity.dueAt.toISOString()
            : null,
        completedAt: activity.completedAt
            ? activity.completedAt.toISOString()
            : null,
        createdAt: activity.createdAt.toISOString(),
    }));

    const dealsForFilter = deals.map((deal) => ({
        id: deal.id,
        title: deal.title,
    }));

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    { label: "CRM", href: "/workspace/crm" },
                    { label: "Activities" },
                ]}
            />

            <WorkspacePageHeader
                title="Activities"
                description="Track calls, emails, meetings, and follow-ups across your CRM."
            />

            <ActivitiesPageClient
                activities={serializedActivities as any}
                companies={companies}
                contacts={contacts}
                leads={leads}
                deals={dealsForFilter}
            />
        </div>
    );
}