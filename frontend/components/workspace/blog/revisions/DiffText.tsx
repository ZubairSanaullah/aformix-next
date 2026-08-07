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
            <p className="text-sm italic text-muted-foreground">
                No changes
            </p>
        );
    }

    return (
        <div className="leading-7 whitespace-pre-wrap text-sm">
            {changes.map((part, index) => (
                <span
                    key={index}
                    className={
                        part.added
                            ? "rounded bg-green-100 px-1 text-green-700"
                            : part.removed
                                ? "rounded bg-red-100 px-1 text-red-700 line-through"
                                : ""
                    }
                >
                    {part.value}
                </span>
            ))}
        </div>
    );
}