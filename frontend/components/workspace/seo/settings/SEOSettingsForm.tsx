"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Save } from "lucide-react";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceFormField from "@/components/workspace/ui/WorkspaceFormField";
import WorkspaceInput from "@/components/workspace/ui/WorkspaceInput";
import WorkspaceTextarea from "@/components/workspace/ui/WorkspaceTextarea";
import WorkspaceSelect from "@/components/workspace/ui/WorkspaceSelect";

import SEOCharacterCount from "@/components/workspace/seo/shared/SEOCharacterCount";
import SEOMetadataPreviewPanel from "@/components/workspace/seo/preview/SEOMetadataPreviewPanel";
import { getSEOPreviewUrlParts } from "@/components/workspace/seo/shared/seo-preview-url";

import {
    seoSettingsSchema,
    SEO_LIMITS,
    seoRobotsIndexValues,
    seoRobotsFollowValues,
    type SEOSettingsInput,
} from "@/lib/validations/seo";

const ROBOTS_INDEX_LABELS: Record<string, string> = {
    INDEX: "Allow indexing (default)",
    NOINDEX: "Prevent indexing (noindex)",
};

const ROBOTS_FOLLOW_LABELS: Record<string, string> = {
    FOLLOW: "Allow following links (default)",
    NOFOLLOW: "Prevent following links (nofollow)",
};

const EMPTY_SEO_SETTINGS_VALUES: SEOSettingsInput = {
    siteTitle: "",
    siteDescription: "",
    canonicalUrl: "",
    defaultOgImage: "",
    twitterHandle: "",
    defaultRobotsIndex: "INDEX",
    defaultRobotsFollow: "FOLLOW",
};

interface SEOSettingsFormProps {
    defaultValues?: Partial<SEOSettingsInput>;
    onSubmit: SubmitHandler<SEOSettingsInput>;
    isNew?: boolean;
}

export default function SEOSettingsForm({
    defaultValues,
    onSubmit,
    isNew,
}: SEOSettingsFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SEOSettingsInput>({
        resolver: zodResolver(seoSettingsSchema) as any,
        defaultValues: {
            ...EMPTY_SEO_SETTINGS_VALUES,
            ...defaultValues,
        } as SEOSettingsInput,
    });

    const watchedValues = watch();

    // Settings represent the site root — always preview against "/".
    const { url: previewUrl, domain: previewDomain } = getSEOPreviewUrlParts(
        watchedValues.canonicalUrl ?? "",
        "/"
    );

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <form
                id="seo-settings-form"
                onSubmit={handleSubmit(onSubmit as SubmitHandler<SEOSettingsInput>)}
                className="space-y-5 lg:col-span-2"
            >
                {isNew && (
                    <div className="rounded-xl border border-[var(--workspace-info)]/30 bg-[var(--workspace-info)]/5 p-4 text-xs leading-5 text-[var(--workspace-text)]">
                        Site-wide SEO settings haven&apos;t been saved yet. Fill
                        these in and save to set defaults used when an
                        individual page doesn&apos;t define its own metadata.
                    </div>
                )}

                <WorkspaceCard padding="lg" className="space-y-5">
                    <div>
                        <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Site Identity
                        </h2>
                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            Fallback metadata used when a page doesn&apos;t
                            define its own.
                        </p>
                    </div>

                    <WorkspaceFormField
                        label="Site Title"
                        error={errors.siteTitle?.message}
                    >
                        <WorkspaceInput
                            placeholder="Aformix"
                            {...register("siteTitle")}
                        />
                        <div className="mt-1 flex justify-end text-[11px]">
                            <SEOCharacterCount
                                value={watchedValues.siteTitle ?? ""}
                                min={SEO_LIMITS.title.recommendedMin}
                                max={SEO_LIMITS.title.max}
                            />
                        </div>
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="Site Description"
                        error={errors.siteDescription?.message}
                    >
                        <WorkspaceTextarea
                            rows={3}
                            placeholder="A short description of your site..."
                            {...register("siteDescription")}
                        />
                        <div className="mt-1 flex justify-end text-[11px]">
                            <SEOCharacterCount
                                value={watchedValues.siteDescription ?? ""}
                                min={SEO_LIMITS.description.recommendedMin}
                                max={SEO_LIMITS.description.max}
                            />
                        </div>
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="Canonical URL"
                        error={errors.canonicalUrl?.message}
                    >
                        <WorkspaceInput
                            placeholder="https://example.com"
                            {...register("canonicalUrl")}
                        />
                    </WorkspaceFormField>
                </WorkspaceCard>

                <WorkspaceCard padding="lg" className="space-y-5">
                    <div>
                        <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Social Sharing
                        </h2>
                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            Default appearance when your site is shared on
                            social platforms.
                        </p>
                    </div>

                    <WorkspaceFormField
                        label="Default OG Image"
                        error={errors.defaultOgImage?.message}
                    >
                        <WorkspaceInput
                            placeholder="https://example.com/og-image.png or /og-image.png"
                            {...register("defaultOgImage")}
                        />
                    </WorkspaceFormField>

                    <WorkspaceFormField
                        label="Twitter / X Handle"
                        error={errors.twitterHandle?.message}
                    >
                        <WorkspaceInput
                            placeholder="@aformix"
                            {...register("twitterHandle")}
                        />
                    </WorkspaceFormField>
                </WorkspaceCard>

                <WorkspaceCard padding="lg" className="space-y-5">
                    <div>
                        <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Default Robots
                        </h2>
                        <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                            Applied to pages that don&apos;t set their own
                            robots directives.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <WorkspaceFormField
                            label="Indexing"
                            error={errors.defaultRobotsIndex?.message}
                        >
                            <WorkspaceSelect {...register("defaultRobotsIndex")}>
                                {seoRobotsIndexValues.map((value) => (
                                    <option key={value} value={value}>
                                        {ROBOTS_INDEX_LABELS[value]}
                                    </option>
                                ))}
                            </WorkspaceSelect>
                        </WorkspaceFormField>

                        <WorkspaceFormField
                            label="Link Following"
                            error={errors.defaultRobotsFollow?.message}
                        >
                            <WorkspaceSelect {...register("defaultRobotsFollow")}>
                                {seoRobotsFollowValues.map((value) => (
                                    <option key={value} value={value}>
                                        {ROBOTS_FOLLOW_LABELS[value]}
                                    </option>
                                ))}
                            </WorkspaceSelect>
                        </WorkspaceFormField>
                    </div>
                </WorkspaceCard>

                <div className="flex items-center justify-end gap-3 border-t border-[var(--workspace-border)] pt-5">
                    <WorkspaceButton type="submit" size="sm" disabled={isSubmitting}>
                        <Save className="h-3.5 w-3.5" />
                        {isSubmitting ? "Saving..." : "Save Settings"}
                    </WorkspaceButton>
                </div>
            </form>

            <SEOMetadataPreviewPanel
                title={watchedValues.siteTitle ?? ""}
                description={watchedValues.siteDescription ?? ""}
                url={previewUrl}
                ogTitle={watchedValues.siteTitle ?? ""}
                ogDescription={watchedValues.siteDescription ?? ""}
                ogImage={watchedValues.defaultOgImage ?? ""}
                domain={previewDomain}
            />
        </div>
    );
}
