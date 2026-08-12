"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, StickyNote, Pencil } from "lucide-react";

import {
    WorkspaceCard,
    WorkspaceCardHeader,
} from "@/components/workspace/ui";

import NoteForm from "@/components/workspace/crm/notes/NoteForm";
import DeleteNoteButton from "@/components/workspace/crm/notes/DeleteNoteButton";

interface RelatedNote {
    id: string;
    content: string;
    createdAt: string | Date;
    // Optional: not every parent page's API route includes the
    // owner relation on notes (some just do `notes: { orderBy }`
    // with no nested select). Render gracefully either way.
    user?: {
        name: string | null;
        email: string;
    } | null;
}

interface RelatedNotesProps {
    notes: RelatedNote[];
    // Exactly one of these should be set to the current record's id,
    // so newly added notes attach to it automatically.
    defaultRelation: {
        contactId?: string;
        companyId?: string;
        leadId?: string;
        dealId?: string;
    };
}

function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
}

export default function RelatedNotes({
    notes,
    defaultRelation,
}: RelatedNotesProps) {
    const [isAdding, setIsAdding] = useState(false);

    return (
        <WorkspaceCard>
            <WorkspaceCardHeader
                title={`Notes (${notes.length})`}
                description="Freeform notes related to this record."
                action={
                    <button
                        type="button"
                        onClick={() => setIsAdding((current) => !current)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-1.5 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)]"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Note
                    </button>
                }
            />

            {isAdding && (
                <div className="border-b border-[var(--workspace-border)] bg-[var(--workspace-background)] p-4">
                    <NoteForm
                        companies={[]}
                        contacts={[]}
                        leads={[]}
                        deals={[]}
                        defaultRelation={defaultRelation}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            )}

            <div className="divide-y divide-[var(--workspace-border)]">
                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                            <StickyNote className="h-5 w-5 text-[var(--workspace-text-subtle)]" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-[var(--workspace-text)]">
                            No notes yet
                        </h3>

                        <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--workspace-text-muted)]">
                            Add a note to keep context on this record.
                        </p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="px-5 py-4">
                            <div className="flex items-start justify-between gap-3">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--workspace-text-muted)]">
                                    {note.content}
                                </p>

                                <div className="flex shrink-0 items-center gap-1">
                                    <Link
                                        href={`/workspace/crm/notes/${note.id}/edit`}
                                        aria-label="Edit note"
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Link>

                                    <DeleteNoteButton noteId={note.id} />
                                </div>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--workspace-text-subtle)]">
                                {note.user && (
                                    <>
                                        <span>
                                            {note.user.name ||
                                                note.user.email}
                                        </span>
                                        <span>·</span>
                                    </>
                                )}
                                <span>{formatDate(note.createdAt)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </WorkspaceCard>
    );
}