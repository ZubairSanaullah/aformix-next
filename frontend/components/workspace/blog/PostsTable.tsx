"use client";

import Link from "next/link";
import { PostStatus } from "@prisma/client";
import { Pencil } from "lucide-react";
import DeletePostButton from "./DeletePostButton";

interface PostItem {
    id: string;
    title: string;
    status: PostStatus;
    readingTime: number;
    createdAt: Date;
}

interface PostsTableProps {
    posts: PostItem[];
}

export default function PostsTable({ posts }: PostsTableProps) {

    if (posts.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-12 text-center">
                <h2 className="text-xl font-semibold">
                    No posts yet
                </h2>

                <p className="mt-2 text-muted-foreground">
                    Create your first blog post to get started.
                </p>

                <Link
                    href="/workspace/blog/create"
                    className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                    + Create First Post
                </Link>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <table className="w-full">
                <thead className="border-b bg-muted/40">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            Title
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            Status
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            Reading Time
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            Created
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {posts.map((post) => (
                        <tr
                            key={post.id}
                            className="border-b last:border-0"
                        >
                            <td className="px-6 py-4 font-medium">
                                {post.title}
                            </td>

                            <td className="px-6 py-4">
                                {post.status}
                            </td>

                            <td className="px-6 py-4">
                                {post.readingTime} min
                            </td>

                            <td className="px-6 py-4">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/workspace/blog/edit/${post.id}`}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
                                        title="Edit post"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Link>

                                    <DeletePostButton postId={post.id} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}