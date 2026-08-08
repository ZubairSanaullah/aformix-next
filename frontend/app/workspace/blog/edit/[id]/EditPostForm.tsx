"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import PostForm from "@/components/workspace/blog/PostForm";
import type { PostInput } from "@/lib/validations/post";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspacePageActions from "@/components/workspace/ui/WorkspacePageActions";

import RevisionHistoryPanel from "@/components/workspace/blog/RevisionHistoryPanel";
import PublishingPanel from "@/components/workspace/blog/PublishingPanel";
import SeoAnalyzerPanel from "@/components/workspace/blog/SeoAnalyzerPanel";

interface EditPostFormProps {
    post: {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        seoTitle: string | null;
        seoDescription: string | null;
        featuredImage: string | null;
        status: "DRAFT" | "PUBLISHED" | "ARCHIVED";

        category: {
            id: string;
            name: string;
        } | null;

        tags: {
            id: string;
            name: string;
        }[];
    };

    categories: {
        id: string;
        name: string;
    }[];

    tags: {
        id: string;
        name: string;
    }[];
}

export default function EditPostForm({
    post,
    categories,
    tags,
}: EditPostFormProps) {
    const router = useRouter();

    async function onSubmit(data: PostInput) {
        try {
            const response = await fetch(
                `/api/posts/${post.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(
                    result.message ||
                    "Failed to update post."
                );
                return;
            }

            toast.success(
                "Post updated successfully."
            );

            router.push("/workspace/blog");
            router.refresh();
        } catch (error) {
            console.error(error);

            toast.error(
                "Something went wrong."
            );
        }
    }

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Edit Post"
                description="Update, optimize, and manage your blog content."
                breadcrumbs={[
                    {
                        label: "Workspace",
                        href: "/workspace",
                    },
                    {
                        label: "Blog",
                        href: "/workspace/blog",
                    },
                    {
                        label: "Edit Post",
                    },
                ]}
                actions={
                    <WorkspacePageActions>
                        <WorkspaceButton
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                router.push(
                                    "/workspace/blog"
                                )
                            }
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Blog
                        </WorkspaceButton>
                    </WorkspacePageActions>
                }
            />

            <PostForm
                mode="edit"
                postId={post.id}
                categories={categories}
                tags={tags}
                defaultValues={{
                    title: post.title,
                    excerpt: post.excerpt ?? "",
                    content: post.content,
                    categoryId:
                        post.category?.id ?? "",
                    tagIds: post.tags.map(
                        (tag) => tag.id
                    ),
                    seoTitle:
                        post.seoTitle ?? "",
                    seoDescription:
                        post.seoDescription ?? "",
                    featuredImage:
                        post.featuredImage ?? null,
                }}
                onSubmit={onSubmit}
                renderWrapper={(
                    formElement,
                    values
                ) => (
                    <div className="space-y-6">
                        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                            <div className="min-w-0">
                                {formElement}
                            </div>

                            <aside className="min-w-0 space-y-4 xl:sticky xl:top-6 xl:self-start">
                                <PublishingPanel
                                    postId={post.id}
                                    status={
                                        post.status
                                    }
                                />

                                <SeoAnalyzerPanel
                                    title={
                                        values.title
                                    }
                                    seoTitle={
                                        values.seoTitle
                                    }
                                    seoDescription={
                                        values.seoDescription
                                    }
                                    content={
                                        values.content
                                    }
                                    slug={
                                        post.slug
                                    }
                                />

                                <RevisionHistoryPanel
                                    postId={post.id}
                                />
                            </aside>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}