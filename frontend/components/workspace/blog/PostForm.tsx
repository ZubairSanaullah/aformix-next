"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useCallback } from "react";
import type { ReactNode } from "react";

import { useAutosave } from "@/hooks/useAutosave";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Editor from "@/components/workspace/editor/Editor";
import EditorStatusBar from "@/components/workspace/blog/EditorStatusBar";
import { calculateWordCount } from "@/lib/blog/word-count";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import FeaturedImagePanel from "@/components/workspace/blog/FeaturedImagePanel";

import {
    postSchema,
    type PostInput,
} from "@/lib/validations/post";


interface Category {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

interface PostFormProps {
    mode: "create" | "edit";

    postId?: string;

    categories: Category[];

    tags: Tag[];

    defaultValues?: Partial<PostInput>;

    onSubmit: SubmitHandler<PostInput>;

    children?: (values: PostInput) => React.ReactNode;

    renderWrapper?: (formElement: React.ReactNode, values: PostInput) => React.ReactNode;
}

const EMPTY_VALUES: PostInput = {
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tagIds: [],
    seoTitle: "",
    seoDescription: "",
    featuredImage: null,
};

export default function PostForm({
    mode,
    postId,
    categories,
    tags,
    defaultValues,
    onSubmit,
    children,
    renderWrapper,
}: PostFormProps) {

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<PostInput>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            ...EMPTY_VALUES,
            ...defaultValues,
        },
    });

    const values = watch();

    const wordCount = calculateWordCount(
        values.content
    );

    const readingTime = calculateReadingTime(
        values.content
    );

    const autosave = useCallback(
        async (data: PostInput) => {
            if (!postId) return;

            const response = await fetch(
                `/api/posts/${postId}/autosave`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error("Autosave failed");
            }
        },
        [postId]
    );

    const {
        status: autosaveStatus,
        timeAgo,
        isDirty,
    } = useAutosave({
        enabled: mode === "edit" && !!postId,
        values,
        onSave: autosave,
    });

    useUnsavedChanges(isDirty);

    useNavigationGuard(isDirty);

    const formElement = (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            {typeof children === "function"
                ? children(values)
                : children}
            <div>
                {mode === "edit" && (
                    <EditorStatusBar
                        status={autosaveStatus}
                        timeAgo={timeAgo}
                        wordCount={wordCount}
                        readingTime={readingTime}
                    />
                )}
            </div>

            {/* Title */}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Title
                </label>

                <Input
                    placeholder="Post title..."
                    {...register("title")}
                />

                {errors.title && (
                    <p className="text-sm text-red-500">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Category */}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Category
                </label>

                <select
                    {...register("categoryId")}
                    className="w-full rounded-lg border bg-background px-3 py-2"
                >
                    <option value="">
                        Select category
                    </option>

                    {categories.map(
                        (category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        )
                    )}
                </select>

                {errors.categoryId && (
                    <p className="text-sm text-red-500">
                        {
                            errors.categoryId
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Tags */}

            <div className="space-y-3">
                <label className="text-sm font-medium">
                    Tags
                </label>

                <div className="grid grid-cols-2 gap-3 rounded-lg border p-4">
                    {tags.map((tag) => (
                        <label
                            key={tag.id}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="checkbox"
                                value={tag.id}
                                {...register(
                                    "tagIds"
                                )}
                            />

                            <span>
                                {tag.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Excerpt */}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Excerpt
                </label>

                <Textarea
                    rows={3}
                    {...register(
                        "excerpt"
                    )}
                />

                {errors.excerpt && (
                    <p className="text-sm text-red-500">
                        {
                            errors.excerpt
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Content */}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Content
                </label>

                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Editor
                                value={field.value}
                                onChange={field.onChange}
                            />

                            {mode === "edit" && (
                                <EditorStatusBar
                                    status={autosaveStatus}
                                    timeAgo={timeAgo}
                                />
                            )}
                        </>
                    )}
                />

                {errors.content && (
                    <p className="text-sm text-red-500">
                        {errors.content.message}
                    </p>
                )}
            </div>

            {/* Featured Image */}

            <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                    <FeaturedImagePanel
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />

            {/* SEO Title */}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    SEO Title
                </label>

                <Input
                    {...register(
                        "seoTitle"
                    )}
                />
            </div>

            {/* SEO Description */}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    SEO Description
                </label>

                <Textarea
                    rows={3}
                    {...register(
                        "seoDescription"
                    )}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
                {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                        ? "Create Post"
                        : "Update Post"}
            </button>
        </form>
    );

    if (renderWrapper) {
        return renderWrapper(formElement, values);
    }

    return formElement;
}