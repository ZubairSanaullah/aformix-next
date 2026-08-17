import type {
    PortfolioProjectListQuery,
} from "@/lib/validations/portfolio";

export type PortfolioProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PortfolioProjectVisibility = "INTERNAL" | "PUBLIC";

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

class PortfolioApiError extends Error {
    status: number;
    details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.name = "PortfolioApiError";
        this.status = status;
        this.details = details;
    }
}

function buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        searchParams.set(key, String(value));
    });

    const query = searchParams.toString();
    return query ? `?${query}` : "";
}

async function parseOrThrow<T>(response: Response): Promise<T> {
    let data: unknown;

    try {
        data = await response.json();
    } catch {
        throw new PortfolioApiError(
            "Unexpected response from the server.",
            response.status,
        );
    }

    if (!response.ok) {
        const errorPayload = data as { error?: string; details?: unknown };

        throw new PortfolioApiError(
            errorPayload.error || "Request failed.",
            response.status,
            errorPayload.details,
        );
    }

    return data as T;
}

/* ------------------------------------------------------------------ */
/* Projects — list, stats, archive/restore/trash/delete               */
/* ------------------------------------------------------------------ */

export interface PortfolioProjectListItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    status: PortfolioProjectStatus;
    visibility: PortfolioProjectVisibility;
    featured: boolean;
    sortOrder: number;
    clientName: string | null;
    categoryId: string | null;
    category: {
        id: string;
        name: string;
        slug: string;
    } | null;
    technologies: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    author: {
        id: string;
        name: string | null;
        email: string;
    };
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface PortfolioProjectListResponse {
    items: PortfolioProjectListItem[];
    pagination: PaginationMeta;
}

export interface PortfolioStats {
    totalProjects: number;
    draftProjects: number;
    publishedProjects: number;
    archivedProjects: number;
    publicProjects: number;
    internalProjects: number;
    featuredProjects: number;
    totalCategories: number;
    totalTechnologies: number;
    recentPublished: Array<{
        id: string;
        title: string;
        slug: string;
        publishedAt: string | null;
    }>;
    recentUpdated: Array<{
        id: string;
        title: string;
        slug: string;
        updatedAt: string;
    }>;
}

export type PortfolioListParams = Partial<
    Pick<
        PortfolioProjectListQuery,
        | "search"
        | "categoryId"
        | "status"
        | "visibility"
        | "featured"
        | "technologyId"
        | "page"
        | "limit"
        | "sortBy"
        | "sortOrder"
    >
>;

export async function fetchPortfolioProjects(
    params: PortfolioListParams = {},
): Promise<PortfolioProjectListResponse> {
    const response = await fetch(
        `/api/portfolio/projects${buildQueryString(params)}`,
        { cache: "no-store" },
    );

    return parseOrThrow<PortfolioProjectListResponse>(response);
}

export async function fetchPortfolioStats(): Promise<PortfolioStats> {
    const response = await fetch("/api/portfolio/stats", {
        cache: "no-store",
    });

    const data = await parseOrThrow<{ stats: PortfolioStats }>(response);
    return data.stats;
}

export async function archivePortfolioProjectRequest(
    id: string,
): Promise<void> {
    const response = await fetch(`/api/portfolio/projects/${id}/archive`, {
        method: "POST",
    });

    await parseOrThrow(response);
}

export async function restorePortfolioProjectRequest(
    id: string,
): Promise<void> {
    const response = await fetch(`/api/portfolio/projects/${id}/restore`, {
        method: "POST",
    });

    await parseOrThrow(response);
}

/** Moves a project to trash (soft delete, deletedAt set). This is what
 * the main dashboard's "Delete" row action calls. */
export async function trashPortfolioProjectRequest(id: string): Promise<void> {
    const response = await fetch(`/api/portfolio/projects/${id}/trash`, {
        method: "POST",
    });

    await parseOrThrow(response);
}

/** PERMANENT delete — only wire this into a future trash page, never
 * into the main dashboard row actions. */
export async function deletePortfolioProjectRequest(
    id: string,
): Promise<void> {
    const response = await fetch(`/api/portfolio/projects/${id}`, {
        method: "DELETE",
    });

    await parseOrThrow(response);
}

/* ------------------------------------------------------------------ */
/* Project detail + create/update                                     */
/* ------------------------------------------------------------------ */

export interface PortfolioTechnologyItem {
    id: string;
    name: string;
    slug: string;
    description: string | null;
}

export interface PortfolioProjectDetail {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    description: string | null;
    content: string | null;
    status: PortfolioProjectStatus;
    visibility: PortfolioProjectVisibility;
    featured: boolean;
    sortOrder: number;
    clientName: string | null;
    clientIndustry: string | null;
    projectUrl: string | null;
    repositoryUrl: string | null;
    startDate: string | null;
    completionDate: string | null;
    categoryId: string | null;
    category: { id: string; name: string; slug: string } | null;
    technologies: PortfolioTechnologyItem[];
    seoTitle: string | null;
    seoDescription: string | null;
    seoKeywords: string | null;
    canonicalUrl: string | null;
    publishedAt: string | null;
    media: Array<{
        id: string;
        mediaId: string;
        sortOrder: number;
        isPrimary: boolean;
        caption: string | null;
        altText: string | null;
        media: { id: string; url: string; alt: string | null };
    }>;
}

