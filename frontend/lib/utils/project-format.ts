import type { ProjectPriority, ProjectStatus } from "@prisma/client";

/**
 * Shared formatting/label helpers for the Projects module.
 * Mirrors the pattern used in components/workspace/crm/leads/LeadTable.tsx
 * (formatStatus / formatSource / getStatusClasses) so Projects reads the
 * same way the rest of the Workspace does.
 */

export const PROJECT_STATUS_OPTIONS: {
    value: ProjectStatus;
    label: string;
}[] = [
    { value: "PLANNING", label: "Planning" },
    { value: "ACTIVE", label: "Active" },
    { value: "ON_HOLD", label: "On Hold" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
];

export const PROJECT_PRIORITY_OPTIONS: {
    value: ProjectPriority;
    label: string;
}[] = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
];

export function formatProjectStatus(status: ProjectStatus) {
    return (
        PROJECT_STATUS_OPTIONS.find((option) => option.value === status)
            ?.label ?? status
    );
}

export function formatProjectPriority(priority: ProjectPriority) {
    return (
        PROJECT_PRIORITY_OPTIONS.find((option) => option.value === priority)
            ?.label ?? priority
    );
}

/**
 * Badge variant used by WorkspaceBadge (default | neutral | success | warning
 * | danger | info | primary). Kept separate from raw Tailwind classes so the
 * Projects module always routes through the shared badge component instead
 * of hand-rolled span styling.
 */
export function getProjectStatusBadgeVariant(
    status: ProjectStatus
): "info" | "primary" | "warning" | "success" | "danger" {
    switch (status) {
        case "PLANNING":
            return "info";
        case "ACTIVE":
            return "primary";
        case "ON_HOLD":
            return "warning";
        case "COMPLETED":
            return "success";
        case "CANCELLED":
            return "danger";
        default:
            return "info";
    }
}

export function getProjectPriorityBadgeVariant(
    priority: ProjectPriority
): "neutral" | "info" | "warning" | "danger" {
    switch (priority) {
        case "LOW":
            return "neutral";
        case "MEDIUM":
            return "info";
        case "HIGH":
            return "warning";
        case "URGENT":
            return "danger";
        default:
            return "neutral";
    }
}

export function formatProjectDate(date: Date | string | null | undefined) {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export function isProjectOverdue(
    dueDate: Date | string | null | undefined,
    status: ProjectStatus
) {
    if (!dueDate) return false;
    if (status === "COMPLETED" || status === "CANCELLED") return false;

    return new Date(dueDate) < new Date();
}
