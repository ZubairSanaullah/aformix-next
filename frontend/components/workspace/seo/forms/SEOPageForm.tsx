"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler, type FieldError } from "react-hook-form";
import { Save, Trash2 } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceFormField from "@/components/workspace/ui/WorkspaceFormField";
import WorkspaceInput from "@/components/workspace/ui/WorkspaceInput";
import WorkspaceTextarea from "@/components/workspace/ui/WorkspaceTextarea";

import SEOKeywordsField from "./SEOKeywordsField";
import SEOCharacterCount from "@/components/workspace/seo/shared/SEOCharacterCount";
import SEOLiveAnalysisPanel from "@/components/workspace/seo/analysis/SEOLiveAnalysisPanel";
import SEOMetadataPreviewPanel from "@/components/workspace/seo/preview/SEOMetadataPreviewPanel";
import { getSEOPreviewUrlParts } from "@/components/workspace/seo/shared/seo-preview-url";

import { seoPageSchema, SEO_LIMITS, type SEOPageInput } from "@/lib/validations/seo";

const EMPTY_SEO_PAGE_VALUES: SEOPageInput = {
    path: "",
    title: "",
    description: "",
    keywords: [],
    canonicalUrl: "",
    noIndex: false,
    noFollow: false,
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
};

interface SEOPageFormProps {
    mode: "create" | "edit";
    defaultValues?: Partial<SEOPageInput>;
    onSubmit: SubmitHandler<SEOPageInput>;
    onDelete?: () => void;
    isDeleting?: boolean;
    /** Existing page id, when editing — links the live panel to the full analysis screen. */
    pageId?: string;
}

