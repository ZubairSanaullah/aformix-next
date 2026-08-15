import { Prisma, PortfolioProject, PortfolioProjectStatus, PortfolioProjectVisibility, PortfolioCategory } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type {
    CreatePortfolioProjectInput,
    PortfolioProjectListQuery,
    UpdatePortfolioProjectInput,
    PortfolioCategoryListQuery,
} from "@/lib/validations/portfolio";

export class PortfolioProjectServiceError extends Error {
    status: 400 | 404 | 409 | 500;

    constructor(message: string, status: 400 | 404 | 409 | 500) {
        super(message);
        this.name = "PortfolioProjectServiceError";
        this.status = status;
    }
}

export type PortfolioProjectListItemDb = Prisma.PortfolioProjectGetPayload<{
    include: {
        category: true;
        technologies: true;
        author: {
            select: {
                id: true;
                name: true;
                email: true;
            };
        };
    };
}>;

export interface PortfolioProjectListResult {
    items: PortfolioProjectListItemDb[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

function normalizeProjectData(
    input: CreatePortfolioProjectInput | UpdatePortfolioProjectInput,
) {
    return {
        ...input,
        title: input.title?.trim(),
        slug: input.slug?.trim().toLowerCase(),
        excerpt: input.excerpt === undefined ? undefined : input.excerpt?.trim() || null,
        description: input.description === undefined ? undefined : input.description?.trim() || null,
        content: input.content === undefined ? undefined : input.content?.trim() || null,
        clientName: input.clientName === undefined ? undefined : input.clientName?.trim() || null,
        clientIndustry: input.clientIndustry === undefined ? undefined : input.clientIndustry?.trim() || null,
        seoTitle: input.seoTitle === undefined ? undefined : input.seoTitle?.trim() || null,
        seoDescription: input.seoDescription === undefined ? undefined : input.seoDescription?.trim() || null,
        seoKeywords: input.seoKeywords === undefined ? undefined : input.seoKeywords?.trim() || null,
        canonicalUrl:
            input.canonicalUrl === undefined
                ? undefined
                : input.canonicalUrl?.trim() || null,
        projectUrl:
            input.projectUrl === undefined
                ? undefined
                : input.projectUrl?.trim() || null,
        repositoryUrl:
            input.repositoryUrl === undefined
                ? undefined
                : input.repositoryUrl?.trim() || null,
    };
}

function normalizePublishingState<T extends { status?: string; publishedAt?: Date | null }>(data: T) {
    if (data.status === "DRAFT") {
        return { ...data, publishedAt: null };
    }

    if (data.status === "PUBLISHED") {
        return {
            ...data,
            publishedAt: data.publishedAt ?? new Date(),
        };
    }

    return data;
}

function isUniqueConstraintError(
    error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    );
}

function buildSortOrder(sortBy: PortfolioProjectListQuery["sortBy"], sortOrder: "asc" | "desc") {
    const safeSort = [
        "title",
        "featured",
        "sortOrder",
        "createdAt",
        "updatedAt",
        "publishedAt",
        "completionDate",
    ].includes(sortBy)
        ? sortBy
        : "updatedAt";

    return [
        { [safeSort]: sortOrder },
        { sortOrder: "asc" },
        { createdAt: "desc" },
    ] as Prisma.PortfolioProjectOrderByWithRelationInput[];
}

async function ensureCategoryExists(categoryId?: string | null) {
    if (!categoryId) return;

    const category = await prisma.portfolioCategory.findFirst({
        where: {
            id: categoryId,
            deletedAt: null,
        },
        select: { id: true },
    });

    if (!category) {
        throw new PortfolioProjectServiceError(
            "Portfolio category not found or is archived.",
            404,
        );
    }
}

async function ensureAuthorExists(authorId: string) {
    const author = await prisma.user.findUnique({
        where: { id: authorId },
        select: { id: true },
    });

    if (!author) {
        throw new PortfolioProjectServiceError(
            "Portfolio project author not found.",
            404,
        );
    }
}

async function ensureTechnologyIds(technologyIds: string[]) {
    if (!technologyIds.length) {
        return;
    }

    const ids = [...new Set(technologyIds)];
    const found = await prisma.portfolioTechnology.findMany({
        where: {
            id: { in: ids },
            deletedAt: null,
        },
        select: { id: true },
    });

    if (found.length !== ids.length) {
        throw new PortfolioProjectServiceError(
            "One or more technologies were not found.",
            404,
        );
    }
}

export async function getPortfolioProjects(
    query: PortfolioProjectListQuery,
): Promise<PortfolioProjectListResult> {
    const {
        search,
        categoryId,
        status,
        visibility,
        featured,
        technologyId,
        startDateFrom,
        startDateTo,
        completionDateFrom,
        completionDateTo,
        includeDeleted,
        page,
        limit,
        sortBy,
        sortOrder,
    } = query;

    const where: Prisma.PortfolioProjectWhereInput = {
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(categoryId ? { categoryId } : {}),
        ...(status ? { status } : {}),
        ...(visibility ? { visibility } : {}),
        ...(featured !== undefined ? { featured } : {}),
        ...(technologyId ? { technologies: { some: { id: technologyId } } } : {}),
        ...(search
            ? {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { slug: { contains: search, mode: "insensitive" } },
                    { excerpt: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                    { content: { contains: search, mode: "insensitive" } },
                    { clientName: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
        ...(startDateFrom || startDateTo
            ? {
                startDate: {
                    ...(startDateFrom ? { gte: startDateFrom } : {}),
                    ...(startDateTo ? { lte: startDateTo } : {}),
                },
            }
            : {}),
        ...(completionDateFrom || completionDateTo
            ? {
                completionDate: {
                    ...(completionDateFrom ? { gte: completionDateFrom } : {}),
                    ...(completionDateTo ? { lte: completionDateTo } : {}),
                },
            }
            : {}),
    };

    const [items, total] = await prisma.$transaction([
        prisma.portfolioProject.findMany({
            where,
            include: {
                category: true,
                technologies: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: buildSortOrder(sortBy, sortOrder),
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.portfolioProject.count({ where }),
    ]);

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getPortfolioProjectById(
    id: string,
    options?: { includeDeleted?: boolean; publicOnly?: boolean },
) {
    const project = await prisma.portfolioProject.findFirst({
        where: {
            id,
            ...(options?.includeDeleted ? {} : { deletedAt: null }),
            ...(options?.publicOnly
                ? {
                    status: PortfolioProjectStatus.PUBLISHED,
                    visibility: PortfolioProjectVisibility.PUBLIC,
                }
                : {}),
        },
        include: {
            category: true,
            author: {
                select: { id: true, name: true, email: true },
            },
            technologies: true,
            media: {
                include: { media: true },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            },
        },
    });

    if (!project) {
        throw new PortfolioProjectServiceError(
            "Portfolio project not found.",
            404,
        );
    }

    return project;
}

export async function getPortfolioProjectBySlug(
    slug: string,
    options?: { includeDeleted?: boolean; publicOnly?: boolean },
) {
    const normalized = slug.trim().toLowerCase();

    const project = await prisma.portfolioProject.findFirst({
        where: {
            slug: normalized,
            ...(options?.includeDeleted ? {} : { deletedAt: null }),
            ...(options?.publicOnly
                ? {
                    status: PortfolioProjectStatus.PUBLISHED,
                    visibility: PortfolioProjectVisibility.PUBLIC,
                }
                : {}),
        },
        include: {
            category: true,
            author: {
                select: { id: true, name: true, email: true },
            },
            technologies: true,
            media: {
                include: { media: true },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            },
        },
    });

    if (!project) {
        throw new PortfolioProjectServiceError(
            "Portfolio project not found.",
            404,
        );
    }

    return project;
}

export async function createPortfolioProject(input: CreatePortfolioProjectInput) {
    const data = normalizeProjectData(input);
    const { technologyIds, ...projectData } = normalizePublishingState(data);
    const authorId = projectData.authorId;

    if (!authorId) {
        throw new PortfolioProjectServiceError(
            "Portfolio project author is required.",
            400,
        );
    }

    await ensureCategoryExists(projectData.categoryId ?? undefined);
    await ensureAuthorExists(authorId);
    await ensureTechnologyIds(technologyIds ?? []);

    const createPayload: Prisma.PortfolioProjectCreateInput = {
        title: projectData.title ?? "",
        slug: projectData.slug ?? "",
        excerpt: projectData.excerpt ?? null,
        description: projectData.description ?? null,
        content: projectData.content ?? null,
        status: (projectData.status as PortfolioProjectStatus) ?? PortfolioProjectStatus.DRAFT,
        visibility: (projectData.visibility as PortfolioProjectVisibility) ?? PortfolioProjectVisibility.INTERNAL,
        featured: projectData.featured ?? false,
        sortOrder: projectData.sortOrder ?? 0,
        clientName: projectData.clientName ?? null,
        clientIndustry: projectData.clientIndustry ?? null,
        projectUrl: projectData.projectUrl ?? null,
        repositoryUrl: projectData.repositoryUrl ?? null,
        startDate: projectData.startDate ?? null,
        completionDate: projectData.completionDate ?? null,
        seoTitle: projectData.seoTitle ?? null,
        seoDescription: projectData.seoDescription ?? null,
        seoKeywords: projectData.seoKeywords ?? null,
        canonicalUrl: projectData.canonicalUrl ?? null,
        publishedAt: projectData.publishedAt ?? null,
        ...(projectData.categoryId ? { category: { connect: { id: projectData.categoryId } } } : {}),
        author: { connect: { id: authorId } },
        ...(technologyIds?.length
            ? { technologies: { connect: technologyIds.map((id) => ({ id })) } }
            : {}),
    };

    try {
        return await prisma.portfolioProject.create({
            data: createPayload,
            include: {
                category: true,
                author: {
                    select: { id: true, name: true, email: true },
                },
                technologies: true,
            },
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new PortfolioProjectServiceError(
                "A portfolio project with this slug already exists.",
                409,
            );
        }

        console.error("[PORTFOLIO_PROJECT_SERVICE_CREATE]", error);
        throw new PortfolioProjectServiceError(
            "Failed to create portfolio project.",
            500,
        );
    }
}

export async function updatePortfolioProject(
    id: string,
    input: UpdatePortfolioProjectInput,
) {
    const existing = await prisma.portfolioProject.findUnique({
        where: { id },
        select: { id: true, deletedAt: true },
    });

    if (!existing) {
        throw new PortfolioProjectServiceError(
            "Portfolio project not found.",
            404,
        );
    }

    const data = normalizeProjectData(input);
    const { technologyIds, ...projectData } = normalizePublishingState(data);

    if (projectData.categoryId !== undefined) {
        await ensureCategoryExists(projectData.categoryId ?? undefined);
    }

    if (projectData.authorId) {
        await ensureAuthorExists(projectData.authorId);
    }

    if (technologyIds) {
        await ensureTechnologyIds(technologyIds);
    }

    const updatePayload: Prisma.PortfolioProjectUpdateInput = {
        ...(projectData.title !== undefined ? { title: projectData.title } : {}),
        ...(projectData.slug !== undefined ? { slug: projectData.slug } : {}),
        ...(projectData.excerpt !== undefined ? { excerpt: projectData.excerpt ?? null } : {}),
        ...(projectData.description !== undefined ? { description: projectData.description ?? null } : {}),
        ...(projectData.content !== undefined ? { content: projectData.content ?? null } : {}),
        ...(projectData.status !== undefined ? { status: projectData.status as PortfolioProjectStatus } : {}),
        ...(projectData.visibility !== undefined ? { visibility: projectData.visibility as PortfolioProjectVisibility } : {}),
        ...(projectData.featured !== undefined ? { featured: projectData.featured } : {}),
        ...(projectData.sortOrder !== undefined ? { sortOrder: projectData.sortOrder } : {}),
        ...(projectData.clientName !== undefined ? { clientName: projectData.clientName ?? null } : {}),
        ...(projectData.clientIndustry !== undefined ? { clientIndustry: projectData.clientIndustry ?? null } : {}),
        ...(projectData.projectUrl !== undefined ? { projectUrl: projectData.projectUrl ?? null } : {}),
        ...(projectData.repositoryUrl !== undefined ? { repositoryUrl: projectData.repositoryUrl ?? null } : {}),
        ...(projectData.startDate !== undefined ? { startDate: projectData.startDate ?? null } : {}),
        ...(projectData.completionDate !== undefined ? { completionDate: projectData.completionDate ?? null } : {}),
        ...(projectData.categoryId !== undefined ? { category: projectData.categoryId ? { connect: { id: projectData.categoryId } } : { disconnect: true } } : {}),
        ...(projectData.authorId !== undefined ? { author: { connect: { id: projectData.authorId } } } : {}),
        ...(projectData.seoTitle !== undefined ? { seoTitle: projectData.seoTitle ?? null } : {}),
        ...(projectData.seoDescription !== undefined ? { seoDescription: projectData.seoDescription ?? null } : {}),
        ...(projectData.seoKeywords !== undefined ? { seoKeywords: projectData.seoKeywords ?? null } : {}),
        ...(projectData.canonicalUrl !== undefined ? { canonicalUrl: projectData.canonicalUrl ?? null } : {}),
        ...(projectData.publishedAt !== undefined ? { publishedAt: projectData.publishedAt ?? null } : {}),
        ...(technologyIds ? { technologies: { set: technologyIds.map((technologyId) => ({ id: technologyId })) } } : {}),
    };

    try {
        return await prisma.$transaction(async (tx) => {
            const updated = await tx.portfolioProject.update({
                where: { id },
                data: updatePayload,
                include: {
                    category: true,
                    technologies: true,
                    author: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });

            return updated;
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new PortfolioProjectServiceError(
                "A portfolio project with this slug already exists.",
                409,
            );
        }

        console.error("[PORTFOLIO_PROJECT_SERVICE_UPDATE]", error);
        throw new PortfolioProjectServiceError(
            "Failed to update portfolio project.",
            500,
        );
    }
}

export async function trashPortfolioProject(id: string) {
    const project = await prisma.portfolioProject.findUnique({
        where: { id },
        select: { id: true, deletedAt: true },
    });

    if (!project) {
        throw new PortfolioProjectServiceError(
            "Portfolio project not found.",
            404,
        );
    }

    if (project.deletedAt) {
        throw new PortfolioProjectServiceError(
            "Portfolio project is already in the trash.",
            409,
        );
    }

    return prisma.portfolioProject.update({
        where: { id },
        data: {
            deletedAt: new Date(),
        },
    });
}

export interface PortfolioCategoryWithCount extends PortfolioCategory {
    projectCount: number;
}

export interface PortfolioCategoryListResult {
    categories: PortfolioCategoryWithCount[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export async function getPortfolioCategories(
    query: PortfolioCategoryListQuery,
): Promise<PortfolioCategoryListResult> {
    const { search, includeDeleted, page, limit, sortBy, sortOrder } = query;

    const where: Prisma.PortfolioCategoryWhereInput = {
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { slug: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
    };

    const [categories, total] = await prisma.$transaction([
        prisma.portfolioCategory.findMany({
            where,
            include: {
                _count: {
                    select: { projects: true },
                },
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.portfolioCategory.count({ where }),
    ]);

    return {
        categories: categories.map(({ _count, ...category }) => ({
            ...category,
            projectCount: _count.projects,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function archivePortfolioProject(id: string) {
    const project = await prisma.portfolioProject.findUnique({
        where: { id },
    });

    if (!project) {
        throw new PortfolioProjectServiceError(
            "Portfolio project not found.",
            404,
        );
    }

    if (project.status === PortfolioProjectStatus.ARCHIVED) {
        throw new PortfolioProjectServiceError(
            "Portfolio project is already archived.",
            409,
        );
    }

    return prisma.portfolioProject.update({
        where: { id },
        data: {
            status: PortfolioProjectStatus.ARCHIVED,
        },
    });
}

export async function restorePortfolioProject(id: string) {
    const project = await prisma.portfolioProject.findUnique({
        where: { id },
    });

    if (!project) {
        throw new PortfolioProjectServiceError(
            "Portfolio project not found.",
            404,
        );
    }

    if (!project.deletedAt && project.status !== PortfolioProjectStatus.ARCHIVED) {
        throw new PortfolioProjectServiceError(
            "Portfolio project is not archived or soft deleted.",
            409,
        );
    }

    return prisma.portfolioProject.update({
        where: { id },
        data: {
            deletedAt: null,
            status: project.publishedAt
                ? PortfolioProjectStatus.PUBLISHED
                : PortfolioProjectStatus.DRAFT,
        },
    });
}

export async function deletePortfolioProject(id: string) {
    const project = await prisma.portfolioProject.findUnique({
        where: { id },
        select: { id: true },
    });

    if (!project) {
        throw new PortfolioProjectServiceError(
            "Portfolio project not found.",
            404,
        );
    }

    return prisma.portfolioProject.delete({
        where: { id },
    });
}

export async function getPublicPortfolioProjects(
    query: Omit<PortfolioProjectListQuery, "status" | "visibility" | "includeDeleted">,
) {
    return getPortfolioProjects({
        ...query,
        status: PortfolioProjectStatus.PUBLISHED,
        visibility: PortfolioProjectVisibility.PUBLIC,
        includeDeleted: false,
    });
}

export async function getPublicPortfolioProjectBySlug(slug: string) {
    return getPortfolioProjectBySlug(slug, {
        includeDeleted: false,
        publicOnly: true,
    });
}

export async function replacePortfolioProjectMedia(
    projectId: string,
    items: {
        mediaId: string;
        sortOrder?: number;
        isPrimary?: boolean;
    }[],
) {
    const project = await prisma.portfolioProject.findUnique({
        where: { id: projectId },
        select: { id: true },
    });

    if (!project) {
        throw new PortfolioProjectServiceError("Portfolio project not found.", 404);
    }

    if (items.length > 0) {
        const mediaIds = items.map(item => item.mediaId);
        const existingMedia = await prisma.media.findMany({
            where: { id: { in: mediaIds }, deletedAt: null },
            select: { id: true },
        });

        if (existingMedia.length !== [...new Set(mediaIds)].length) {
            throw new PortfolioProjectServiceError("One or more media items were not found.", 404);
        }
    }

    return prisma.$transaction(async (tx) => {
        await tx.portfolioProjectMedia.deleteMany({
            where: { projectId },
        });

        if (items.length === 0) {
            return [];
        }

        await tx.portfolioProjectMedia.createMany({
            data: items.map((item, index) => ({
                projectId: projectId,
                mediaId: item.mediaId,
                sortOrder: item.sortOrder ?? index,
                isPrimary: item.isPrimary ?? false,
            })),
        });

        return tx.portfolioProjectMedia.findMany({
            where: { projectId },
            include: { media: true },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        });
    });
}