export interface PortfolioProjectFormPayload {
    title: string;
    slug: string;
    excerpt?: string;
    description?: string;
    content?: string;
    status: PortfolioProjectStatus;
    visibility: PortfolioProjectVisibility;
    featured: boolean;
    clientName?: string;
    clientIndustry?: string;
    projectUrl?: string;
    repositoryUrl?: string;
    startDate?: string | null;
    completionDate?: string | null;
    categoryId?: string | null;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    canonicalUrl?: string;
    publishedAt?: string | null;
    technologyIds: string[];
}

export async function fetchPortfolioProject(
    id: string,
): Promise<PortfolioProjectDetail> {
    const response = await fetch(`/api/portfolio/projects/${id}`, {
        cache: "no-store",
    });

    const data = await parseOrThrow<{ project: PortfolioProjectDetail }>(response);
    return data.project;
}

export async function createPortfolioProjectRequest(
    payload: PortfolioProjectFormPayload,
): Promise<PortfolioProjectDetail> {
    const response = await fetch("/api/portfolio/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await parseOrThrow<{ project: PortfolioProjectDetail }>(response);
    return data.project;
}

export async function updatePortfolioProjectRequest(
    id: string,
    payload: Partial<PortfolioProjectFormPayload>,
): Promise<PortfolioProjectDetail> {
    const response = await fetch(`/api/portfolio/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await parseOrThrow<{ project: PortfolioProjectDetail }>(response);
    return data.project;
}

/* ------------------------------------------------------------------ */
/* Project media (gallery + featured image)                           */
/* ------------------------------------------------------------------ */

export interface PortfolioProjectMediaPayloadItem {
    mediaId: string;
    sortOrder: number;
    isPrimary: boolean;
    caption?: string;
    altText?: string;
}

export async function replacePortfolioProjectMediaRequest(
    projectId: string,
    items: PortfolioProjectMediaPayloadItem[],
): Promise<void> {
    const response = await fetch(`/api/portfolio/projects/${projectId}/media`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
    });

    await parseOrThrow(response);
}

/* ------------------------------------------------------------------ */
/* Technologies                                                       */
/* ------------------------------------------------------------------ */

export async function fetchPortfolioTechnologies(
    search?: string,
): Promise<PortfolioTechnologyItem[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const response = await fetch(`/api/portfolio/technologies${query}`, {
        cache: "no-store",
    });

    const data = await parseOrThrow<{ technologies: PortfolioTechnologyItem[] }>(
        response,
    );
    return data.technologies;
}

export async function createPortfolioTechnologyRequest(input: {
    name: string;
    slug: string;
}): Promise<PortfolioTechnologyItem> {
    const response = await fetch("/api/portfolio/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    const data = await parseOrThrow<{ technology: PortfolioTechnologyItem }>(
        response,
    );
    return data.technology;
}

/* ------------------------------------------------------------------ */
/* Categories                                                         */
/* ------------------------------------------------------------------ */

export interface PortfolioCategoryItem {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    sortOrder: number;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    projectCount: number;
}

export interface PortfolioCategoryListResponse {
    categories: PortfolioCategoryItem[];
    pagination: PaginationMeta;
}

export interface PortfolioCategoryListParams {
    search?: string;
    includeDeleted?: boolean;
    page?: number;
    limit?: number;
    sortBy?: "name" | "sortOrder" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
}

export interface PortfolioCategoryFormValues {
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    sortOrder?: number;
}

export async function fetchPortfolioCategories(
    params: PortfolioCategoryListParams = {},
): Promise<PortfolioCategoryListResponse> {
    const response = await fetch(
        `/api/portfolio/categories${buildQueryString(params as Record<string, unknown>)}`,
        { cache: "no-store" },
    );

    return parseOrThrow<PortfolioCategoryListResponse>(response);
}

export async function createPortfolioCategoryRequest(
    values: PortfolioCategoryFormValues,
): Promise<PortfolioCategoryItem> {
    const response = await fetch("/api/portfolio/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });

    const data = await parseOrThrow<{ category: PortfolioCategoryItem }>(response);
    return data.category;
}

export async function updatePortfolioCategoryRequest(
    id: string,
    values: Partial<PortfolioCategoryFormValues>,
): Promise<PortfolioCategoryItem> {
    const response = await fetch(`/api/portfolio/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });

    const data = await parseOrThrow<{ category: PortfolioCategoryItem }>(response);
    return data.category;
}

export async function archivePortfolioCategoryRequest(id: string): Promise<void> {
    const response = await fetch(`/api/portfolio/categories/${id}/archive`, {
        method: "POST",
    });

    await parseOrThrow(response);
}

export async function restorePortfolioCategoryRequest(id: string): Promise<void> {
    const response = await fetch(`/api/portfolio/categories/${id}/restore`, {
        method: "POST",
    });

    await parseOrThrow(response);
}

export async function deletePortfolioCategoryRequest(id: string): Promise<void> {
    const response = await fetch(`/api/portfolio/categories/${id}`, {
        method: "DELETE",
    });

    await parseOrThrow(response);
}

export { PortfolioApiError };
