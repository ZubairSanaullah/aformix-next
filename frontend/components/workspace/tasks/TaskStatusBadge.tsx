import { cn } from "@/lib/utils";

type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

interface TaskStatusBadgeProps {
    status: TaskStatus;
}

const statusConfig: Record<
    TaskStatus,
    {
        label: string;
        className: string;
    }
> = {
    TODO: {
        label: "To Do",
        className:
            "border-blue-200 bg-blue-50 text-blue-700",
    },

    IN_PROGRESS: {
        label: "In Progress",
        className:
            "border-amber-200 bg-amber-50 text-amber-700",
    },

    COMPLETED: {
        label: "Completed",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    CANCELLED: {
        label: "Cancelled",
        className:
            "border-red-200 bg-red-50 text-red-700",
    },
};

export default function TaskStatusBadge({
    status,
}: TaskStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                config.className
            )}
        >
            {config.label}
        </span>
    );
}