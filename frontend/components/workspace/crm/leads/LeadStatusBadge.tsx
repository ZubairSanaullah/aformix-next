import { cn } from "@/lib/utils";

type LeadStatus =
    | "NEW"
    | "CONTACTED"
    | "QUALIFIED"
    | "CONVERTED"
    | "LOST";

interface LeadStatusBadgeProps {
    status: LeadStatus;
}

const statusConfig: Record<
    LeadStatus,
    {
        label: string;
        className: string;
    }
> = {
    NEW: {
        label: "New",
        className:
            "bg-blue-50 text-blue-700 border-blue-200",
    },
    CONTACTED: {
        label: "Contacted",
        className:
            "bg-amber-50 text-amber-700 border-amber-200",
    },
    QUALIFIED: {
        label: "Qualified",
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    CONVERTED: {
        label: "Converted",
        className:
            "bg-violet-50 text-violet-700 border-violet-200",
    },
    LOST: {
        label: "Lost",
        className:
            "bg-red-50 text-red-700 border-red-200",
    },
};

export default function LeadStatusBadge({
    status,
}: LeadStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                config.className
            )}
        >
            {config.label}
        </span>
    );
}