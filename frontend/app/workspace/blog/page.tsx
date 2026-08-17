import Link from "next/link";
import { redirect } from "next/navigation";
import { Trash2, Plus } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildBlogQuery } from "@/lib/blog-query";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspacePageActions from "@/components/workspace/ui/WorkspacePageActions";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

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
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const params = await searchParams;

    const page = Number(params.page ?? "1");
    const pageSize = 10;

    const { where, orderBy } = buildBlogQuery({
        search: params.search,
        status: params.status,
        sort: params.sort,
    });

    if (session.user.role !== "ADMIN") {
        where.authorId = session.user.id;
    }

    const [posts, total, categories, tags] = await Promise.all([
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
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),

        prisma.post.count({
            where,
        }),

        prisma.category.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        }),

        prisma.tag.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        }),
    ]);

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Blog"
                description="Manage blog posts, drafts, categories, and published content."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Blog" },
                ]}
                actions={
                    <WorkspacePageActions>
                        <Link href="/workspace/blog/trash">
                            <WorkspaceButton variant="secondary" size="md">
                                <Trash2 className="h-3.5 w-3.5" />
                                Trash
                            </WorkspaceButton>
                        </Link>

                        <Link href="/workspace/blog/create">
                            <WorkspaceButton variant="primary" size="md">
                                <Plus className="h-3.5 w-3.5" />
                                New Post
                            </WorkspaceButton>
                        </Link>
                    </WorkspacePageActions>
                }
            />

            <PostsFilters categories={categories} tags={tags} />

            <PostsTable posts={posts} />

            <Pagination page={page} pageSize={pageSize} total={total} />
        </div>
    );
}