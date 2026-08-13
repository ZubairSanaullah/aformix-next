"use client";

import { useState } from "react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import { cn } from "@/lib/utils";

import SEOSearchResultPreview from "./SEOSearchResultPreview";
import SEOOpenGraphPreview from "./SEOOpenGraphPreview";

interface SEOMetadataPreviewPanelProps {
    title: string;
    description: string;
    url: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    domain: string;
}

type PreviewTab = "search" | "social";

export default function SEOMetadataPreviewPanel({
    title,
    description,
    url,
    ogTitle,
    ogDescription,
    ogImage,
    domain,
}: SEOMetadataPreviewPanelProps) {
    const [tab, setTab] = useState<PreviewTab>("search");

    // OG title/description fall back to the primary title/description when
    // left blank — matches the behavior described in the form's own
    // placeholder text, so the preview reflects what actually renders.
    const effectiveOgTitle = ogTitle.trim() || title;
    const effectiveOgDescription = ogDescription.trim() || description;

    return (
        <WorkspaceCard padding="lg" className="space-y-4">
            <div>
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Metadata Preview
                </h2>
                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    How this appears in search results and when shared.
                </p>
            </div>

            <div className="inline-flex rounded-lg border border-[var(--workspace-border)] p-0.5">
                <button
                    type="button"
                    onClick={() => setTab("search")}
                    className={cn(
                        "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                        tab === "search"
                            ? "bg-[var(--workspace-primary)] text-white"
                            : "text-[var(--workspace-text-muted)] hover:text-[var(--workspace-text)]"
                    )}
                >
                    Search Result
                </button>

                <button
                    type="button"
                    onClick={() => setTab("social")}
                    className={cn(
                        "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                        tab === "social"
                            ? "bg-[var(--workspace-primary)] text-white"
                            : "text-[var(--workspace-text-muted)] hover:text-[var(--workspace-text)]"
                    )}
                >
                    Social Share
                </button>
            </div>

            {tab === "search" ? (
                <SEOSearchResultPreview
                    title={title}
                    description={description}
                    url={url}
                />
            ) : (
                <SEOOpenGraphPreview
                    title={effectiveOgTitle}
                    description={effectiveOgDescription}
                    imageUrl={ogImage}
                    domain={domain}
                />
            )}
        </WorkspaceCard>
    );
}
