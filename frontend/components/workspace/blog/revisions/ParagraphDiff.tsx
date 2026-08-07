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
                        className="rounded-xl border"
                    >

                        <div className="border-b bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide">

                            Paragraph {index + 1}

                        </div>

                        <div className="grid grid-cols-2">

                            <div className="border-r p-4">

                                <p className="mb-2 text-xs text-muted-foreground">
                                    Older
                                </p>

                                <div className="whitespace-pre-wrap text-sm">

                                    {oldParagraph || (
                                        <span className="italic text-muted-foreground">
                                            Empty
                                        </span>
                                    )}

                                </div>

                            </div>

                            <div className="p-4">

                                <p className="mb-2 text-xs text-muted-foreground">
                                    Newer
                                </p>

                                {changed ? (

                                    <DiffText
                                        oldText={oldParagraph}
                                        newText={newParagraph}
                                    />

                                ) : (

                                    <span className="text-sm italic text-muted-foreground">
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