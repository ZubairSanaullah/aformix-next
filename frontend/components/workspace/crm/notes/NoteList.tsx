"use client";

import Link from "next/link";
import {
    Building2,
    Target,
    BriefcaseBusiness,
    User,
    StickyNote,
    Pencil,
} from "lucide-react";

import { WorkspaceEmptyState } from "@/components/workspace/ui";

import DeleteNoteButton from "@/components/workspace/crm/notes/DeleteNoteButton";

interface NoteContact {
    id: string;
    firstName: string;
    lastName: string | null;
}

interface NoteCompany {
    id: string;
    name: string;
}

interface NoteLead {
    id: string;
    title: string;
}

interface NoteDeal {
    id: string;
    title: string;
}

interface NoteOwner {
    id: string;
    name: string | null;
    email: string;
}

export interface CRMNote {
    id: string;
    content: string;
    createdAt: string;
    contact: NoteContact | null;
    company: NoteCompany | null;
    lead: NoteLead | null;
    deal: NoteDeal | null;
    user: NoteOwner;
}

interface NoteListProps {
    notes: CRMNote[];
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

function RelatedTo({ note }: { note: CRMNote }) {
    const items: {
        href: string;
        label: string;
        icon: typeof Building2;
    }[] = [];

    if (note.contact) {
        const name = [note.contact.firstName, note.contact.lastName]
            .filter(Boolean)
            .join(" ");

        items.push({
            href: `/workspace/crm/contacts/${note.contact.id}`,
            label: name || "Contact",
            icon: User,
        });
    }

    if (note.company) {
        items.push({
            href: `/workspace/crm/companies/${note.company.id}`,
            label: note.company.name,
            icon: Building2,
        });
    }

    if (note.lead) {
        items.push({
            href: `/workspace/crm/leads/${note.lead.id}`,
            label: note.lead.title,
            icon: Target,
        });
    }

    if (note.deal) {
        items.push({
            href: `/workspace/crm/deals/${note.deal.id}`,
            label: note.deal.title,
            icon: BriefcaseBusiness,
        });
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--workspace-background)] px-2 py-1 text-[10px] font-medium text-[var(--workspace-text-muted)] transition-colors hover:bg-[var(--workspace-primary-soft)] hover:text-[var(--workspace-primary)]"
                >
                    <item.icon className="h-3 w-3 shrink-0" />
                    <span className="max-w-[140px] truncate">
                        {item.label}
                    </span>
                </Link>
            ))}
        </div>
    );
}

export default function NoteList({ notes }: NoteListProps) {
    if (!notes.length) {
        return (
            <WorkspaceEmptyState
                title="No notes found"
                description="No notes match your current filters. Add a note or adjust your search criteria."
            />
        );
    }

    return (
        <div className="space-y-3">
            {notes.map((note) => (
                <div
                    key={note.id}
                    className="rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-4"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                                <StickyNote className="h-4 w-4" />
                            </span>

                            <div className="min-w-0">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--workspace-text)]">
                                    {note.content}
                                </p>
                            </div>
                        </div>

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

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pl-11">
                        <RelatedTo note={note} />

                        <div className="flex items-center gap-2 text-[11px] text-[var(--workspace-text-subtle)]">
                            <span>
                                {note.user?.name || note.user?.email}
                            </span>
                            <span>·</span>
                            <span>{formatDate(note.createdAt)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}