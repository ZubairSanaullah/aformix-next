"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PostStatus } from "@prisma/client";
import {
    Eye,
    MoreHorizontal,
    Pencil,
} from "lucide-react";

import {
    WorkspaceTable,
    WorkspaceTableCell,
    WorkspaceTableHead,
    WorkspaceTableHeader,
    WorkspaceTableRow,
} from "@/components/workspace/ui";

import WorkspaceBadge from "@/components/workspace/ui/WorkspaceBadge";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";

import BulkActionsToolbar from "./BulkActionsToolbar";
import DeletePostButton from "./DeletePostButton";
import RestorePostButton from "./RestorePostButton";
import PermanentDeletePostButton from "./PermanentDeletePostButton";

interface PostItem {
    id: string;
    title: string;
    status: PostStatus;
    readingTime: number;
    createdAt: Date;
    category: {
        id: string;
        name: string;
    } | null;
    tags: {
        id: string;
        name: string;
    }[];
}

interface PostsTableProps {
    posts: PostItem[];
    isTrash?: boolean;
}

function getStatusVariant(status: PostStatus) {
    switch (status) {
        case "PUBLISHED":
            return "success" as const;

        case "DRAFT":
            return "warning" as const;

        case "ARCHIVED":
            return "default" as const;

        default:
            return "default" as const;
    }
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function PostsTable({
    posts,
    isTrash = false,
}: PostsTableProps) {
    const [selected, setSelected] = useState<string[]>(
        []
    );

    const allSelected =
        posts.length > 0 &&
        selected.length === posts.length;

    const selectedPosts = useMemo(
        () =>
            posts.filter((post) =>
                selected.includes(post.id)
            ),
        [posts, selected]
    );

    function toggleAll() {
        if (allSelected) {
            setSelected([]);
            return;
        }

        setSelected(posts.map((post) => post.id));
    }

    function toggleOne(id: string) {
        setSelected((previous) =>
            previous.includes(id)
                ? previous.filter((item) => item !== id)
                : [...previous, id]
        );
    }

    if (posts.length === 0) {
        return (
            <WorkspaceEmptyState
                title="No posts found"
                description={
                    isTrash
                        ? "There are no posts in the trash."
                        : "No posts match your current filters. Create a new post or adjust your filters."
                }
                actionLabel={
                    isTrash ? undefined : "Create New Post"
                }
                onAction={
                    isTrash
                        ? undefined
                        : () => {
                            window.location.href =
                                "/workspace/blog/create";
                        }
                }
            />
        );
    }

    return (
        <div className="space-y-3">
            {selectedPosts.length > 0 && (
                <BulkActionsToolbar
                    ids={selected}
                    onSuccess={() => setSelected([])}
                />
            )}

            <WorkspaceTable>
                <WorkspaceTableHeader>
                    <tr>
                        <WorkspaceTableHead className="w-10 px-3">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleAll}
                                aria-label="Select all posts"
                                className="
                                    h-3.5
                                    w-3.5
                                    cursor-pointer
                                    rounded
                                    border-[var(--workspace-border)]
                                    accent-[var(--workspace-primary)]
                                "
                            />
                        </WorkspaceTableHead>

                        <WorkspaceTableHead>
                            Post
                        </WorkspaceTableHead>

                        <WorkspaceTableHead>
                            Category
                        </WorkspaceTableHead>

                        <WorkspaceTableHead>
                            Status
                        </WorkspaceTableHead>

                        <WorkspaceTableHead>
                            Reading
                        </WorkspaceTableHead>

                        <WorkspaceTableHead>
                            Created
                        </WorkspaceTableHead>

                        <WorkspaceTableHead className="text-right">
                            Actions
                        </WorkspaceTableHead>
                    </tr>
                </WorkspaceTableHeader>

                <tbody>
                    {posts.map((post) => {
                        const isSelected =
                            selected.includes(post.id);

                        return (
                            <WorkspaceTableRow
                                key={post.id}
                                className={
                                    isSelected
                                        ? "bg-[var(--workspace-primary-soft)]/50"
                                        : undefined
                                }
                            >
                                <WorkspaceTableCell className="w-10 px-3">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() =>
                                            toggleOne(post.id)
                                        }
                                        aria-label={`Select ${post.title}`}
                                        className="
                                            h-3.5
                                            w-3.5
                                            cursor-pointer
                                            rounded
                                            border-[var(--workspace-border)]
                                            accent-[var(--workspace-primary)]
                                        "
                                    />
                                </WorkspaceTableCell>

                                <WorkspaceTableCell className="min-w-[260px]">
                                    <div className="min-w-0">
                                        <Link
                                            href={`/workspace/blog/edit/${post.id}`}
                                            className="
                                                line-clamp-1
                                                text-xs
                                                font-semibold
                                                text-[var(--workspace-text)]
                                                transition-colors
                                                hover:text-[var(--workspace-primary)]
                                            "
                                        >
                                            {post.title}
                                        </Link>

                                        <div className="mt-1 flex items-center gap-2 text-[10px] text-[var(--workspace-text-subtle)]">
                                            <span className="inline-flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                Manage post
                                            </span>
                                        </div>
                                    </div>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    {post.category ? (
                                        <span className="text-xs text-[var(--workspace-text-muted)]">
                                            {post.category.name}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-[var(--workspace-text-subtle)]">
                                            Uncategorized
                                        </span>
                                    )}
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <WorkspaceBadge
                                        variant={getStatusVariant(
                                            post.status
                                        )}
                                    >
                                        {post.status ===
                                            "PUBLISHED"
                                            ? "Published"
                                            : post.status ===
                                                "DRAFT"
                                                ? "Draft"
                                                : "Archived"}
                                    </WorkspaceBadge>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <span className="whitespace-nowrap text-xs text-[var(--workspace-text-muted)]">
                                        {post.readingTime} min
                                    </span>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <span className="whitespace-nowrap text-xs text-[var(--workspace-text-muted)]">
                                        {formatDate(
                                            post.createdAt
                                        )}
                                    </span>
                                </WorkspaceTableCell>

                                <WorkspaceTableCell>
                                    <div className="flex items-center justify-end gap-1.5">
                                        {isTrash ? (
                                            <>
                                                <RestorePostButton
                                                    postId={post.id}
                                                />

                                                <PermanentDeletePostButton
                                                    postId={post.id}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href={`/workspace/blog/edit/${post.id}`}
                                                    className="
                                                        inline-flex
                                                        h-8
                                                        w-8
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-[var(--workspace-border)]
                                                        text-[var(--workspace-text-muted)]
                                                        transition-colors
                                                        hover:border-[var(--workspace-primary)]/30
                                                        hover:bg-[var(--workspace-primary-soft)]
                                                        hover:text-[var(--workspace-primary)]
                                                    "
                                                    title="Edit post"
                                                    aria-label="Edit post"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Link>

                                                <DeletePostButton
                                                    postId={post.id}
                                                />

                                                <button
                                                    type="button"
                                                    className="
                                                        hidden
                                                        h-8
                                                        w-8
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-[var(--workspace-border)]
                                                        text-[var(--workspace-text-subtle)]
                                                    "
                                                    title="More actions"
                                                    aria-label="More actions"
                                                >
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </WorkspaceTableCell>
                            </WorkspaceTableRow>
                        );
                    })}
                </tbody>
            </WorkspaceTable>

            {selectedPosts.length > 0 && (
                <p className="px-1 text-[10px] text-[var(--workspace-text-muted)]">
                    {selectedPosts.length} post
                    {selectedPosts.length === 1 ? "" : "s"}{" "}
                    selected
                </p>
            )}
        </div>
    );
}