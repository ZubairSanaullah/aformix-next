import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
                }
            },
            tags: {
                select: {
                    id: true,
                    name: true,
                }
            }
        },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Trash
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Restore or permanently delete posts.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/workspace/blog"
                        className="rounded-lg border px-4 py-2 text-sm"
                    >
                        Back to Posts
                    </Link>

                    <EmptyTrashButton postId={""} />
                </div>
            </div>

            <PostsTable posts={posts} isTrash />
        </div>
    );
}