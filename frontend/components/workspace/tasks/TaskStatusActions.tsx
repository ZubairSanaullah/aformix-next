"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
    WorkspaceSelect,
} from "@/components/workspace/ui";

type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

interface TaskStatusActionsProps {
    taskId: string;
    status: TaskStatus;
    priority: TaskPriority;
}

export default function TaskStatusActions({
    taskId,
    status,
    priority,
}: TaskStatusActionsProps) {
    const router = useRouter();

    const [isUpdating, setIsUpdating] =
        useState(false);

    async function updateTask(
        field: "status" | "priority",
        value: string
    ) {
        if (isUpdating) return;

        setIsUpdating(true);

        try {
            const response = await fetch(
                `/api/tasks/${taskId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        [field]: value,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    `Failed to update task ${field}.`
                );
            }

            toast.success(
                field === "status"
                    ? "Task status updated."
                    : "Task priority updated."
            );

            router.refresh();
        } catch (error) {
            console.error(
                `Task ${field} update failed:`,
                error
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update task."
            );
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <label
                    htmlFor="task-status"
                    className="mb-1.5 block text-[11px] font-medium text-[var(--workspace-text-muted)]"
                >
                    Status
                </label>

                <div className="relative">
                    <WorkspaceSelect
                        id="task-status"
                        value={status}
                        disabled={isUpdating}
                        onChange={(event) =>
                            updateTask(
                                "status",
                                event.target.value
                            )
                        }
                        className="w-full"
                    >
                        <option value="TODO">
                            To Do
                        </option>

                        <option value="IN_PROGRESS">
                            In Progress
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>
                    </WorkspaceSelect>

                    {isUpdating && (
                        <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-[var(--workspace-text-muted)]" />
                    )}
                </div>
            </div>

            <div>
                <label
                    htmlFor="task-priority"
                    className="mb-1.5 block text-[11px] font-medium text-[var(--workspace-text-muted)]"
                >
                    Priority
                </label>

                <div className="relative">
                    <WorkspaceSelect
                        id="task-priority"
                        value={priority}
                        disabled={isUpdating}
                        onChange={(event) =>
                            updateTask(
                                "priority",
                                event.target.value
                            )
                        }
                        className="w-full"
                    >
                        <option value="LOW">
                            Low
                        </option>

                        <option value="MEDIUM">
                            Medium
                        </option>

                        <option value="HIGH">
                            High
                        </option>

                        <option value="URGENT">
                            Urgent
                        </option>
                    </WorkspaceSelect>

                    {isUpdating && (
                        <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-[var(--workspace-text-muted)]" />
                    )}
                </div>
            </div>
        </div>
    );
}