export default function SEOPageForm({
    mode,
    defaultValues,
    onSubmit,
    onDelete,
    isDeleting,
    pageId,
}: SEOPageFormProps) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SEOPageInput>({
        resolver: zodResolver(seoPageSchema) as any,
        defaultValues: {
            ...EMPTY_SEO_PAGE_VALUES,
            ...defaultValues,
        } as SEOPageInput,
    });

    const watchedValues = watch();

    const { url: previewUrl, domain: previewDomain } = getSEOPreviewUrlParts(
        watchedValues.canonicalUrl ?? "",
        watchedValues.path ?? "/"
    );

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <form
                id={
                    mode === "create"
                        ? "create-seo-page-form"
                        : "edit-seo-page-form"
                }
                onSubmit={handleSubmit(onSubmit as SubmitHandler<SEOPageInput>)}
                className="space-y-5 lg:col-span-2"
            >
                <WorkspaceCard padding="lg" className="space-y-5">
                    <div>
                        <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Page Details
                        </h2>
                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            Core identity for this page&apos;s search presence.
                        </p>
                    </div>

                    <WorkspaceFormField
                        label="Path"
                        required
                        error={errors.path?.message}
                    >
                        <WorkspaceInput
                            placeholder="/about"
                            disabled={mode === "edit"}
                            {...register("path")}
                        />
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="SEO Title"
                        error={errors.title?.message}
                    >
                        <WorkspaceInput
                            placeholder="A clear, descriptive page title..."
                            {...register("title")}
                        />
                        <div className="mt-1 flex justify-end text-[11px]">
                            <SEOCharacterCount
                                value={watchedValues.title ?? ""}
                                min={SEO_LIMITS.title.recommendedMin}
                                max={SEO_LIMITS.title.max}
                            />
                        </div>
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="Meta Description"
                        error={errors.description?.message}
                    >
                        <WorkspaceTextarea
                            rows={3}
                            placeholder="A concise summary that encourages clicks from search results..."
                            {...register("description")}
                        />
                        <div className="mt-1 flex justify-end text-[11px]">
                            <SEOCharacterCount
                                value={watchedValues.description ?? ""}
                                min={SEO_LIMITS.description.recommendedMin}
                                max={SEO_LIMITS.description.max}
                            />
                        </div>
                    </WorkspaceFormField>

                    <SEOKeywordsField
                        control={control}
                        error={errors.keywords as FieldError | undefined}
                    />
                </WorkspaceCard>

                <WorkspaceCard padding="lg" className="space-y-5">
                    <div>
                        <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Canonical &amp; Robots
                        </h2>
                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            Control how search engines crawl and index this
                            page.
                        </p>
                    </div>

                    <WorkspaceFormField
                        label="Canonical URL"
                        error={errors.canonicalUrl?.message}
                    >
                        <WorkspaceInput
                            placeholder="https://example.com/about"
                            {...register("canonicalUrl")}
                        />
                    </WorkspaceFormField>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-[var(--workspace-text)]">
                            <input
                                type="checkbox"
                                {...register("noIndex")}
                                className="h-3.5 w-3.5 accent-[var(--workspace-primary)]"
                            />
                            Prevent indexing (noindex)
                        </label>

                        <label className="flex items-center gap-2 text-xs font-medium text-[var(--workspace-text)]">
                            <input
                                type="checkbox"
                                {...register("noFollow")}
                                className="h-3.5 w-3.5 accent-[var(--workspace-primary)]"
                            />
                            Prevent following links (nofollow)
                        </label>
                    </div>
                </WorkspaceCard>

                <WorkspaceCard padding="lg" className="space-y-5">
                    <div>
                        <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Open Graph
                        </h2>
                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            Controls how this page appears when shared on
                            social platforms.
                        </p>
                    </div>

                    <WorkspaceFormField
                        label="OG Title"
                        error={errors.ogTitle?.message}
                    >
                        <WorkspaceInput
                            placeholder="Falls back to SEO title if left blank"
                            {...register("ogTitle")}
                        />
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="OG Description"
                        error={errors.ogDescription?.message}
                    >
                        <WorkspaceTextarea
                            rows={2}
                            placeholder="Falls back to meta description if left blank"
                            {...register("ogDescription")}
                        />
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="OG Image URL"
                        error={errors.ogImage?.message}
                    >
                        <WorkspaceInput
                            placeholder="https://example.com/og-image.png or /og-image.png"
                            {...register("ogImage")}
                        />
                    </WorkspaceFormField>
                </WorkspaceCard>

                <div className="flex items-center justify-between gap-3 border-t border-[var(--workspace-border)] pt-5">
                    {mode === "edit" && onDelete ? (
                        <WorkspaceButton
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={onDelete}
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            {isDeleting ? "Deleting..." : "Delete Page"}
                        </WorkspaceButton>
                    ) : (
                        <span />
                    )}

                    <WorkspaceButton
                        type="submit"
                        size="sm"
                        disabled={isSubmitting}
                    >
                        <Save className="h-3.5 w-3.5" />
                        {isSubmitting
                            ? "Saving..."
                            : mode === "create"
                                ? "Create SEO Page"
                                : "Update SEO Page"}
                    </WorkspaceButton>
                </div>
            </form>

            <div className="space-y-6">
                <SEOLiveAnalysisPanel
                    title={watchedValues.title ?? ""}
                    description={watchedValues.description ?? ""}
                    canonicalUrl={watchedValues.canonicalUrl ?? ""}
                    noIndex={watchedValues.noIndex ?? false}
                    noFollow={watchedValues.noFollow ?? false}
                    ogTitle={watchedValues.ogTitle ?? ""}
                    ogDescription={watchedValues.ogDescription ?? ""}
                    ogImage={watchedValues.ogImage ?? ""}
                    pageId={pageId}
                />

                <SEOMetadataPreviewPanel
                    title={watchedValues.title ?? ""}
                    description={watchedValues.description ?? ""}
                    url={previewUrl}
                    ogTitle={watchedValues.ogTitle ?? ""}
                    ogDescription={watchedValues.ogDescription ?? ""}
                    ogImage={watchedValues.ogImage ?? ""}
                    domain={previewDomain}
                />
            </div>
        </div>
    );
}
