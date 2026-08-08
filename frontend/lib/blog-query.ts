import { Prisma, PostStatus } from "@prisma/client";

interface BlogQueryOptions {
    search?: string;
    status?: string;
    sort?: string;
    category?: string;
    tag?: string;
}

export function buildBlogQuery({
    search,
    status,
    sort,
    category,
    tag,
}: BlogQueryOptions) {
    const where: Prisma.PostWhereInput = {
        deletedAt: null,
    };

    if (search?.trim()) {
        where.OR = [
            {
                title: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },
            {
                slug: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },
            {
                seoTitle: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },
        ];
    }

    if (
        status &&
        Object.values(PostStatus).includes(status as PostStatus)
    ) {
        where.status = status as PostStatus;
    }

    if (category) {
        where.categoryId = category;
    }

    if (tag) {
        where.tags = {
            some: {
                id: tag,
            },
        };
    }

    let orderBy: Prisma.PostOrderByWithRelationInput = {
        createdAt: "desc",
    };

    switch (sort) {
        case "oldest":
            orderBy = {
                createdAt: "asc",
            };
            break;

        case "updated":
            orderBy = {
                updatedAt: "desc",
            };
            break;

        case "views":
            orderBy = {
                views: "desc",
            };
            break;

        case "published":
            orderBy = {
                publishedAt: "desc",
            };
            break;

        default:
            orderBy = {
                createdAt: "desc",
            };
    }

    return {
        where,
        orderBy,
    };
}