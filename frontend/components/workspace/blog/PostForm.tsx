"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Editor from "@/components/workspace/editor/Editor";

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

    categories: Category[];

    tags: Tag[];

    defaultValues?: Partial<PostInput>;

    onSubmit: SubmitHandler<PostInput>;
}

const EMPTY_VALUES: PostInput = {
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tagIds: [],
    seoTitle: "",
    seoDescription: "",
};

export default function PostForm({
    mode,
    categories,
    tags,
    defaultValues,
    onSubmit,
}: PostFormProps) {
    const {
        register,
        control,
        handleSubmit,
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

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-xl border bg-card p-6"
        >
            <div>
                <h2 className="text-2xl font-semibold">
                    {mode === "create"
                        ? "Create Post"
                        : "Edit Post"}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    {mode === "create"
                        ? "Create a new blog post."
                        : "Update your blog post."}
                </p>
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
                        <Editor
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
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
}