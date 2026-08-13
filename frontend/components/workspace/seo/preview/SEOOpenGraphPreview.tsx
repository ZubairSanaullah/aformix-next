interface SEOOpenGraphPreviewProps {
    title: string;
    description: string;
    imageUrl: string;
    domain: string;
}

export default function SEOOpenGraphPreview({
    title,
    description,
    imageUrl,
    domain,
}: SEOOpenGraphPreviewProps) {
    const displayTitle = title.trim() || "Untitled page";
    const displayDescription =
        description.trim() || "No description provided yet.";
    const hasImage = imageUrl.trim().length > 0;

    return (
        <div className="overflow-hidden rounded-lg border border-[var(--workspace-border)]">
            <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-[var(--workspace-background)]">
                {hasImage ? (
                    // Arbitrary user-provided image URL — next/image would
                    // need the domain allow-listed in next.config, which is
                    // out of scope here. A plain <img> with graceful
                    // fallback keeps this working for any URL.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <span className="text-[11px] text-[var(--workspace-text-subtle)]">
                        No OG image set
                    </span>
                )}
            </div>

            <div className="space-y-1 bg-[var(--workspace-surface)] p-3">
                <p className="truncate text-[10px] uppercase tracking-wide text-[var(--workspace-text-subtle)]">
                    {domain}
                </p>
                <p className="truncate text-sm font-semibold text-[var(--workspace-text)]">
                    {displayTitle}
                </p>
                <p className="line-clamp-2 text-xs leading-4 text-[var(--workspace-text-muted)]">
                    {displayDescription}
                </p>
            </div>
        </div>
    );
}
