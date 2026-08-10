import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspacePageActions from "@/components/workspace/ui/WorkspacePageActions";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import PostsTable from "@/components/workspace/blog/PostsTable";
import EmptyTrashButton from "@/components/workspace/blog/EmptyTrashButton";

export default async function BlogTrashPage() {
    const posts = await prisma.post.findMany({
        where: {
            deletedAt: {
                not: null,
            },
        },
        orderBy: {
            deletedAt: "desc",
        },
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
    });

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Trash"
                description="Restore or permanently delete posts."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Blog", href: "/workspace/blog" },
                    { label: "Trash" },
                ]}
                actions={
                    <WorkspacePageActions>
                        <Link href="/workspace/blog">
                            <WorkspaceButton variant="secondary" size="md">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Posts
                            </WorkspaceButton>
                        </Link>

                        {posts.length > 0 && <EmptyTrashButton />}
                    </WorkspacePageActions>
                }
            />

            <PostsTable posts={posts} isTrash />
        </div>
    );
}