"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PostStatus } from "@prisma/client";
import { Pencil } from "lucide-react";

import BulkActionsToolbar from "./BulkActionsToolbar";
import DeletePostButton from "./DeletePostButton";
import RestorePostButton from "./RestorePostButton";
import PermanentDeletePostButton from "./PermanentDeletePostButton";
import { useRouter } from "next/navigation";


interface PostItem {
    id: string;
    title: string;
    status: PostStatus;
    readingTime: number;
    createdAt: Date;
}

interface PostsTableProps {
    posts: PostItem[];
    isTrash?: boolean;
}

export default function PostsTable({ posts, isTrash = false }: PostsTableProps) {
    const [selected, setSelected] = useState<string[]>([]);

    const allSelected =
        posts.length > 0 && selected.length === posts.length;

    const selectedPosts = useMemo(
        () => posts.filter((post) => selected.includes(post.id)),
        [posts, selected]
    );

    const toggleAll = () => {
        if (allSelected) {
            setSelected([]);
            return;
        }

        setSelected(posts.map((post) => post.id));
    };

    const toggleOne = (id: string) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

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

    const router = useRouter();

    async function handleBulkAction(action: string) {
        try {
            const response = await fetch("/api/posts/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ids: selected,
                    action,
                }),
            });

            if (!response.ok) {
                throw new Error("Bulk action failed.");
            }

            setSelected([]);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            {selectedPosts.length > 0 && (
                <div className="flex items-center justify-between border-b bg-primary/5 px-6 py-3">
                    <span className="text-sm font-medium">
                        {selectedPosts.length} post
                        {selectedPosts.length > 1 ? "s" : ""} selected
                    </span>

                    <div className="flex items-center gap-2">
                        {isTrash ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleBulkAction("restore")}
                                    className="rounded-lg border px-3 py-2 text-sm transition hover:bg-muted"
                                >
                                    Restore
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleBulkAction("permanentDelete")}
                                    className="rounded-lg border border-red-500 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                    Permanently Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleBulkAction("publish")}
                                    className="rounded-lg border px-3 py-2 text-sm transition hover:bg-muted"
                                >
                                    Publish
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleBulkAction("archive")}
                                    className="rounded-lg border px-3 py-2 text-sm transition hover:bg-muted"
                                >
                                    Archive
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleBulkAction("delete")}
                                    className="rounded-lg border border-red-500 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                    Move to Trash
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <table className="w-full">
                <thead className="border-b bg-muted/40">
                    <tr>
                        <th className="w-12 px-4">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleAll}
                                className="h-4 w-4 cursor-pointer rounded"
                            />
                        </th>

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
                    {posts.map((post) => {
                        const isSelected = selected.includes(post.id);

                        return (
                            <tr
                                key={post.id}
                                className={`border-b last:border-0 transition-colors ${isSelected
                                    ? "bg-primary/5"
                                    : "hover:bg-muted/40"
                                    }`}
                            >
                                <td className="px-4">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleOne(post.id)}
                                        className="h-4 w-4 cursor-pointer rounded"
                                    />
                                </td>

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
                                        {isTrash ? (
                                            <>
                                                <RestorePostButton postId={post.id} />
                                                <PermanentDeletePostButton postId={post.id} />
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href={`/workspace/blog/edit/${post.id}`}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
                                                    title="Edit post"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>

                                                <DeletePostButton postId={post.id} />
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}