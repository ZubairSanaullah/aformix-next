import Link from "next/link";
import {
    Archive,
    FileEdit,
    FileText,
    Plus,
    Send,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { buildBlogQuery } from "@/lib/blog-query";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspacePageActions from "@/components/workspace/ui/WorkspacePageActions";

import PostsFilters from "@/components/workspace/blog/PostsFilters";
import PostsTable from "@/components/workspace/blog/PostsTable";
import Pagination from "@/components/workspace/blog/Pagination";

interface BlogPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        sort?: string;
        category?: string;
        tag?: string;
        page?: string;
    }>;
}

const PAGE_SIZE = 10;

function getParam(
    value: string | string[] | undefined
): string {
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }

    return value ?? "";
}

export default async function BlogPage({
    searchParams,
}: BlogPageProps) {
    const params = await searchParams;

    const search = getParam(params.search);
    const status = getParam(params.status);
    const sort = getParam(params.sort);
    const category = getParam(params.category);
    const tag = getParam(params.tag);

    const parsedPage = Number.parseInt(
        getParam(params.page),
        10
    );

    const page =
        Number.isFinite(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1;

    const { where, orderBy } = buildBlogQuery({
        search,
        status,
        sort,
        category,
        tag,
    });

    const [
        posts,
        total,
        categories,
        tags,
        totalPosts,
        publishedPosts,
        draftPosts,
        archivedPosts,
    ] = await Promise.all([
        prisma.post.findMany({
            where,
            orderBy,
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
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
                    orderBy: {
                        name: "asc",
                    },
                },
            },
        }),

        prisma.post.count({
            where,
        }),

        prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        }),

        prisma.tag.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        }),

        prisma.post.count({
            where: {
                deletedAt: null,
            },
        }),

        prisma.post.count({
            where: {
                deletedAt: null,
                status: "PUBLISHED",
            },
        }),

        prisma.post.count({
            where: {
                deletedAt: null,
                status: "DRAFT",
            },
        }),

        prisma.post.count({
            where: {
                deletedAt: null,
                status: "ARCHIVED",
            },
        }),
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(total / PAGE_SIZE)
    );

    const safePage = Math.min(page, totalPages);

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Blog"
                description="Create, manage, publish, and organize your content."
                breadcrumbs={[
                    {
                        label: "Workspace",
                        href: "/workspace",
                    },
                    {
                        label: "Blog",
                    },
                ]}
                actions={
                    <WorkspacePageActions>
                        <Link href="/workspace/blog/create">
                            <WorkspaceButton size="sm">
                                <Plus className="h-3.5 w-3.5" />
                                New Post
                            </WorkspaceButton>
                        </Link>
                    </WorkspacePageActions>
                }
            />

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <WorkspaceCard padding="sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                            <FileText className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--workspace-text-muted)]">
                                Total Posts
                            </p>

                            <p className="mt-0.5 text-lg font-semibold tracking-tight text-[var(--workspace-text)]">
                                {totalPosts}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <Send className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--workspace-text-muted)]">
                                Published
                            </p>

                            <p className="mt-0.5 text-lg font-semibold tracking-tight text-[var(--workspace-text)]">
                                {publishedPosts}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <FileEdit className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--workspace-text-muted)]">
                                Drafts
                            </p>

                            <p className="mt-0.5 text-lg font-semibold tracking-tight text-[var(--workspace-text)]">
                                {draftPosts}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <Archive className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--workspace-text-muted)]">
                                Archived
                            </p>

                            <p className="mt-0.5 text-lg font-semibold tracking-tight text-[var(--workspace-text)]">
                                {archivedPosts}
                            </p>
                        </div>
                    </div>
                </WorkspaceCard>
            </div>

            {/* Filters */}
            <PostsFilters
                categories={categories}
                tags={tags}
            />

            {/* Posts */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Posts
                        </h2>

                        <p className="mt-0.5 text-xs text-[var(--workspace-text-muted)]">
                            {total === 0
                                ? "No posts match your current filters."
                                : `${total} post${total === 1 ? "" : "s"} found`}
                        </p>
                    </div>

                    {(search ||
                        status ||
                        category ||
                        tag) && (
                            <span className="text-[10px] text-[var(--workspace-text-muted)]">
                                Filtered results
                            </span>
                        )}
                </div>

                <PostsTable posts={posts} />
            </div>

            <Pagination
                page={safePage}
                pageSize={PAGE_SIZE}
                total={total}
            />
        </div>
    );
}