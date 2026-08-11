"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import DeleteTaskButton from "@/components/workspace/tasks/DeleteTaskButton";

interface TaskActionsProps {
    taskId: string;
    taskTitle: string;
}

export default function TaskActions({
    taskId,
    taskTitle,
}: TaskActionsProps) {
    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/workspace/tasks/${taskId}/edit`}
                aria-label="Edit task"
                title="Edit task"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-xs font-medium text-[var(--workspace-text)] transition-colors hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-primary)]"
            >
                <Pencil className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                    Edit
                </span>
            </Link>

            <DeleteTaskButton
                taskId={taskId}
                taskTitle={taskTitle}
            />
        </div>
    );
}
