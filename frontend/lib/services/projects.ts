import {
    Prisma,
    ProjectPriority,
    ProjectStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface GetProjectsOptions {
    page?: number;
    limit?: number;
    search?: string;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    ownerId?: string;
    companyId?: string;
    startDateFrom?: Date;
    startDateTo?: Date;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    sort?: ProjectSortField;
    order?: ProjectSortOrder;
    includeDeleted?: boolean;
}

export type ProjectSortField =
    | "createdAt"
    | "updatedAt"
    | "name"
    | "dueDate"
    | "priority"
    | "status"
    | "progress";

export type ProjectSortOrder = "asc" | "desc";

export interface CreateProjectInput {
    name: string;
    slug: string;
    description?: string | null;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    progress?: number;
    startDate?: Date | null;
    dueDate?: Date | null;
    completedAt?: Date | null;
    ownerId: string;
    companyId?: string | null;
}

export interface UpdateProjectInput {
    name?: string;
    slug?: string;
    description?: string | null;
    status?: ProjectStatus;
    priority?: ProjectPriority;
    progress?: number;
    startDate?: Date | null;
    dueDate?: Date | null;
    completedAt?: Date | null;
    ownerId?: string;
    companyId?: string | null;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function normalizePagination(page?: number, limit?: number) {
    const normalizedPage =
        Number.isFinite(page) && page && page > 0
            ? Math.floor(page)
            : DEFAULT_PAGE;

    const normalizedLimit =
        Number.isFinite(limit) && limit && limit > 0
            ? Math.min(Math.floor(limit), MAX_LIMIT)
            : DEFAULT_LIMIT;

    return {
        page: normalizedPage,
        limit: normalizedLimit,
        skip: (normalizedPage - 1) * normalizedLimit,
    };
}

function normalizeSearch(search?: string) {
    if (!search) {
        return undefined;
    }

    const normalized = search.trim();

    return normalized.length > 0 ? normalized : undefined;
}

function buildOrderBy(
    sort: ProjectSortField = "createdAt",
    order: ProjectSortOrder = "desc"
): Prisma.ProjectOrderByWithRelationInput {
    const allowedFields: ProjectSortField[] = [
        "createdAt",
        "updatedAt",
        "name",
        "dueDate",
        "priority",
        "status",
        "progress",
    ];

    const safeSort = allowedFields.includes(sort)
        ? sort
        : "createdAt";

    return {
        [safeSort]: order,
    };
}

function buildWhere(
    options: GetProjectsOptions
): Prisma.ProjectWhereInput {
    const search = normalizeSearch(options.search);

    return {
        ...(options.includeDeleted
            ? {}
            : {
                deletedAt: null,
            }),

        ...(options.status
            ? {
                status: options.status,
            }
            : {}),

        ...(options.priority
            ? {
                priority: options.priority,
            }
            : {}),

        ...(options.ownerId
            ? {
                ownerId: options.ownerId,
            }
            : {}),

        ...(options.companyId
            ? {
                companyId: options.companyId,
            }
            : {}),

        ...(search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        slug: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {}),

        ...(options.startDateFrom || options.startDateTo
            ? {
                startDate: {
                    ...(options.startDateFrom
                        ? {
                            gte: options.startDateFrom,
                        }
                        : {}),
                    ...(options.startDateTo
                        ? {
                            lte: options.startDateTo,
                        }
                        : {}),
                },
            }
            : {}),

        ...(options.dueDateFrom || options.dueDateTo
            ? {
                dueDate: {
                    ...(options.dueDateFrom
                        ? {
                            gte: options.dueDateFrom,
                        }
                        : {}),
                    ...(options.dueDateTo
                        ? {
                            lte: options.dueDateTo,
                        }
                        : {}),
                },
            }
            : {}),
    };
}

async function ensureOwnerExists(ownerId: string) {
    const owner = await prisma.user.findUnique({
        where: {
            id: ownerId,
        },
        select: {
            id: true,
        },
    });

    if (!owner) {
        throw new Error("Project owner not found.");
    }
}

async function ensureCompanyExists(companyId: string) {
    const company = await prisma.company.findUnique({
        where: {
            id: companyId,
        },
        select: {
            id: true,
        },
    });

    if (!company) {
        throw new Error("Project company not found.");
    }
}

function validateProjectDates(input: {
    startDate?: Date | null;
    dueDate?: Date | null;
    completedAt?: Date | null;
}) {
    const {
        startDate,
        dueDate,
        completedAt,
    } = input;

    if (startDate && dueDate && dueDate < startDate) {
        throw new Error(
            "Due date cannot be earlier than the start date."
        );
    }

    if (
        startDate &&
        completedAt &&
        completedAt < startDate
    ) {
        throw new Error(
            "Completed date cannot be earlier than the start date."
        );
    }

    if (
        dueDate &&
        completedAt &&
        completedAt < dueDate
    ) {
        throw new Error(
            "Completed date cannot be earlier than the due date."
        );
    }
}

function validateProgress(progress?: number) {
    if (
        progress !== undefined &&
        (!Number.isInteger(progress) ||
            progress < 0 ||
            progress > 100)
    ) {
        throw new Error(
            "Project progress must be an integer between 0 and 100."
        );
    }
}

const projectRelations = {
    owner: {
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
        },
    },

    company: {
        select: {
            id: true,
            name: true,
            website: true,
            industry: true,
            size: true,
            phone: true,
            email: true,
            location: true,
            status: true,
        },
    },
} satisfies Prisma.ProjectInclude;

export async function getProjects(
    options: GetProjectsOptions = {}
) {
    const {
        page,
        limit,
        skip,
    } = normalizePagination(
        options.page,
        options.limit
    );

    const where = buildWhere(options);

    const orderBy = [
        buildOrderBy(
            options.sort ?? "createdAt",
            options.order ?? "desc"
        ),
        {
            id: "asc",
        },
    ] satisfies Prisma.ProjectOrderByWithRelationInput[];

    const [projects, total] =
        await prisma.$transaction([
            prisma.project.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: projectRelations,
            }),

            prisma.project.count({
                where,
            }),
        ]);

    return {
        projects,
        pagination: {
            page,
            limit,
            total,
            totalPages:
                total === 0
                    ? 0
                    : Math.ceil(total / limit),
        },
    };
}

