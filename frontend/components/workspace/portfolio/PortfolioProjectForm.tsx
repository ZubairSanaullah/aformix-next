"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save } from "lucide-react";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Editor from "@/components/workspace/editor/Editor";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import PortfolioFeaturedImagePanel from "./PortfolioFeaturedImagePanel";
import PortfolioGalleryPanel, { type GalleryImage } from "./PortfolioGalleryPanel";
import TechnologiesMultiSelect from "./TechnologiesMultiSelect";

import {
    portfolioProjectFormSchema,
    EMPTY_PORTFOLIO_PROJECT_FORM,
    type PortfolioProjectFormInput,
} from "@/lib/validations/portfolio-project-form";

import {
    createPortfolioProjectRequest,
    updatePortfolioProjectRequest,
    replacePortfolioProjectMediaRequest,
    type PortfolioProjectDetail,
    type PortfolioProjectFormPayload,
} from "@/lib/api/portfolio";

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

interface Category {
    id: string;
    name: string;
}

interface PortfolioProjectFormProps {
    mode: "create" | "edit";
    projectId?: string;
    categories: Category[];
    initialProject?: PortfolioProjectDetail;
}

function detailToFormValues(
    project?: PortfolioProjectDetail,
): PortfolioProjectFormInput {
    if (!project) return EMPTY_PORTFOLIO_PROJECT_FORM;

    return {
        title: project.title,
        slug: project.slug,
        excerpt: project.excerpt ?? "",
        description: project.description ?? "",
        content: project.content ?? "",
        status: project.status,
        visibility: project.visibility,
        featured: project.featured,
        clientName: project.clientName ?? "",
        clientIndustry: project.clientIndustry ?? "",
        projectUrl: project.projectUrl ?? "",
        repositoryUrl: project.repositoryUrl ?? "",
        startDate: project.startDate?.slice(0, 10) ?? "",
        completionDate: project.completionDate?.slice(0, 10) ?? "",
        categoryId: project.categoryId ?? "",
        technologyIds: project.technologies.map((t) => t.id),
        seoTitle: project.seoTitle ?? "",
        seoDescription: project.seoDescription ?? "",
        seoKeywords: project.seoKeywords ?? "",
        canonicalUrl: project.canonicalUrl ?? "",
    };
}

function detailToGalleryImages(project?: PortfolioProjectDetail): GalleryImage[] {
    if (!project) return [];

    return [...project.media]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => ({
            key: item.id,
            media: {
                id: item.media.id,
                url: item.media.url,
                alt: item.media.alt,
            } as GalleryImage["media"],
            isPrimary: item.isPrimary,
            caption: item.caption ?? "",
        }));
}

