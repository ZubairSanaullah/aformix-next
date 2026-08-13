"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

interface KnowledgeDashboardErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function KnowledgeDashboardError({
    error,
    reset,
}: KnowledgeDashboardErrorProps) {
    useEffect(() => {
        console.error("[KNOWLEDGE_DASHBOARD_ERROR]", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <TriangleAlert className="h-5 w-5" />
            </span>

            <h2 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                Something went wrong
            </h2>

            <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                We couldn&apos;t load the Knowledge Base dashboard. Please
                try again, and contact support if the problem persists.
            </p>

            <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-[var(--workspace-primary)] px-4 text-xs font-medium text-white transition-colors hover:bg-[var(--workspace-primary-hover)]"
            >
                Try again
            </button>
        </div>
    );
}
