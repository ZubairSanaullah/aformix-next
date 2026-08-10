import { WorkspaceBadge } from "@/components/workspace/ui";

export type CompanyStatus =
    | "ACTIVE"
    | "INACTIVE"
    | "ARCHIVED";

interface CompanyStatusBadgeProps {
    status: CompanyStatus;
}

const statusConfig: Record<
    CompanyStatus,
    {
        label: string;
        variant: "success" | "warning" | "neutral";
    }
> = {
    ACTIVE: {
        label: "Active",
        variant: "success",
    },

    INACTIVE: {
        label: "Inactive",
        variant: "warning",
    },

    ARCHIVED: {
        label: "Archived",
        variant: "neutral",
    },
};

export default function CompanyStatusBadge({
    status,
}: CompanyStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <WorkspaceBadge variant={config.variant}>
            {config.label}
        </WorkspaceBadge>
    );
}
