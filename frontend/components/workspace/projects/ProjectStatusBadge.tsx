import type { ProjectStatus } from "@prisma/client";

import { WorkspaceBadge } from "@/components/workspace/ui";

import {
    formatProjectStatus,
    getProjectStatusBadgeVariant,
} from "@/lib/utils/project-format";

interface ProjectStatusBadgeProps {
    status: ProjectStatus;
}

export default function ProjectStatusBadge({
    status,
}: ProjectStatusBadgeProps) {
    return (
        <WorkspaceBadge variant={getProjectStatusBadgeVariant(status)}>
            {formatProjectStatus(status)}
        </WorkspaceBadge>
    );
}
