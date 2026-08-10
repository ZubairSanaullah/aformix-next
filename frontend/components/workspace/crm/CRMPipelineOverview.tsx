import {
    WorkspaceCard,
    WorkspaceSectionHeader,
} from "@/components/workspace/ui";

const pipelineStages = [
    {
        name: "New",
        count: 0,
        value: "$0",
    },
    {
        name: "Qualified",
        count: 0,
        value: "$0",
    },
    {
        name: "Proposal",
        count: 0,
        value: "$0",
    },
    {
        name: "Negotiation",
        count: 0,
        value: "$0",
    },
    {
        name: "Won",
        count: 0,
        value: "$0",
    },
];

export default function CRMPipelineOverview() {
    return (
        <WorkspaceCard className="p-5">
            <WorkspaceSectionHeader
                title="Pipeline Overview"
                description="Track deals across your current sales pipeline."
            />

            <div className="mt-5 space-y-4">
                {pipelineStages.map((stage) => (
                    <div key={stage.name}>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-2">
                                <span className="text-xs font-medium text-[var(--workspace-text)]">
                                    {stage.name}
                                </span>

                                <span className="rounded-full bg-[var(--workspace-background)] px-2 py-0.5 text-[10px] font-medium text-[var(--workspace-text-muted)]">
                                    {stage.count}
                                </span>
                            </div>

                            <span className="shrink-0 text-xs font-medium text-[var(--workspace-text-muted)]">
                                {stage.value}
                            </span>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--workspace-background)]">
                            <div
                                className="h-full rounded-full bg-[var(--workspace-primary)]"
                                style={{
                                    width: stage.count > 0 ? "40%" : "0%",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </WorkspaceCard>
    );
}