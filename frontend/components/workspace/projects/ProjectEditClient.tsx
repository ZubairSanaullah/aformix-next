"use client";

import { useRouter } from "next/navigation";
import type { ProjectPriority, ProjectStatus } from "@prisma/client";

import ProjectForm from "@/components/workspace/projects/ProjectForm";

interface ProjectEditClientProps {
    project: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        status: ProjectStatus;
        priority: ProjectPriority;
        progress: number;
        startDate: Date | string | null;
        dueDate: Date | string | null;
        completedAt: Date | string | null;
        ownerId: string;
        companyId: string | null;
    };
    owners: { id: string; name: string | null; email: string }[];
    companies: { id: string; name: string }[];
}

export default function ProjectEditClient({
    project,
    owners,
    companies,
}: ProjectEditClientProps) {
    const router = useRouter();

    return (
        <ProjectForm
            mode="edit"
            owners={owners}
            companies={companies}
            initialValues={{
                id: project.id,
                name: project.name,
                slug: project.slug,
                description: project.description ?? "",
                status: project.status,
                priority: project.priority,
                progress: project.progress,
                startDate: project.startDate
                    ? String(project.startDate)
                    : "",
                dueDate: project.dueDate ? String(project.dueDate) : "",
                completedAt: project.completedAt
                    ? String(project.completedAt)
                    : "",
                ownerId: project.ownerId,
                companyId: project.companyId ?? "",
            }}
            onCancel={() => router.push(`/workspace/projects/${project.id}`)}
        />
    );
}
