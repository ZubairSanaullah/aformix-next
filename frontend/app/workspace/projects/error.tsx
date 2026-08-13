"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

import { WorkspaceButton, WorkspaceCard } from "@/components/workspace/ui";

interface ProjectsErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Catches unexpected failures anywhere under /workspace/projects (data
 * fetching errors, thrown exceptions in Server Components, etc.) so the
 * user gets a recoverable screen instead of the framework's default error
 * page — spec §22 ("Every API failure should have a proper UI response",
 * extended here to page-level failures too).
 *
 * NOTE: AuthorizationError (401/403) is handled separately inline in each
 * page.tsx via try/catch — it is not a thrown, uncaught error, so it never
 * reaches this boundary.
 */
export default function ProjectsError({ error, reset }: ProjectsErrorProps) {
    useEffect(() => {
        console.error("Projects module error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[50vh] items-center justify-center p-4">
            <WorkspaceCard padding="lg" className="max-w-md text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                    Something went wrong
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-[var(--workspace-text-muted)]">
                    We couldn&apos;t load this part of Projects. This has been
                    logged — try again, or head back to the Projects
                    overview.
                </p>

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                    <Link href="/workspace/projects">
                        <WorkspaceButton
                            type="button"
                            variant="secondary"
                            className="w-full"
                        >
                            Back to Projects
                        </WorkspaceButton>
                    </Link>

                    <WorkspaceButton type="button" onClick={reset}>
                        <RotateCw className="h-3.5 w-3.5" />
                        Try again
                    </WorkspaceButton>
                </div>
            </WorkspaceCard>
        </div>
    );
}
