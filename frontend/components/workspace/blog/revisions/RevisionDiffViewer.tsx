"use client";

import { diffWords } from "diff";

import { useRevisionComparison } from "./hooks/useRevisionComparison";
import { htmlToText } from "./utils/htmlToText";
import * as RevisionComponents from "./";
import RevisionSummary from "./RevisionSummary";

interface Revision {
    title: string;
    content: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    createdAt: string;
}

interface Props {
    leftRevision: Revision;
    rightRevision: Revision;
}

function countWordChanges(oldText: string, newText: string) {
    const changes = diffWords(oldText, newText);

    let added = 0;
    let removed = 0;

    changes.forEach((part) => {
        const words = part.value
            .trim()
            .split(/\s+/)
            .filter(Boolean).length;

        if (part.added) {
            added += words;
        }

        if (part.removed) {
            removed += words;
        }
    });

    return { added, removed };
}

export default function RevisionDiffViewer({
    leftRevision,
    rightRevision,
}: Props) {
    const comparison =
        useRevisionComparison(
            leftRevision,
            rightRevision
        );

    <RevisionSummary
        comparison={comparison}
    />

    const {
        older,
        newer,
    } = comparison;

    const contentSummary = countWordChanges(
        htmlToText(older.content),
        htmlToText(newer.content)
    );

    const titleChanged =
        older.title !== newer.title;

    const seoTitleChanged =
        (older.seoTitle ?? "") !==
        (newer.seoTitle ?? "");

    const seoDescriptionChanged =
        (older.seoDescription ?? "") !==
        (newer.seoDescription ?? "");

    return (
        <div className="space-y-6">
            {/* Summary */}
            <section className="rounded-2xl border bg-muted/30 p-6">

                <h2 className="text-lg font-semibold">
                    Revision Comparison
                </h2>

                <div className="mt-6 space-y-3 text-sm">

                    <p>
                        {titleChanged ? "📝" : "✓"} Title {titleChanged ? "changed" : "unchanged"}
                    </p>

                    <p>
                        🟢 {contentSummary.added} words added
                    </p>

                    <p>
                        🔴 {contentSummary.removed} words removed
                    </p>

                    <p>
                        {seoTitleChanged ? "📝" : "✓"} SEO title {seoTitleChanged ? "changed" : "unchanged"}
                    </p>

                    <p>
                        {seoDescriptionChanged ? "📝" : "✓"} SEO description {seoDescriptionChanged ? "changed" : "unchanged"}
                    </p>

                </div>

            </section>

            <RevisionComponents.DiffSection
                title="Title"
                oldValue={older.title}
                newValue={newer.title}
            />

            <section className="overflow-hidden rounded-2xl border">

                <div className="border-b bg-muted/40 px-6 py-4">
                    <h3 className="font-semibold">
                        Content
                    </h3>
                </div>

                <div className="p-6">

                    <RevisionComponents.ParagraphDiff
                        oldContent={htmlToText(
                            older.content
                        )}
                        newContent={htmlToText(
                            newer.content
                        )}
                    />

                </div>

            </section>

            <RevisionComponents.DiffSection
                title="SEO Title"
                oldValue={older.seoTitle ?? ""}
                newValue={newer.seoTitle ?? ""}
            />

            <RevisionComponents.DiffSection
                title="SEO Description"
                oldValue={older.seoDescription ?? ""}
                newValue={newer.seoDescription ?? ""}
            />
        </div>
    );
}