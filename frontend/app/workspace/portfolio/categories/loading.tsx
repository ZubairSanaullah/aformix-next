export default function PortfolioCategoriesLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="h-7 w-64 animate-pulse rounded-lg bg-[var(--workspace-border)]/60" />
                <div className="h-4 w-96 animate-pulse rounded-lg bg-[var(--workspace-border)]/40" />
            </div>

            <div className="h-11 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]" />

            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-16 animate-pulse rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]"
                    />
                ))}
            </div>
        </div>
    );
}