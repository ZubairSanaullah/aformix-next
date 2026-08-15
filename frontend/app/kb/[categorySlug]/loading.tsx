export default function CategoryLoading() {
    return (
        <div className="section-padding mx-auto max-w-5xl px-6">
            <div className="h-3 w-40 animate-pulse rounded bg-[var(--color-border)]" />

            <div className="mt-6 flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-[var(--color-border)]" />
                <div className="space-y-2">
                    <div className="h-6 w-48 animate-pulse rounded bg-[var(--color-border)]" />
                    <div className="h-4 w-64 animate-pulse rounded bg-[var(--color-border)]" />
                </div>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-40 animate-pulse rounded-2xl border border-[var(--color-border)]"
                    />
                ))}
            </div>
        </div>
    );
}
