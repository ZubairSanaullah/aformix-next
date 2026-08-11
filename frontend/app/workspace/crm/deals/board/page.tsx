import Link from "next/link";
import { LayoutList } from "lucide-react";

import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
    WorkspacePageActions,
    WorkspaceEmptyState,
} from "@/components/workspace/ui";

import DealKanbanBoard from "@/components/workspace/crm/deals/DealKanbanBoard";

import {
    getCRMDeals,
    getCRMPipelinesForFilter,
} from "@/lib/services/crm";

interface DealBoardPageProps {
    searchParams: Promise<{
        pipelineId?: string;
    }>;
}

export default async function DealBoardPage({
    searchParams,
}: DealBoardPageProps) {
    const params = await searchParams;

    const pipelines = await getCRMPipelinesForFilter();

    if (!pipelines.length) {
        return (
            <div className="space-y-6">
                <WorkspaceBreadcrumbs
                    items={[
                        { label: "CRM", href: "/workspace/crm" },
                        { label: "Deals", href: "/workspace/crm/deals" },
                        { label: "Board" },
                    ]}
                />

                <WorkspacePageHeader
                    title="Deal Board"
                    description="Visualize deals as they move through your sales pipeline."
                />

                <WorkspaceEmptyState
                    title="No pipelines found"
                    description="Create a pipeline and stages before using the deal board."
                />
            </div>
        );
    }

    const activePipeline =
        pipelines.find(
            (pipeline) => pipeline.id === params.pipelineId
        ) ?? pipelines[0];

    const deals = await getCRMDeals({
        pipelineId: activePipeline.id,
    });

    // Serialize Decimal fields and trim to the fields the board needs
    const kanbanDeals = deals.map((deal) => ({
        id: deal.id,
        title: deal.title,
        value:
            deal.value !== null && deal.value !== undefined
                ? Number(deal.value)
                : null,
        stageId: deal.stageId,
        contact: deal.contact
            ? {
                firstName: deal.contact.firstName,
                lastName: deal.contact.lastName,
            }
            : null,
        company: deal.company
            ? { name: deal.company.name }
            : null,
    }));

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    { label: "CRM", href: "/workspace/crm" },
                    { label: "Deals", href: "/workspace/crm/deals" },
                    { label: "Board" },
                ]}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <WorkspacePageHeader
                    title="Deal Board"
                    description="Drag deals between stages to update their pipeline position."
                />

                <WorkspacePageActions>
                    <Link
                        href="/workspace/crm/deals"
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2 text-xs font-medium text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                    >
                        <LayoutList className="h-3.5 w-3.5" />
                        List view
                    </Link>
                </WorkspacePageActions>
            </div>

            {/* Pipeline selector */}
            {pipelines.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    {pipelines.map((pipeline) => (
                        <Link
                            key={pipeline.id}
                            href={`/workspace/crm/deals/board?pipelineId=${pipeline.id}`}
                            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${pipeline.id === activePipeline.id
                                    ? "bg-[var(--workspace-primary)] text-white"
                                    : "border border-[var(--workspace-border)] bg-[var(--workspace-surface)] text-[var(--workspace-text-muted)] hover:bg-[var(--workspace-background)]"
                                }`}
                        >
                            {pipeline.name}
                        </Link>
                    ))}
                </div>
            )}

            {activePipeline.stages.length === 0 ? (
                <WorkspaceEmptyState
                    title="No stages in this pipeline"
                    description="Add stages to this pipeline before using the board."
                />
            ) : (
                <DealKanbanBoard
                    stages={activePipeline.stages.map((stage: any, index: number) => ({
                        id: stage.id,
                        name: stage.name,
                        color: stage.color ?? null,
                        order: index,
                    }))}
                    deals={kanbanDeals}
                />
            )}
        </div>
    );
}