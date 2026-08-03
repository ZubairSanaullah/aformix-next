"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import PostForm from "@/components/workspace/blog/PostForm";
import type { PostInput } from "@/lib/validations/post";

export default function CreatePostPage() {
    const router = useRouter();

    const onSubmit = async (data: PostInput) => {
        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to create post.");
                return;
            }

            toast.success("Post created successfully!");

            router.push("/workspace/blog");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Create New Post
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Write and publish a new blog post.
                </p>
            </div>

            <PostForm
                mode="create"
                onSubmit={onSubmit}
            />
        </div>
    );
}