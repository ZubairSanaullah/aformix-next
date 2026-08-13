import type { KnowledgeArticleStatus } from "./types";

const STATUS_STYLES: Record<KnowledgeArticleStatus, string> = {
    DRAFT: "border-slate-200 bg-slate-50 text-slate-700",
    PUBLISHED: "border-green-200 bg-green-50 text-green-700",
    ARCHIVED: "border-amber-200 bg-amber-50 text-amber-700",
};

const STATUS_LABELS: Record<KnowledgeArticleStatus, string> = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
    ARCHIVED: "Archived",
};

interface KnowledgeStatusBadgeProps {
    status: KnowledgeArticleStatus;
}

export default function KnowledgeStatusBadge({
    status,
}: KnowledgeStatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-medium ${STATUS_STYLES[status]}`}
        >
            {STATUS_LABELS[status]}
        </span>
    );
}
