import type {
    PortfolioProjectListQuery,
} from "@/lib/validations/portfolio";

export type PortfolioProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PortfolioProjectVisibility = "INTERNAL" | "PUBLIC";

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

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
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

function buildQueryString(params: PortfolioListParams): string {
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

export async function deletePortfolioProjectRequest(
    id: string,
): Promise<void> {
    const response = await fetch(`/api/portfolio/projects/${id}`, {
        method: "DELETE",
    });

    await parseOrThrow(response);
}

export { PortfolioApiError };