"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

interface PortfolioErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function PortfolioError({ error, reset }: PortfolioErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
                <p className="text-sm font-semibold text-[var(--workspace-text)]">
                    Something went wrong.
                </p>
                <p className="mt-1 text-sm text-[var(--workspace-text-muted)]">
                    We couldn&apos;t load the portfolio dashboard.
                </p>
            </div>

            <WorkspaceButton variant="secondary" size="md" onClick={reset}>
                Try again
            </WorkspaceButton>
        </div>
    );
}