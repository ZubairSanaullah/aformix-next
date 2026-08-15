"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    WorkspaceButton,
    WorkspaceCard,
    WorkspaceInput,
    WorkspaceSelect,
    WorkspaceTextarea,
} from "@/components/workspace/ui";

import Editor from "@/components/workspace/editor/Editor";

import { slugify } from "./slugify";
import type {
    KnowledgeArticleDetail,
    KnowledgeArticleStatus,
    KnowledgeArticleVisibility,
    KnowledgeCategorySummary,
} from "./types";

interface KnowledgeArticleFormProps {
    article?: KnowledgeArticleDetail;
    categories: KnowledgeCategorySummary[];
}

function toDateTimeLocalValue(date: string | Date | null) {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return "";

    const pad = (n: number) => String(n).padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function KnowledgeArticleForm({
    article,
    categories,
}: KnowledgeArticleFormProps) {
    const router = useRouter();

    const isEditing = Boolean(article);

    /*
     * ---------------------------------------------------------
     * Form State
     * ---------------------------------------------------------
     */

    const [title, setTitle] = useState(article?.title ?? "");
    const [slug, setSlug] = useState(article?.slug ?? "");
    const [slugTouched, setSlugTouched] = useState(isEditing);

    const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
    const [content, setContent] = useState(article?.content ?? "");

    const [categoryId, setCategoryId] = useState(
        article?.categoryId ?? categories[0]?.id ?? ""
    );

    const [status, setStatus] = useState<KnowledgeArticleStatus>(
        article?.status ?? "DRAFT"
    );

    const [visibility, setVisibility] =
        useState<KnowledgeArticleVisibility>(
            article?.visibility ?? "INTERNAL"
        );

    const [featured, setFeatured] = useState(article?.featured ?? false);

    const [sortOrder, setSortOrder] = useState(article?.sortOrder ?? 0);

    const [publishedAt, setPublishedAt] = useState(() =>
        toDateTimeLocalValue(article?.publishedAt ?? null)
    );

    const [metaTitle, setMetaTitle] = useState(article?.metaTitle ?? "");
    const [metaDescription, setMetaDescription] = useState(
        article?.metaDescription ?? ""
    );
    const [canonicalUrl, setCanonicalUrl] = useState(
        article?.canonicalUrl ?? ""
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleTitleChange(value: string) {
        setTitle(value);

        if (!slugTouched) {
            setSlug(slugify(value));
        }
    }

    /*
     * ---------------------------------------------------------
     * Submit
     * ---------------------------------------------------------
     */

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (isSubmitting) return;

        setError(null);

        const trimmedTitle = title.trim();
        const trimmedSlug = slug.trim();
        const plainTextContent = content.replace(/<[^>]*>/g, "").trim();

        if (!trimmedTitle) {
            setError("Article title is required.");
            return;
        }

        if (!trimmedSlug) {
            setError("Slug is required.");
            return;
        }

        if (!categoryId) {
            setError("Please choose a category.");
            return;
        }

        if (!plainTextContent) {
            setError("Article content is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                title: trimmedTitle,
                slug: trimmedSlug,
                excerpt: excerpt.trim() || null,
                content,
                categoryId,
                status,
                visibility,
                featured,
                sortOrder,
                publishedAt: publishedAt
                    ? new Date(publishedAt).toISOString()
                    : null,
                metaTitle: metaTitle.trim() || null,
                metaDescription: metaDescription.trim() || null,
                canonicalUrl: canonicalUrl.trim() || null,
            };

            const response = await fetch(
                isEditing
                    ? `/api/knowledge/articles/${article!.id}`
                    : "/api/knowledge/articles",
                {
                    method: isEditing ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                        `Unable to ${isEditing ? "update" : "create"} article.`
                );
            }

            toast.success(
                isEditing
                    ? "Article updated successfully."
                    : "Article created successfully."
            );

            const savedId = isEditing ? article!.id : data?.article?.id;

            if (savedId) {
                router.push(`/workspace/knowledge/articles/${savedId}`);
            } else {
                router.push("/workspace/knowledge");
            }

            router.refresh();
        } catch (submitError) {
            console.error(
                "Knowledge article form submission failed:",
                submitError
            );

            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Something went wrong while saving the article."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    const metaDescriptionCount = metaDescription.trim().length;

    /*
     * ---------------------------------------------------------
     * Render
     * ---------------------------------------------------------
     */

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-800">
                        Unable to save article
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {categories.length === 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-xs leading-5 text-amber-800">
                        You don&apos;t have any categories yet.{" "}
                        <a
                            href="/workspace/knowledge/categories"
                            className="font-medium underline"
                        >
                            Create one first
                        </a>{" "}
                        so this article has somewhere to live.
                    </p>
                </div>
            )}

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <WorkspaceCard padding="lg">
                <div className="mb-5">
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Basic Information
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        The title, URL, and short summary for this article.
                    </p>
                </div>

                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="article-title"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Title
                        </label>

                        <WorkspaceInput
                            id="article-title"
                            value={title}
                            onChange={(event) =>
                                handleTitleChange(event.target.value)
                            }
                            placeholder="How to reset your password"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="article-slug"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Slug
                        </label>

                        <WorkspaceInput
                            id="article-slug"
                            value={slug}
                            onChange={(event) => {
                                setSlugTouched(true);
                                setSlug(event.target.value);
                            }}
                            placeholder="how-to-reset-your-password"
                            disabled={isSubmitting}
                            required
                        />

                        <p className="mt-1 text-[10px] text-[var(--workspace-text-subtle)]">
                            Lowercase letters, numbers, and hyphens only.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="article-excerpt"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Excerpt
                        </label>

                        <WorkspaceTextarea
                            id="article-excerpt"
                            value={excerpt}
                            onChange={(event) =>
                                setExcerpt(event.target.value)
                            }
                            placeholder="A one or two sentence summary shown in article lists and search results."
                            disabled={isSubmitting}
                            rows={3}
                        />
                    </div>
                </div>
            </WorkspaceCard>

            {/* =================================================
                CONTENT
            ================================================= */}

            <WorkspaceCard padding="lg">
                <div className="mb-5">
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Content
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Write the article body. Drag and drop or paste
                        images directly into the editor.
                    </p>
                </div>

                <Editor
                    value={content}
                    onChange={setContent}
                    placeholder="Start writing your article..."
                    editable={!isSubmitting}
                />
            </WorkspaceCard>

            {/* =================================================
                PUBLISHING SETTINGS
            ================================================= */}

            <WorkspaceCard padding="lg">
                <div className="mb-5">
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Publishing Settings
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Category, status, and where this article can be
                        seen.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="article-category"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Category
                        </label>

                        <WorkspaceSelect
                            id="article-category"
                            value={categoryId}
                            onChange={(event) =>
                                setCategoryId(event.target.value)
                            }
                            disabled={
                                isSubmitting || categories.length === 0
                            }
                            required
                        >
                            <option value="" disabled>
                                Select a category
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </WorkspaceSelect>
                    </div>

                    <div>
                        <label
                            htmlFor="article-status"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Status
                        </label>

                        <WorkspaceSelect
                            id="article-status"
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target
                                        .value as KnowledgeArticleStatus
                                )
                            }
                            disabled={isSubmitting}
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </WorkspaceSelect>
                    </div>

                    <div>
                        <label
                            htmlFor="article-visibility"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Visibility
                        </label>

                        <WorkspaceSelect
                            id="article-visibility"
                            value={visibility}
                            onChange={(event) =>
                                setVisibility(
                                    event.target
                                        .value as KnowledgeArticleVisibility
                                )
                            }
                            disabled={isSubmitting}
                        >
                            <option value="INTERNAL">
                                Internal (Workspace only)
                            </option>
                            <option value="PUBLIC">
                                Public (Help Center)
                            </option>
                        </WorkspaceSelect>
                    </div>

                    <div>
                        <label
                            htmlFor="article-sort-order"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Sort order
                        </label>

                        <WorkspaceInput
                            id="article-sort-order"
                            type="number"
                            min={0}
                            value={sortOrder}
                            onChange={(event) =>
                                setSortOrder(Number(event.target.value))
                            }
                            disabled={isSubmitting}
                        />
                    </div>

                    {status === "PUBLISHED" && (
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="article-published-at"
                                className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                            >
                                Published date
                            </label>

                            <WorkspaceInput
                                id="article-published-at"
                                type="datetime-local"
                                value={publishedAt}
                                onChange={(event) =>
                                    setPublishedAt(event.target.value)
                                }
                                disabled={isSubmitting}
                            />

                            <p className="mt-1 text-[10px] text-[var(--workspace-text-subtle)]">
                                Leave blank to publish immediately.
                            </p>
                        </div>
                    )}

                    <div className="sm:col-span-2">
                        <label className="flex select-none items-center gap-2 text-xs font-medium text-[var(--workspace-text)]">
                            <input
                                type="checkbox"
                                checked={featured}
                                onChange={(event) =>
                                    setFeatured(event.target.checked)
                                }
                                disabled={isSubmitting}
                                className="h-3.5 w-3.5 rounded border-[var(--workspace-border-strong)] text-[var(--workspace-primary)] focus:ring-[var(--workspace-primary)]/30"
                            />
                            Feature this article
                        </label>

                        <p className="mt-1 pl-[22px] text-[10px] text-[var(--workspace-text-subtle)]">
                            Featured articles can be highlighted in the
                            knowledge base and future recommended-content
                            surfaces.
                        </p>
                    </div>
                </div>
            </WorkspaceCard>

            {/* =================================================
                SEO
            ================================================= */}

            <WorkspaceCard padding="lg">
                <div className="mb-5">
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        SEO
                    </h2>

                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Optional overrides for how this article appears in
                        search results.
                    </p>
                </div>

                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="article-meta-title"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Meta title
                        </label>

                        <WorkspaceInput
                            id="article-meta-title"
                            value={metaTitle}
                            onChange={(event) =>
                                setMetaTitle(event.target.value)
                            }
                            placeholder={title || "Defaults to the article title"}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="article-meta-description"
                            className="mb-1.5 flex items-center justify-between text-xs font-medium text-[var(--workspace-text)]"
                        >
                            <span>Meta description</span>
                            <span className="font-normal text-[var(--workspace-text-subtle)]">
                                {metaDescriptionCount}/320
                            </span>
                        </label>

                        <WorkspaceTextarea
                            id="article-meta-description"
                            value={metaDescription}
                            onChange={(event) =>
                                setMetaDescription(
                                    event.target.value.slice(0, 320)
                                )
                            }
                            placeholder={
                                excerpt || "Defaults to the article excerpt"
                            }
                            disabled={isSubmitting}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="article-canonical-url"
                            className="mb-1.5 block text-xs font-medium text-[var(--workspace-text)]"
                        >
                            Canonical URL
                        </label>

                        <WorkspaceInput
                            id="article-canonical-url"
                            type="url"
                            value={canonicalUrl}
                            onChange={(event) =>
                                setCanonicalUrl(event.target.value)
                            }
                            placeholder="https://help.aformix.com/..."
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </WorkspaceCard>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex items-center justify-end gap-3 border-t border-[var(--workspace-border)] pt-5">
                <WorkspaceButton
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={() => router.back()}
                >
                    Cancel
                </WorkspaceButton>

                <WorkspaceButton
                    type="submit"
                    disabled={
                        isSubmitting ||
                        !title.trim() ||
                        !slug.trim() ||
                        !categoryId
                    }
                >
                    {isSubmitting
                        ? "Saving..."
                        : isEditing
                          ? "Save Changes"
                          : "Create Article"}
                </WorkspaceButton>
            </div>
        </form>
    );
}
