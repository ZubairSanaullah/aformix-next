import {
    PortfolioProjectStatus,
    PortfolioProjectVisibility,
    Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface PortfolioStats {
    totalProjects: number;
    draftProjects: number;
    publishedProjects: number;
    archivedProjects: number;
    publicProjects: number;
    internalProjects: number;
    featuredProjects: number;
    totalCategories: number;
    totalTechnologies: number;
    recentPublished: Array<{
        id: string;
        title: string;
        slug: string;
        publishedAt: Date | null;
    }>;
    recentUpdated: Array<{
        id: string;
        title: string;
        slug: string;
        updatedAt: Date;
    }>;
}

const recentPublishedSelect = {
    id: true,
    title: true,
    slug: true,
    publishedAt: true,
} satisfies Prisma.PortfolioProjectSelect;

const recentUpdatedSelect = {
    id: true,
    title: true,
    slug: true,
    updatedAt: true,
} satisfies Prisma.PortfolioProjectSelect;

export async function getPortfolioStats(): Promise<PortfolioStats> {
    const [
        totalProjects,
        draftProjects,
        publishedProjects,
        archivedProjects,
        publicProjects,
        internalProjects,
        featuredProjects,
        totalCategories,
        totalTechnologies,
        recentPublished,
        recentUpdated,
    ] = await prisma.$transaction([
        prisma.portfolioProject.count({
            where: { deletedAt: null },
        }),
        prisma.portfolioProject.count({
            where: {
                deletedAt: null,
                status: PortfolioProjectStatus.DRAFT,
            },
        }),
        prisma.portfolioProject.count({
            where: {
                deletedAt: null,
                status: PortfolioProjectStatus.PUBLISHED,
            },
        }),
        prisma.portfolioProject.count({
            where: {
                deletedAt: null,
                status: PortfolioProjectStatus.ARCHIVED,
            },
        }),
        prisma.portfolioProject.count({
            where: {
                deletedAt: null,
                status: PortfolioProjectStatus.PUBLISHED,
                visibility: PortfolioProjectVisibility.PUBLIC,
            },
        }),
        prisma.portfolioProject.count({
            where: {
                deletedAt: null,
                visibility: PortfolioProjectVisibility.INTERNAL,
            },
        }),
        prisma.portfolioProject.count({
            where: {
                deletedAt: null,
                featured: true,
            },
        }),
        prisma.portfolioCategory.count({
            where: { deletedAt: null },
        }),
        prisma.portfolioTechnology.count({
            where: { deletedAt: null },
        }),
        prisma.portfolioProject.findMany({
            where: {
                deletedAt: null,
                status: PortfolioProjectStatus.PUBLISHED,
                publishedAt: { not: null },
            },
            orderBy: { publishedAt: "desc" },
            take: 5,
            select: recentPublishedSelect,
        }),
        prisma.portfolioProject.findMany({
            where: { deletedAt: null },
            orderBy: { updatedAt: "desc" },
            take: 5,
            select: recentUpdatedSelect,
        }),
    ]);

    return {
        totalProjects,
        draftProjects,
        publishedProjects,
        archivedProjects,
        publicProjects,
        internalProjects,
        featuredProjects,
        totalCategories,
        totalTechnologies,
        recentPublished,
        recentUpdated,
    };
}