export default function PortfolioProjectForm({
    mode,
    projectId,
    categories,
    initialProject,
}: PortfolioProjectFormProps) {
    const router = useRouter();
    const [slugTouched, setSlugTouched] = useState(mode === "edit");

    // Single source of truth for both the featured-image panel and the
    // gallery panel — PortfolioProject has no separate featuredImage
    // column, the featured image is just the gallery item flagged
    // isPrimary. See PortfolioFeaturedImagePanel for details.
    const [gallery, setGallery] = useState<GalleryImage[]>(
        detailToGalleryImages(initialProject),
    );

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PortfolioProjectFormInput>({
        resolver: zodResolver(portfolioProjectFormSchema),
        defaultValues: detailToFormValues(initialProject),
    });

    const values = watch();
    const titleValue = watch("title");

    useMemo(() => {
        if (!slugTouched && mode === "create") {
            setValue("slug", slugify(titleValue || ""));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [titleValue, slugTouched, mode]);

    async function onSubmit(data: PortfolioProjectFormInput) {
        const payload: PortfolioProjectFormPayload = {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || undefined,
            description: data.description || undefined,
            content: data.content || undefined,
            status: data.status,
            visibility: data.visibility,
            featured: data.featured,
            clientName: data.clientName || undefined,
            clientIndustry: data.clientIndustry || undefined,
            projectUrl: data.projectUrl || undefined,
            repositoryUrl: data.repositoryUrl || undefined,
            startDate: data.startDate || null,
            completionDate: data.completionDate || null,
            categoryId: data.categoryId || null,
            seoTitle: data.seoTitle || undefined,
            seoDescription: data.seoDescription || undefined,
            seoKeywords: data.seoKeywords || undefined,
            canonicalUrl: data.canonicalUrl || undefined,
            technologyIds: data.technologyIds,
            // Workaround for a schema/service ordering gap: the backend's
            // superRefine requires publishedAt to already be present when
            // status is PUBLISHED, rather than auto-filling it as the
            // service's normalizePublishingState intends. Flagged to
            // Zubair as a backend fix candidate, not silently patched
            // server-side.
            publishedAt:
                data.status === "PUBLISHED"
                    ? (initialProject?.publishedAt ?? new Date().toISOString())
                    : null,
        };

        try {
            const project =
                mode === "create"
                    ? await createPortfolioProjectRequest(payload)
                    : await updatePortfolioProjectRequest(projectId!, payload);

            await replacePortfolioProjectMediaRequest(
                project.id,
                gallery.map((image, index) => ({
                    mediaId: image.media.id,
                    sortOrder: index,
                    isPrimary: image.isPrimary,
                    caption: image.caption || undefined,
                    altText: image.media.alt || undefined,
                })),
            );

            toast.success(
                mode === "create" ? "Project created." : "Project updated.",
            );

            router.push(`/workspace/portfolio/${project.id}/edit`);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error ? error.message : "Failed to save project.",
            );
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Core details */}
            <WorkspaceCard padding="lg" className="space-y-6">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Project Details
                    </h2>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Core information shown across the dashboard and public
                        listing.
                    </p>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Project title
                        </label>
                        <Input placeholder="Enter project title..." {...register("title")} />
                        {errors.title && (
                            <p className="text-xs text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Slug
                        </label>
                        <Input
                            placeholder="project-slug"
                            {...register("slug", { onChange: () => setSlugTouched(true) })}
                        />
                        {errors.slug && (
                            <p className="text-xs text-red-500">{errors.slug.message}</p>
                        )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[var(--workspace-text)]">
                                Category
                            </label>
                            <select
                                {...register("categoryId")}
                                className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-sm text-[var(--workspace-text)] outline-none transition focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10"
                            >
                                <option value="">No category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[var(--workspace-text)]">
                                Technologies
                            </label>
                            <Controller
                                name="technologyIds"
                                control={control}
                                render={({ field }) => (
                                    <TechnologiesMultiSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Excerpt
                        </label>
                        <Textarea
                            rows={3}
                            placeholder="Short summary shown in listings..."
                            {...register("excerpt")}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Description
                        </label>
                        <Textarea
                            rows={4}
                            placeholder="Longer overview of the project..."
                            {...register("description")}
                        />
                    </div>
                </div>
            </WorkspaceCard>

            {/* Client & links */}
            <WorkspaceCard padding="lg" className="space-y-6">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Client &amp; Links
                    </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Client name
                        </label>
                        <Input placeholder="Acme Inc." {...register("clientName")} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Client industry
                        </label>
                        <Input placeholder="Fintech" {...register("clientIndustry")} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Project URL
                        </label>
                        <Input placeholder="https://..." {...register("projectUrl")} />
                        {errors.projectUrl && (
                            <p className="text-xs text-red-500">
                                {errors.projectUrl.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Repository URL
                        </label>
                        <Input placeholder="https://github.com/..." {...register("repositoryUrl")} />
                        {errors.repositoryUrl && (
                            <p className="text-xs text-red-500">
                                {errors.repositoryUrl.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Start date
                        </label>
                        <Input type="date" {...register("startDate")} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Completion date
                        </label>
                        <Input type="date" {...register("completionDate")} />
                        {errors.completionDate && (
                            <p className="text-xs text-red-500">
                                {errors.completionDate.message}
                            </p>
                        )}
                    </div>
                </div>
            </WorkspaceCard>

            {/* Content */}
            <WorkspaceCard padding="lg" className="space-y-5">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Content
                    </h2>
                    <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                        Full case-study write-up.
                    </p>
                </div>

                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <div className="overflow-hidden rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)]">
                            <Editor value={field.value ?? ""} onChange={field.onChange} />
                        </div>
                    )}
                />
            </WorkspaceCard>

            {/* Media */}
            <PortfolioFeaturedImagePanel gallery={gallery} onChange={setGallery} />
            <PortfolioGalleryPanel value={gallery} onChange={setGallery} />

            {/* Publishing */}
            <WorkspaceCard padding="lg" className="space-y-5">
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Publishing
                </h2>

                <div className="grid gap-5 md:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Status
                        </label>
                        <select
                            {...register("status")}
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-sm text-[var(--workspace-text)] outline-none transition focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Visibility
                        </label>
                        <select
                            {...register("visibility")}
                            className="h-10 w-full rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 text-sm text-[var(--workspace-text)] outline-none transition focus:border-[var(--workspace-primary)] focus:ring-2 focus:ring-[var(--workspace-primary)]/10"
                        >
                            <option value="INTERNAL">Internal</option>
                            <option value="PUBLIC">Public</option>
                        </select>
                    </div>

                    <div className="flex items-end pb-2.5">
                        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[var(--workspace-text)]">
                            <input
                                type="checkbox"
                                {...register("featured")}
                                className="h-3.5 w-3.5 accent-[var(--workspace-primary)]"
                            />
                            Featured project
                        </label>
                    </div>
                </div>

                {values.visibility === "PUBLIC" && values.status === "DRAFT" && (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        This project is set to Public visibility but is still a
                        Draft — it won&apos;t appear on the public site until
                        published.
                    </p>
                )}
            </WorkspaceCard>

            {/* SEO */}
            <WorkspaceCard padding="lg" className="space-y-5">
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Search Engine Optimization
                </h2>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            SEO title
                        </label>
                        <Input placeholder="SEO optimized title..." {...register("seoTitle")} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            SEO description
                        </label>
                        <Textarea rows={3} {...register("seoDescription")} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            SEO keywords
                        </label>
                        <Input placeholder="Comma-separated keywords" {...register("seoKeywords")} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--workspace-text)]">
                            Canonical URL
                        </label>
                        <Input placeholder="https://..." {...register("canonicalUrl")} />
                        {errors.canonicalUrl && (
                            <p className="text-xs text-red-500">
                                {errors.canonicalUrl.message}
                            </p>
                        )}
                    </div>
                </div>
            </WorkspaceCard>

            <div className="flex items-center justify-end gap-3 border-t border-[var(--workspace-border)] pt-5">
                <WorkspaceButton type="submit" size="sm" disabled={isSubmitting}>
                    <Save className="h-3.5 w-3.5" />
                    {isSubmitting
                        ? "Saving..."
                        : mode === "create"
                          ? "Create Project"
                          : "Save Changes"}
                </WorkspaceButton>
            </div>
        </form>
    );
}
