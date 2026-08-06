"use client";

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
        <div className="flex flex-col gap-2 rounded-lg border bg-card px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">

            <div className="text-muted-foreground">
                {status === "saving" &&
                    "Saving..."}

                {status === "saved" &&
                    `✓ Saved ${timeAgo ?? ""}`}

                {status === "error" &&
                    "Autosave failed"}

                {status === "idle" &&
                    "No changes"}
            </div>


            <div className="flex gap-4 text-xs text-muted-foreground">
                {wordCount !== undefined && (
                    <span>
                        {wordCount} words
                    </span>
                )}

                {readingTime !== undefined && (
                    <span>
                        {readingTime} min read
                    </span>
                )}
            </div>

        </div>
    );
}