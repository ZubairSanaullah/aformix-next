interface SEOSearchResultPreviewProps {
    title: string;
    description: string;
    url: string;
}

const TITLE_DISPLAY_LIMIT = 60;
const DESCRIPTION_DISPLAY_LIMIT = 160;

function truncate(value: string, limit: number): string {
    if (value.length <= limit) {
        return value;
    }

    return `${value.slice(0, limit - 1).trimEnd()}…`;
}

export default function SEOSearchResultPreview({
    title,
    description,
    url,
}: SEOSearchResultPreviewProps) {
    const displayTitle = title.trim() || "Untitled page";
    const displayDescription =
        description.trim() || "No description provided yet.";

    return (
        <div className="rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-4">
            <p className="truncate text-xs text-[var(--workspace-text-muted)]">
                {url}
            </p>
            <p className="mt-1 truncate text-base text-[var(--workspace-info)]">
                {truncate(displayTitle, TITLE_DISPLAY_LIMIT)}
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--workspace-text-muted)]">
                {truncate(displayDescription, DESCRIPTION_DISPLAY_LIMIT)}
            </p>
        </div>
    );
}
