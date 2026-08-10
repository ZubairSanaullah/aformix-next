"use client";

import DiffText from "./DiffText";

interface DiffSectionProps {
    title: string;
    oldValue: string;
    newValue: string;
}

export default function DiffSection({
    title,
    oldValue,
    newValue,
}: DiffSectionProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-[var(--workspace-border)]">

            <div className="border-b border-[var(--workspace-border)] bg-[var(--workspace-background)] px-6 py-4">
                <h3 className="font-semibold text-[var(--workspace-text)]">
                    {title}
                </h3>
            </div>

            <div className="grid grid-cols-2 bg-[var(--workspace-surface)]">

                <div className="border-r border-[var(--workspace-border)] p-6">

                    <p className="mb-3 text-xs font-medium uppercase text-[var(--workspace-text-subtle)]">
                        Older Revision
                    </p>

                    <div className="whitespace-pre-wrap text-sm text-[var(--workspace-text)]">
                        {oldValue || (
                            <span className="italic text-[var(--workspace-text-subtle)]">
                                Empty
                            </span>
                        )}
                    </div>

                </div>

                <div className="p-6">

                    <p className="mb-3 text-xs font-medium uppercase text-[var(--workspace-text-subtle)]">
                        Newer Revision
                    </p>

                    <DiffText
                        oldText={oldValue}
                        newText={newValue}
                    />

                </div>

            </div>

        </section>
    );
}