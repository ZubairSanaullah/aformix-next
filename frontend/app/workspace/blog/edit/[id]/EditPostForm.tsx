"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PostForm from "@/components/workspace/blog/PostForm";
import type { PostInput } from "@/lib/validations/post";

interface EditPostFormProps {
    post: {
        id: string;
        title: string;
        excerpt: string | null;
        content: string;
        seoTitle: string | null;
        seoDescription: string | null;

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
            const response = await fetch(`/api/posts/${post.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to update post.");
                return;
            }

            toast.success("Post updated successfully!");

            router.push("/workspace/blog");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    }

    return (
        <PostForm
            mode="edit"
            categories={categories}
            tags={tags}
            defaultValues={{
                title: post.title,
                excerpt: post.excerpt ?? "",
                content: post.content,
                categoryId: post.category?.id ?? "",
                tagIds: post.tags.map((tag) => tag.id),
                seoTitle: post.seoTitle ?? "",
                seoDescription: post.seoDescription ?? "",
            }}
            onSubmit={onSubmit}
        />
    );
}