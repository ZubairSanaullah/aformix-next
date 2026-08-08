"use client";

import {
    CheckCircle2,
    Clock3,
    Loader2,
    AlertCircle,
} from "lucide-react";

interface EditorStatusBarProps {
    status:
    | "idle"
    | "saving"
    | "saved"
    | "error";

    timeAgo?: string;

    wordCount?: number;

    readingTime?: number;
}

export default function EditorStatusBar({
    status,
    timeAgo,
    wordCount,
    readingTime,
}: EditorStatusBarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface-soft)] px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px]">
                {status === "saving" && (
                    <>
                        <Loader2 className="h-3 w-3 animate-spin text-[var(--workspace-primary)]" />

                        <span className="text-[var(--workspace-text-muted)]">
                            Saving changes...
                        </span>
                    </>
                )}

                {status === "saved" && (
                    <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />

                        <span className="text-[var(--workspace-text-muted)]">
                            Saved{" "}
                            {timeAgo ?? ""}
                        </span>
                    </>
                )}

                {status === "error" && (
                    <>
                        <AlertCircle className="h-3 w-3 text-red-500" />

                        <span className="text-red-500">
                            Autosave failed
                        </span>
                    </>
                )}

                {status === "idle" && (
                    <>
                        <Clock3 className="h-3 w-3 text-[var(--workspace-text-subtle)]" />

                        <span className="text-[var(--workspace-text-subtle)]">
                            No unsaved changes
                        </span>
                    </>
                )}
            </div>

            {(wordCount !==
                undefined ||
                readingTime !==
                undefined) && (
                    <div className="flex items-center gap-3 text-[10px] text-[var(--workspace-text-subtle)]">
                        {wordCount !==
                            undefined && (
                                <span>
                                    {wordCount} words
                                </span>
                            )}

                        {readingTime !==
                            undefined && (
                                <span>
                                    {readingTime} min read
                                </span>
                            )}
                    </div>
                )}
        </div>
    );
}