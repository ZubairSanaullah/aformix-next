export default function EditPortfolioProjectLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="h-7 w-64 animate-pulse rounded-lg bg-[var(--workspace-border)]/60" />
                <div className="h-4 w-80 animate-pulse rounded-lg bg-[var(--workspace-border)]/40" />
            </div>

            <div className="space-y-5">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-48 animate-pulse rounded-2xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]"
                    />
                ))}
            </div>
        </div>
    );
}
