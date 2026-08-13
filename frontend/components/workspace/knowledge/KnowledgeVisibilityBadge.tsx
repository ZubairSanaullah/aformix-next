import type { KnowledgeArticleVisibility } from "./types";

const VISIBILITY_STYLES: Record<KnowledgeArticleVisibility, string> = {
    INTERNAL: "border-slate-200 bg-slate-50 text-slate-700",
    PUBLIC: "border-sky-200 bg-sky-50 text-sky-700",
};

const VISIBILITY_LABELS: Record<KnowledgeArticleVisibility, string> = {
    INTERNAL: "Internal",
    PUBLIC: "Public",
};

interface KnowledgeVisibilityBadgeProps {
    visibility: KnowledgeArticleVisibility;
}

export default function KnowledgeVisibilityBadge({
    visibility,
}: KnowledgeVisibilityBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-medium ${VISIBILITY_STYLES[visibility]}`}
        >
            {VISIBILITY_LABELS[visibility]}
        </span>
    );
}
