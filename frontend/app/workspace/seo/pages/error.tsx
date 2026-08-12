"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

export default function SEOPagesListError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("SEO pages list error:", error);
    }, [error]);

    return (
        <WorkspaceCard
            padding="lg"
            className="flex flex-col items-center gap-4 py-16 text-center"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--workspace-danger)]/10 text-[var(--workspace-danger)]">
                <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="space-y-1">
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Couldn&apos;t load SEO pages
                </h2>
                <p className="max-w-sm text-xs text-[var(--workspace-text-muted)]">
                    Something went wrong while loading your SEO pages.
                    Please try again.
                </p>
            </div>

            <WorkspaceButton size="sm" onClick={() => reset()}>
                Try again
            </WorkspaceButton>
        </WorkspaceCard>
    );
}
