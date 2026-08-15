export default function ArticleLoading() {
    return (
        <div className="section-padding mx-auto max-w-3xl px-6">
            <div className="h-3 w-48 animate-pulse rounded bg-[var(--color-border)]" />

            <div className="mt-4 h-8 w-full animate-pulse rounded bg-[var(--color-border)]" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-[var(--color-border)]" />

            <div className="mt-8 space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-4 w-full animate-pulse rounded bg-[var(--color-border)]"
                    />
                ))}
            </div>
        </div>
    );
}
