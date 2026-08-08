"use client";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    Controller,
    SubmitHandler,
    useForm,
} from "react-hook-form";

import { useCallback } from "react";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import Editor from "@/components/workspace/editor/Editor";
import EditorStatusBar from "@/components/workspace/blog/EditorStatusBar";
import FeaturedImagePanel from "@/components/workspace/blog/FeaturedImagePanel";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import { useAutosave } from "@/hooks/useAutosave";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";

import { calculateWordCount } from "@/lib/blog/word-count";
import { calculateReadingTime } from "@/lib/blog/reading-time";

import {
    postSchema,
    type PostInput,
} from "@/lib/validations/post";
import { Save } from "lucide-react";

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

    children?: (
        values: PostInput
    ) => React.ReactNode;

    renderWrapper?: (
        formElement: React.ReactNode,
        values: PostInput
    ) => React.ReactNode;
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

    const wordCount =
        calculateWordCount(values.content);

    const readingTime =
        calculateReadingTime(values.content);

    const autosave = useCallback(
        async (data: PostInput) => {
            if (!postId) return;

            const response = await fetch(
                `/api/posts/${postId}/autosave`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Autosave failed"
                );
            }
        },
        [postId]
    );

    const {
        status: autosaveStatus,
        timeAgo,
        isDirty,
    } = useAutosave({
        enabled:
            mode === "edit" &&
            !!postId,
        values,
        onSave: autosave,
    });

    useUnsavedChanges(isDirty);
    useNavigationGuard(isDirty);

    const formElement = (
        <form
            id={mode === "create" ? "create-post-form" : undefined}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {children &&
                typeof children ===
                "function" &&
                children(values)}

            {/* Editor status */}
            {mode === "edit" && (
                <EditorStatusBar
                    status={autosaveStatus}
                    timeAgo={timeAgo}
                    wordCount={wordCount}
                    readingTime={readingTime}
                />
            )}

            {/* Basic Information */}
            <WorkspaceCard
                padding="lg"
                className="space-y-6"
            >
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Post Details
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Define the core information
                        for this post.
                    </p>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Title
                        </label>

                        <Input
                            placeholder="Enter post title..."
                            {...register("title")}
                        />

                        {errors.title && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .title
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[var(--workspace-text)]">
                                Category
                            </label>

                            <select
                                {...register(
                                    "categoryId"
                                )}
                                className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-sm text-[var(--workspace-text)] outline-none transition focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10"
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map(
                                    (
                                        category
                                    ) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            {errors.categoryId && (
                                <p className="text-xs text-red-500">
                                    {
                                        errors
                                            .categoryId
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[var(--workspace-text)]">
                                Tags
                            </label>

                            <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-2.5">
                                {tags.length >
                                    0 ? (
                                    tags.map(
                                        (
                                            tag
                                        ) => (
                                            <label
                                                key={
                                                    tag.id
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[var(--workspace-border)] px-2 py-1 text-[10px] text-[var(--workspace-text-muted)] transition hover:border-[var(--workspace-primary)]/30 hover:bg-[var(--workspace-primary-soft)]"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={
                                                        tag.id
                                                    }
                                                    {...register(
                                                        "tagIds"
                                                    )}
                                                    className="h-3 w-3 accent-[var(--workspace-primary)]"
                                                />

                                                {
                                                    tag.name
                                                }
                                            </label>
                                        )
                                    )
                                ) : (
                                    <span className="text-xs text-[var(--workspace-text-subtle)]">
                                        No tags
                                        available
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Excerpt
                        </label>

                        <Textarea
                            rows={3}
                            placeholder="Write a short summary of the post..."
                            {...register(
                                "excerpt"
                            )}
                        />

                        {errors.excerpt && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .excerpt
                                        .message
                                }
                            </p>
                        )}
                    </div>
                </div>
            </WorkspaceCard>

            {/* Content Editor */}
            <WorkspaceCard
                padding="lg"
                className="space-y-5"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Content
                        </h2>

                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            Write and format your
                            article content.
                        </p>
                    </div>

                    <div className="hidden shrink-0 items-center gap-3 text-[10px] text-[var(--workspace-text-subtle)] sm:flex">
                        <span>
                            {wordCount} words
                        </span>

                        <span>
                            {readingTime} min
                            read
                        </span>
                    </div>
                </div>

                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <div className="overflow-hidden rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                            <Editor
                                value={field.value}
                                onChange={
                                    field.onChange
                                }
                            />
                        </div>
                    )}
                />

                {errors.content && (
                    <p className="text-xs text-red-500">
                        {
                            errors.content
                                .message
                        }
                    </p>
                )}
            </WorkspaceCard>

            {/* Featured Image */}
            <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                    <FeaturedImagePanel
                        value={field.value}
                        onChange={
                            field.onChange
                        }
                    />
                )}
            />

            {/* SEO */}
            <WorkspaceCard
                padding="lg"
                className="space-y-5"
            >
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Search Engine Optimization
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Optimize how this post appears
                        in search engines.
                    </p>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            SEO Title
                        </label>

                        <Input
                            placeholder="SEO optimized title..."
                            {...register(
                                "seoTitle"
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            SEO Description
                        </label>

                        <Textarea
                            rows={4}
                            placeholder="Write a concise search description..."
                            {...register(
                                "seoDescription"
                            )}
                        />
                    </div>
                </div>
            </WorkspaceCard>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 border-t border-[var(--workspace-border)] pt-5">
                <WorkspaceButton
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                >
                    <Save className="h-3.5 w-3.5" />

                    {isSubmitting
                        ? "Saving..."
                        : mode ===
                            "create"
                            ? "Create Post"
                            : "Update Post"}
                </WorkspaceButton>
            </div>
        </form>
    );

    if (renderWrapper) {
        return renderWrapper(
            formElement,
            values
        );
    }

    return formElement;
}