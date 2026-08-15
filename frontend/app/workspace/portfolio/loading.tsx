export default function PortfolioLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="h-7 w-40 animate-pulse rounded-lg bg-[var(--workspace-border)]/60" />
                <div className="h-4 w-80 animate-pulse rounded-lg bg-[var(--workspace-border)]/40" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-24 animate-pulse rounded-2xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]"
                    />
                ))}
            </div>

            <div className="h-11 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]" />

            <div className="overflow-hidden rounded-xl border border-[var(--workspace-border)]">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-14 animate-pulse border-b border-[var(--workspace-border)] bg-[var(--workspace-surface)] last:border-b-0"
                    />
                ))}
            </div>
        </div>
    );
}