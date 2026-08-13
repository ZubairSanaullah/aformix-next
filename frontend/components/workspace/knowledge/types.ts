/**
 * Shared types for the Knowledge Base Admin UI (15.18 + 15.19).
 *
 * NOTE: These describe the shapes the UI expects from:
 *   - getArticles() / getArticleById()     → lib/services/knowledge-articles.ts
 *   - getCategories() / getCategoryById()  → lib/services/knowledge-categories.ts
 *   - getKnowledgeBaseStats()              → lib/services/knowledge-stats.ts
 *
 * They were inferred from the Prisma model fields described in the
 * Phase 15 knowledge base (createArticleSchema / createCategorySchema)
 * plus the metrics listed for 15.11. If the actual service return
 * shapes differ, adjust this file — it's the single source of truth
 * the rest of the Knowledge Base UI imports from.
 *
 * This file REPLACES the types.ts shipped with 15.18 — it's additive,
 * nothing from the original was removed.
 */

export type KnowledgeArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type KnowledgeArticleVisibility = "INTERNAL" | "PUBLIC";

export interface KnowledgeCategorySummary {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
}

export interface KnowledgeArticleAuthor {
    id: string;
    name: string | null;
    email: string;
}

export interface KnowledgeArticleListItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    status: KnowledgeArticleStatus;
    visibility: KnowledgeArticleVisibility;
    featured: boolean;
    sortOrder: number;
    publishedAt: string | Date | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt: string | Date | null;
    category: KnowledgeCategorySummary | null;
    author: KnowledgeArticleAuthor | null;
}

export interface KnowledgePaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface KnowledgeBaseStats {
    totalArticles: number;
    draftArticles: number;
    publishedArticles: number;
    archivedArticles: number;
    internalArticles: number;
    publicArticles: number;
    featuredArticles: number;
    totalCategories: number;
}

/* ---------------------------------------------------------------------- */
/* 15.19 — Category Management additions                                  */
/* ---------------------------------------------------------------------- */

export interface KnowledgeCategoryListItem {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    sortOrder: number;
    deletedAt: string | Date | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    /**
     * Optional — only populate this if getCategories() is extended to
     * include counts (e.g. via a Prisma `_count` select). The UI treats
     * a missing count as "unknown" and simply doesn't render a number.
     */
    articleCount?: number;
}

export interface KnowledgeCategoryFormValues {
    name: string;
    slug: string;
    description: string;
    icon: string;
    sortOrder: number;
}
