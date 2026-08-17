import { notFound, redirect } from "next/navigation";

import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import {
    getPortfolioProjectById,
    PortfolioProjectServiceError,
} from "@/lib/services/portfolio-projects";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import PortfolioProjectForm from "@/components/workspace/portfolio/PortfolioProjectForm";
import PortfolioEditHeaderActions from "@/components/workspace/portfolio/PortfolioEditHeaderActions";
import PortfolioTrashedNotice from "@/components/workspace/portfolio/PortfolioTrashedNotice";

import type { PortfolioProjectDetail } from "@/lib/api/portfolio";

interface EditPortfolioProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPortfolioProjectPage({
    params,
}: EditPortfolioProjectPageProps) {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }
        throw error;
    }

    const { id } = await params;

    let project;

    try {
        // includeDeleted: true so trashed projects still load here —
        // the page shows a restore prompt instead of the form rather
        // than 404ing, since the record does exist.
        project = await getPortfolioProjectById(id, { includeDeleted: true });
    } catch (error) {
        if (
            error instanceof PortfolioProjectServiceError &&
            error.status === 404
        ) {
            notFound();
        }
        throw error;
    }

    const isTrashed = Boolean(project.deletedAt);

    const categories = await prisma.portfolioCategory.findMany({
        where: { deletedAt: null },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true },
    });

    // Explicit server -> client serialization boundary: convert Dates to
    // ISO strings and shape the Prisma result to exactly match
    // PortfolioProjectDetail, rather than relying on implicit RSC
    // handling of rich types.
    const projectDetail: PortfolioProjectDetail = {
        id: project.id,
        title: project.title,
        slug: project.slug,
        excerpt: project.excerpt,
        description: project.description,
        content: project.content,
        status: project.status,
        visibility: project.visibility,
        featured: project.featured,
        sortOrder: project.sortOrder,
        clientName: project.clientName,
        clientIndustry: project.clientIndustry,
        projectUrl: project.projectUrl,
        repositoryUrl: project.repositoryUrl,
        startDate: project.startDate ? project.startDate.toISOString() : null,
        completionDate: project.completionDate
            ? project.completionDate.toISOString()
            : null,
        categoryId: project.categoryId,
        category: project.category
            ? {
                  id: project.category.id,
                  name: project.category.name,
                  slug: project.category.slug,
              }
            : null,
        technologies: project.technologies.map((tech) => ({
            id: tech.id,
            name: tech.name,
            slug: tech.slug,
            description: tech.description,
        })),
        seoTitle: project.seoTitle,
        seoDescription: project.seoDescription,
        seoKeywords: project.seoKeywords,
        canonicalUrl: project.canonicalUrl,
        publishedAt: project.publishedAt ? project.publishedAt.toISOString() : null,
        media: project.media.map((item) => ({
            id: item.id,
            mediaId: item.mediaId,
            sortOrder: item.sortOrder,
            isPrimary: item.isPrimary,
            caption: item.caption,
            altText: item.altText,
            media: {
                id: item.media.id,
                url: item.media.url,
                alt: item.media.alt,
            },
        })),
    };

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title={project.title}
                description="Edit this portfolio project."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Portfolio", href: "/workspace/portfolio" },
                    { label: project.title },
                ]}
                actions={
                    <PortfolioEditHeaderActions
                        projectId={project.id}
                        status={project.status}
                    />
                }
            />

            {isTrashed ? (
                <PortfolioTrashedNotice
                    projectId={project.id}
                    projectTitle={project.title}
                />
            ) : (
                <PortfolioProjectForm
                    mode="edit"
                    projectId={project.id}
                    categories={categories}
                    initialProject={projectDetail}
                />
            )}
        </div>
    );
}
