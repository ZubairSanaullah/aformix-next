"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import {
    postSchema,
    type PostInput,
} from "@/lib/validations/post";

interface PostFormProps {
    mode: "create" | "edit";
    defaultValues?: Partial<PostInput>;
    onSubmit: (data: PostInput) => Promise<void>;
}

const EMPTY_VALUES: PostInput = {
    title: "",
    excerpt: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
};

export default function PostForm({
    mode,
    defaultValues,
    onSubmit,
}: PostFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PostInput>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            ...EMPTY_VALUES,
            ...defaultValues,
        },
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            <div>
                <h2 className="text-2xl font-semibold">
                    {mode === "create" ? "Create Post" : "Edit Post"}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    {mode === "create"
                        ? "Create a new blog post for Aformix."
                        : "Update your existing blog post."}
                </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Title
                </label>

                <Input
                    placeholder="Enter post title..."
                    {...register("title")}
                />

                {errors.title && (
                    <p className="text-sm text-red-500">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Excerpt
                </label>

                <Textarea
                    rows={3}
                    placeholder="Short summary..."
                    {...register("excerpt")}
                />

                {errors.excerpt && (
                    <p className="text-sm text-red-500">
                        {errors.excerpt.message}
                    </p>
                )}
            </div>

            {/* Content */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Content
                </label>

                <Textarea
                    rows={10}
                    placeholder="Write your article..."
                    {...register("content")}
                />

                {errors.content && (
                    <p className="text-sm text-red-500">
                        {errors.content.message}
                    </p>
                )}
            </div>

            {/* SEO Title */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    SEO Title
                </label>

                <Input
                    placeholder="Optional SEO title..."
                    {...register("seoTitle")}
                />

                {errors.seoTitle && (
                    <p className="text-sm text-red-500">
                        {errors.seoTitle.message}
                    </p>
                )}
            </div>

            {/* SEO Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    SEO Description
                </label>

                <Textarea
                    rows={3}
                    placeholder="Optional SEO description..."
                    {...register("seoDescription")}
                />

                {errors.seoDescription && (
                    <p className="text-sm text-red-500">
                        {errors.seoDescription.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                        ? "Create Post"
                        : "Update Post"}
            </button>
        </form>
    );
}