export default function KBHomeLoading() {
    return (
        <div className="section-padding mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-xl space-y-4 text-center">
                <div className="mx-auto h-9 w-72 animate-pulse rounded bg-[var(--color-border)]" />
                <div className="mx-auto h-4 w-96 animate-pulse rounded bg-[var(--color-border)]" />
                <div className="h-14 animate-pulse rounded-2xl bg-[var(--color-border)]" />
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
