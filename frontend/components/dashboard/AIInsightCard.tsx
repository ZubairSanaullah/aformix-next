import { Sparkles } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

interface AIInsightCardProps {
    title: string;
    description: string;
    insights: string[];
}

export default function AIInsightCard({
    title,
    description,
    insights,
}: AIInsightCardProps) {
    return (
        <WorkspaceCard
            padding="lg"
            className="relative overflow-hidden"
        >
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--workspace-primary)]/5 blur-2xl" />

            <div className="relative flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)]">
                    <Sparkles className="h-4 w-4 text-[var(--workspace-primary)]" />
                </div>

                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                        {title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[var(--workspace-text-muted)]">
                        {description}
                    </p>
                </div>
            </div>

            <ul className="relative mt-5 space-y-3">
                {insights.map((insight) => (
                    <li
                        key={insight}
                        className="flex items-start gap-2.5 text-xs leading-5 text-[var(--workspace-text)]"
                    >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--workspace-primary)]" />

                        <span>{insight}</span>
                    </li>
                ))}
            </ul>
        </WorkspaceCard>
    );
}