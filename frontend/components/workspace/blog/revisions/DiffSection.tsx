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
        <section className="overflow-hidden rounded-2xl border">

            <div className="border-b bg-muted/40 px-6 py-4">
                <h3 className="font-semibold">
                    {title}
                </h3>
            </div>

            <div className="grid grid-cols-2">

                <div className="border-r p-6">

                    <p className="mb-3 text-xs font-medium uppercase text-muted-foreground">
                        Older Revision
                    </p>

                    <div className="whitespace-pre-wrap text-sm">
                        {oldValue || (
                            <span className="italic text-muted-foreground">
                                Empty
                            </span>
                        )}
                    </div>

                </div>

                <div className="p-6">

                    <p className="mb-3 text-xs font-medium uppercase text-muted-foreground">
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