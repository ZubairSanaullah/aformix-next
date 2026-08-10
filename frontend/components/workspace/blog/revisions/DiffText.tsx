"use client";

import { diffWords } from "diff";

interface DiffTextProps {
    oldText: string;
    newText: string;
}

export default function DiffText({
    oldText,
    newText,
}: DiffTextProps) {

    const changes = diffWords(
        oldText || "",
        newText || ""
    );

    const hasChanges = changes.some(
        (part) => part.added || part.removed
    );

    if (!hasChanges) {
        return (
            <p className="text-sm italic text-[var(--workspace-text-subtle)]">
                No changes
            </p>
        );
    }

    return (
        <div className="leading-7 whitespace-pre-wrap text-sm text-[var(--workspace-text)]">
            {changes.map((part, index) => (
                <span
                    key={index}
                    className={
                        part.added
                            ? "rounded px-1 text-[var(--workspace-success)]"
                            : part.removed
                                ? "rounded px-1 text-[var(--workspace-danger)] line-through"
                                : ""
                    }
                    style={
                        part.added
                            ? { backgroundColor: "var(--workspace-success-soft, rgba(34,197,94,0.1))" }
                            : part.removed
                                ? { backgroundColor: "var(--workspace-danger-soft, rgba(239,68,68,0.1))" }
                                : undefined
                    }
                >
                    {part.value}
                </span>
            ))}
        </div>
    );
}