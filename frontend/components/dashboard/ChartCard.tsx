import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

interface ChartCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export default function ChartCard({
    title,
    description,
    children,
}: ChartCardProps) {
    return (
        <WorkspaceCard
            padding="lg"
            className="overflow-hidden"
        >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold tracking-tight text-[var(--workspace-text)]">
                        {title}
                    </h3>

                    {description && (
                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6">
                {children}
            </div>
        </WorkspaceCard>
    );
}