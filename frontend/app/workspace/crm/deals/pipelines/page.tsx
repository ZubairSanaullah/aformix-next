import {
    WorkspaceBreadcrumbs,
    WorkspacePageHeader,
} from "@/components/workspace/ui";

import PipelineManager from "@/components/workspace/crm/deals/PipelineManager";

import { getPipelines } from "@/lib/services/deal";

export default async function PipelinesPage() {
    const pipelines = await getPipelines();

    return (
        <div className="space-y-6">
            <WorkspaceBreadcrumbs
                items={[
                    { label: "CRM", href: "/workspace/crm" },
                    { label: "Deals", href: "/workspace/crm/deals" },
                    { label: "Pipelines" },
                ]}
            />

            <WorkspacePageHeader
                title="Pipeline Settings"
                description="Manage your sales pipelines and their stages."
            />

            <PipelineManager initialPipelines={pipelines} />
        </div>
    );
}