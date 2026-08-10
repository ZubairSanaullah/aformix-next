"use client";

import {
    FileText,
    Plus,
    Minus,
    Clock3,
    Search,
    Type,
} from "lucide-react";

interface Props {
    comparison: {
        titleChanged: boolean;
        seoTitleChanged: boolean;
        seoDescriptionChanged: boolean;

        wordsAdded: number;
        wordsRemoved: number;

        paragraphsChanged: number;

        readingTimeDifference: number;
    };
}

export default function RevisionSummary({
    comparison,
}: Props) {

    return (

        <section className="rounded-2xl border border-[var(--workspace-border)] bg-[var(--workspace-background)] p-6">

            <h2 className="mb-5 text-lg font-semibold text-[var(--workspace-text)]">
                Changes Overview
            </h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                <SummaryItem
                    icon={<Plus className="h-4 w-4" />}
                    label="Words Added"
                    value={comparison.wordsAdded}
                    colorVar="var(--workspace-success)"
                />

                <SummaryItem
                    icon={<Minus className="h-4 w-4" />}
                    label="Words Removed"
                    value={comparison.wordsRemoved}
                    colorVar="var(--workspace-danger)"
                />

                <SummaryItem
                    icon={<FileText className="h-4 w-4" />}
                    label="Paragraphs Changed"
                    value={comparison.paragraphsChanged}
                />

                <SummaryItem
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Reading Time Δ"
                    value={`${comparison.readingTimeDifference > 0 ? "+" : ""}${comparison.readingTimeDifference} min`}
                />

                <SummaryItem
                    icon={<Type className="h-4 w-4" />}
                    label="Title"
                    value={
                        comparison.titleChanged
                            ? "Changed"
                            : "Unchanged"
                    }
                />

                <SummaryItem
                    icon={<Search className="h-4 w-4" />}
                    label="SEO"
                    value={
                        comparison.seoTitleChanged ||
                            comparison.seoDescriptionChanged
                            ? "Updated"
                            : "Unchanged"
                    }
                />

            </div>

        </section>

    );
}

function SummaryItem({
    icon,
    label,
    value,
    colorVar,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    colorVar?: string;
}) {

    return (

        <div className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-4">

            <div className="mb-2 flex items-center gap-2 text-[var(--workspace-text-muted)]">

                {icon}

                <span className="text-sm">
                    {label}
                </span>

            </div>

            <div
                className="text-xl font-bold"
                style={{ color: colorVar ?? "var(--workspace-text)" }}
            >
                {value}
            </div>

        </div>

    );

}