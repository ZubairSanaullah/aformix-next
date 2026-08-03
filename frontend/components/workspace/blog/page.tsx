import Link from "next/link";

import { prisma } from "@/lib/prisma";
import PostsTable from "@/components/workspace/blog/PostsTable";

export default async function BlogPage() {
    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            title: true,
            status: true,
            readingTime: true,
            createdAt: true,
        },
    });

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

            <PostsTable posts={posts} />
        </div>
    );
}