import { Prisma, PostStatus } from "@prisma/client";

interface BlogQueryOptions {
    search?: string;
    status?: string;
    sort?: string;
}

export function buildBlogQuery({
    search,
    status,
    sort,
}: BlogQueryOptions) {
    const where: Prisma.PostWhereInput = {};

    if (search?.trim()) {
        where.OR = [
            {
                title: {
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
                seoTitle: {
                    contains: search,
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
    }

    return {
        where,
        orderBy,
    };
}