import { cn } from "@/lib/utils";

type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

interface TaskPriorityBadgeProps {
    priority: TaskPriority;
}

const priorityConfig: Record<
    TaskPriority,
    {
        label: string;
        className: string;
    }
> = {
    LOW: {
        label: "Low",
        className:
            "border-slate-200 bg-slate-50 text-slate-600",
    },

    MEDIUM: {
        label: "Medium",
        className:
            "border-blue-200 bg-blue-50 text-blue-700",
    },

    HIGH: {
        label: "High",
        className:
            "border-orange-200 bg-orange-50 text-orange-700",
    },

    URGENT: {
        label: "Urgent",
        className:
            "border-red-200 bg-red-50 text-red-700",
    },
};

export default function TaskPriorityBadge({
    priority,
}: TaskPriorityBadgeProps) {
    const config = priorityConfig[priority];

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