export async function getProjectById(id: string) {
    return prisma.project.findFirst({
        where: {
            id,
            deletedAt: null,
        },

        include: {
            ...projectRelations,

            tasks: {
                orderBy: [
                    {
                        dueAt: "asc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],

                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    priority: true,
                    dueAt: true,
                    completedAt: true,
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            },

            activities: {
                orderBy: {
                    createdAt: "desc",
                },

                take: 50,

                select: {
                    id: true,
                    type: true,
                    title: true,
                    description: true,
                    dueAt: true,
                    completedAt: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });
}

export async function getProjectBySlug(
    slug: string
) {
    return prisma.project.findFirst({
        where: {
            slug: slug.trim().toLowerCase(),
            deletedAt: null,
        },

        include: projectRelations,
    });
}

export async function getProjectStats() {
    const now = new Date();

    const [
        total,
        planning,
        active,
        onHold,
        completed,
        cancelled,
        overdue,
        progressAggregate,
    ] = await prisma.$transaction([
        prisma.project.count({
            where: {
                deletedAt: null,
            },
        }),

        prisma.project.count({
            where: {
                deletedAt: null,
                status: ProjectStatus.PLANNING,
            },
        }),

        prisma.project.count({
            where: {
                deletedAt: null,
                status: ProjectStatus.ACTIVE,
            },
        }),

        prisma.project.count({
            where: {
                deletedAt: null,
                status: ProjectStatus.ON_HOLD,
            },
        }),

        prisma.project.count({
            where: {
                deletedAt: null,
                status: ProjectStatus.COMPLETED,
            },
        }),

        prisma.project.count({
            where: {
                deletedAt: null,
                status: ProjectStatus.CANCELLED,
            },
        }),

        prisma.project.count({
            where: {
                deletedAt: null,
                dueDate: {
                    lt: now,
                },
                status: {
                    notIn: [
                        ProjectStatus.COMPLETED,
                        ProjectStatus.CANCELLED,
                    ],
                },
            },
        }),

        prisma.project.aggregate({
            where: {
                deletedAt: null,
            },

            _avg: {
                progress: true,
            },
        }),
    ]);

    return {
        total,
        planning,
        active,
        onHold,
        completed,
        cancelled,
        overdue,
        averageProgress: Math.round(
            progressAggregate._avg.progress ?? 0
        ),
    };
}

export async function createProject(
    input: CreateProjectInput
) {
    const name = input.name.trim();
    const slug = input.slug.trim().toLowerCase();

    if (!name) {
        throw new Error(
            "Project name is required."
        );
    }

    if (!slug) {
        throw new Error(
            "Project slug is required."
        );
    }

    validateProgress(input.progress);

    validateProjectDates({
        startDate: input.startDate,
        dueDate: input.dueDate,
        completedAt: input.completedAt,
    });

    await ensureOwnerExists(input.ownerId);

    if (input.companyId) {
        await ensureCompanyExists(
            input.companyId
        );
    }

    const existingProject =
        await prisma.project.findUnique({
            where: {
                slug,
            },

            select: {
                id: true,
            },
        });

    if (existingProject) {
        throw new Error(
            "A project with this slug already exists."
        );
    }

    const project = await prisma.project.create({
        data: {
            name,
            slug,
            description:
                input.description?.trim() || null,

            status:
                input.status ??
                ProjectStatus.PLANNING,

            priority:
                input.priority ??
                ProjectPriority.MEDIUM,

            progress: input.progress ?? 0,

            startDate:
                input.startDate ?? null,

            dueDate:
                input.dueDate ?? null,

            completedAt:
                input.completedAt ?? null,

            ownerId: input.ownerId,

            companyId:
                input.companyId ?? null,
        },

        include: projectRelations,
    });

    await createProjectActivity({
        projectId: project.id,
        userId: input.ownerId,
        title: "Project created",
        description:
            "Project has been created.",
    });

    return project;
}

export async function updateProject(
    id: string,
    input: UpdateProjectInput
) {
    const existingProject =
        await prisma.project.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

    if (!existingProject) {
        throw new Error(
            "Project not found."
        );
    }

    const name =
        input.name !== undefined
            ? input.name.trim()
            : existingProject.name;

    const slug =
        input.slug !== undefined
            ? input.slug.trim().toLowerCase()
            : existingProject.slug;

    if (!name) {
        throw new Error(
            "Project name is required."
        );
    }

    if (!slug) {
        throw new Error(
            "Project slug is required."
        );
    }

    validateProgress(input.progress);

    const startDate =
        input.startDate !== undefined
            ? input.startDate
            : existingProject.startDate;

    const dueDate =
        input.dueDate !== undefined
            ? input.dueDate
            : existingProject.dueDate;

    const completedAt =
        input.completedAt !== undefined
            ? input.completedAt
            : existingProject.completedAt;

    validateProjectDates({
        startDate,
        dueDate,
        completedAt,
    });

    if (input.ownerId !== undefined) {
        await ensureOwnerExists(
            input.ownerId
        );
    }

    if (
        input.companyId !== undefined &&
        input.companyId !== null
    ) {
        await ensureCompanyExists(
            input.companyId
        );
    }

    if (slug !== existingProject.slug) {
        const slugConflict =
            await prisma.project.findFirst({
                where: {
                    slug,
                    NOT: {
                        id,
                    },
                },

                select: {
                    id: true,
                },
            });

        if (slugConflict) {
            throw new Error(
                "A project with this slug already exists."
            );
        }
    }

    const project =
        await prisma.project.update({
            where: {
                id,
            },

            data: {
                ...(input.name !== undefined
                    ? {
                        name,
                    }
                    : {}),

                ...(input.slug !== undefined
                    ? {
                        slug,
                    }
                    : {}),

                ...(input.description !== undefined
                    ? {
                        description:
                            input.description?.trim() ||
                            null,
                    }
                    : {}),

                ...(input.status !== undefined
                    ? {
                        status: input.status,
                    }
                    : {}),

                ...(input.priority !== undefined
                    ? {
                        priority:
                            input.priority,
                    }
                    : {}),

                ...(input.progress !== undefined
                    ? {
                        progress:
                            input.progress,
                    }
                    : {}),

                ...(input.startDate !== undefined
                    ? {
                        startDate:
                            input.startDate,
                    }
                    : {}),

                ...(input.dueDate !== undefined
                    ? {
                        dueDate:
                            input.dueDate,
                    }
                    : {}),

                ...(input.completedAt !== undefined
                    ? {
                        completedAt:
                            input.completedAt,
                    }
                    : {}),

                ...(input.ownerId !== undefined
                    ? {
                        ownerId:
                            input.ownerId,
                    }
                    : {}),

                ...(input.companyId !== undefined
                    ? {
                        companyId:
                            input.companyId,
                    }
                    : {}),
            },

            include: projectRelations,
        });

    await createProjectActivity({
        projectId: project.id,
        userId:
            input.ownerId ??
            existingProject.ownerId,
        title: "Project updated",
        description:
            "Project details have been updated.",
    });

    return project;
}

export async function archiveProject(
    id: string,
    userId: string
) {
    const project =
        await prisma.project.findFirst({
            where: {
                id,
                deletedAt: null,
            },

            select: {
                id: true,
                ownerId: true,
            },
        });

    if (!project) {
        throw new Error(
            "Project not found."
        );
    }

    const archivedProject =
        await prisma.project.update({
            where: {
                id,
            },

            data: {
                deletedAt: new Date(),
            },

            include: projectRelations,
        });

    await createProjectActivity({
        projectId: project.id,
        userId,
        title: "Project archived",
        description:
            "Project has been archived.",
    });

    return archivedProject;
}

export async function restoreProject(
    id: string,
    userId: string
) {
    const project =
        await prisma.project.findUnique({
            where: {
                id,
            },

            select: {
                id: true,
                deletedAt: true,
            },
        });

    if (!project) {
        throw new Error(
            "Project not found."
        );
    }

    if (!project.deletedAt) {
        throw new Error(
            "Project is not deleted."
        );
    }

    const restoredProject =
        await prisma.project.update({
            where: {
                id,
            },

            data: {
                deletedAt: null,
            },

            include: projectRelations,
        });

    await createProjectActivity({
        projectId: project.id,
        userId,
        title: "Project restored",
        description:
            "Project has been restored.",
    });

    return restoredProject;
}

export async function deleteProject(
    id: string,
    userId: string
) {
    const project =
        await prisma.project.findFirst({
            where: {
                id,
                deletedAt: null,
            },

            select: {
                id: true,
            },
        });

    if (!project) {
        throw new Error(
            "Project not found."
        );
    }

    const deletedProject =
        await prisma.project.update({
            where: {
                id,
            },

            data: {
                deletedAt: new Date(),
            },

            include: projectRelations,
        });

    await createProjectActivity({
        projectId: project.id,
        userId,
        title: "Project deleted",
        description:
            "Project has been deleted.",
    });

    return deletedProject;
}

export async function createProjectActivity({
    projectId,
    userId,
    title,
    description,
}: {
    projectId: string;
    userId: string;
    title: string;
    description?: string;
}) {
    return prisma.activity.create({
        data: {
            type: "NOTE",
            title,
            description,
            projectId,
            userId,
        },

        select: {
            id: true,
            type: true,
            title: true,
            description: true,
            projectId: true,
            userId: true,
            createdAt: true,
        },
    });
}