"use client";

import DiffText from "./DiffText";

interface Props {
    oldContent: string;
    newContent: string;
}

export default function ParagraphDiff({
    oldContent,
    newContent,
}: Props) {

    const oldParagraphs =
        oldContent.split("\n\n");

    const newParagraphs =
        newContent.split("\n\n");

    const total = Math.max(
        oldParagraphs.length,
        newParagraphs.length
    );

    return (
        <div className="space-y-6">

            {Array.from({
                length: total,
            }).map((_, index) => {

                const oldParagraph =
                    oldParagraphs[index] ?? "";

                const newParagraph =
                    newParagraphs[index] ?? "";

                const changed =
                    oldParagraph !== newParagraph;

                return (

                    <div
                        id={`paragraph-${index + 1}`}
                        key={index}
                        className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]"
                    >

                        <div className="border-b border-[var(--workspace-border)] bg-[var(--workspace-background)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--workspace-text-muted)]">

                            Paragraph {index + 1}

                        </div>

                        <div className="grid grid-cols-2">

                            <div className="border-r border-[var(--workspace-border)] p-4">

                                <p className="mb-2 text-xs text-[var(--workspace-text-subtle)]">
                                    Older
                                </p>

                                <div className="whitespace-pre-wrap text-sm text-[var(--workspace-text)]">

                                    {oldParagraph || (
                                        <span className="italic text-[var(--workspace-text-subtle)]">
                                            Empty
                                        </span>
                                    )}

                                </div>

                            </div>

                            <div className="p-4">

                                <p className="mb-2 text-xs text-[var(--workspace-text-subtle)]">
                                    Newer
                                </p>

                                {changed ? (

                                    <DiffText
                                        oldText={oldParagraph}
                                        newText={newParagraph}
                                    />

                                ) : (

                                    <span className="text-sm italic text-[var(--workspace-text-subtle)]">
                                        No changes
                                    </span>

                                )}

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>
    );
}