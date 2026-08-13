import { Archive, BookOpenCheck, FileText, FolderKanban } from "lucide-react";

import { WorkspaceCard } from "@/components/workspace/ui";

import type { KnowledgeBaseStats } from "./types";

interface KnowledgeStatsCardsProps {
    stats: KnowledgeBaseStats;
}

export default function KnowledgeStatsCards({
    stats,
}: KnowledgeStatsCardsProps) {
    const cards = [
        {
            label: "Total Articles",
            value: stats.totalArticles,
            icon: FileText,
        },
        {
            label: "Drafts",
            value: stats.draftArticles,
            icon: FolderKanban,
        },
        {
            label: "Published",
            value: stats.publishedArticles,
            icon: BookOpenCheck,
        },
        {
            label: "Archived",
            value: stats.archivedArticles,
            icon: Archive,
        },
    ] as const;

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <WorkspaceCard key={card.label} padding="lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                                    {card.label}
                                </p>

                                <p className="mt-1.5 text-2xl font-semibold text-[var(--workspace-text)]">
                                    {card.value.toLocaleString()}
                                </p>
                            </div>

                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                <Icon className="h-4 w-4" />
                            </span>
                        </div>
                    </WorkspaceCard>
                );
            })}
        </div>
    );
}
