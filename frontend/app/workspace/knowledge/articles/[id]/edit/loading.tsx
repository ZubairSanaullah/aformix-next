export default function EditKnowledgeArticleLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-[var(--workspace-border)]" />
                <div className="h-5 w-40 animate-pulse rounded bg-[var(--workspace-border)]" />
                <div className="h-3 w-64 animate-pulse rounded bg-[var(--workspace-border)]" />
            </div>

            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="h-40 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]"
                />
            ))}

            <div className="h-72 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]" />
        </div>
    );
}
