export default function KnowledgeCategoriesLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-[var(--workspace-border)]" />
                    <div className="h-5 w-32 animate-pulse rounded bg-[var(--workspace-border)]" />
                    <div className="h-3 w-64 animate-pulse rounded bg-[var(--workspace-border)]" />
                </div>

                <div className="h-9 w-36 animate-pulse rounded-lg bg-[var(--workspace-border)]" />
            </div>

            <div className="h-14 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]" />

            <div className="h-96 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]" />
        </div>
    );
}
