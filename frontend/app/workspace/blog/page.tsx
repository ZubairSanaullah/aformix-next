import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { buildBlogQuery } from "@/lib/blog-query";

import PostsTable from "@/components/workspace/blog/PostsTable";
import PostsFilters from "@/components/workspace/blog/PostsFilters";
import Pagination from "@/components/workspace/blog/Pagination";

interface BlogPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function BlogPage({
    searchParams,
}: BlogPageProps) {
    const params = await searchParams;

    const page = Number(params.page ?? "1");
    const pageSize = 10;

    const { where, orderBy } = buildBlogQuery({
        search: params.search,
        status: params.status,
        sort: params.sort,
    });

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                title: true,
                status: true,
                readingTime: true,
                createdAt: true,
            },
        }),

        prisma.post.count({
            where,
        }),
    ]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Blog CMS
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Manage blog posts, drafts, categories, and published content.
                    </p>
                </div>

                <Link
                    href="/workspace/blog/create"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    + New Post
                </Link>
            </div>

            <PostsFilters />

            <PostsTable posts={posts} />

            <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
            />
        </div>
    );
}