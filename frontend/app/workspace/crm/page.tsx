import CRMNavigation from "@/components/workspace/crm/CRMNavigation";
import CRMMetricCards from "@/components/workspace/crm/CRMMetricCards";
import CRMPipelineOverview from "@/components/workspace/crm/CRMPipelineOverview";
import CRMRecentActivity from "@/components/workspace/crm/CRMRecentActivity";
import CRMRecentLeads from "@/components/workspace/crm/CRMRecentLeads";
import CRMUpcomingActivities from "@/components/workspace/crm/CRMUpcomingActivities";
import { getCRMOverviewMetrics } from "@/lib/services/crm";

export default async function CRMPage() {
    const metrics = await getCRMOverviewMetrics();
    return (
        <div className="space-y-6">
            <CRMNavigation />

            <header>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium text-[var(--workspace-primary)]">
                            CRM
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--workspace-text)]">
                            Customer relationship management
                        </h1>

                        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--workspace-text-muted)]">
                            Manage contacts, companies, leads, and deals from one
                            centralized workspace.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="
              inline-flex
              h-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-[var(--workspace-primary)]
              px-3.5
              text-xs
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-150
              hover:opacity-90
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--workspace-background)]
            "
                    >
                        Add Contact
                    </button>
                </div>
            </header>

            <CRMMetricCards metrics={metrics} />

            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <CRMPipelineOverview />

                <CRMRecentActivity />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <CRMRecentLeads />
                <CRMUpcomingActivities />
            </div>
        </div>
    );
}