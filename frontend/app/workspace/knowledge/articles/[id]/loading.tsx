export default function ArticleDetailLoading() {
    return (
        <div className="space-y-6">
            <div className="h-3 w-32 animate-pulse rounded bg-[var(--workspace-border)]" />

            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div className="h-6 w-64 animate-pulse rounded bg-[var(--workspace-border)]" />
                    <div className="h-4 w-40 animate-pulse rounded bg-[var(--workspace-border)]" />
                </div>

                <div className="flex gap-2">
                    <div className="h-9 w-20 animate-pulse rounded-lg bg-[var(--workspace-border)]" />
                    <div className="h-9 w-20 animate-pulse rounded-lg bg-[var(--workspace-border)]" />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="h-96 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] lg:col-span-2" />

                <div className="space-y-6">
                    <div className="h-48 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]" />
                    <div className="h-32 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]" />
                </div>
            </div>
        </div>
    );
}
