/**
 * Shared types for the Knowledge Base Admin UI (15.18 + 15.19 + 15.20).
 *
 * This file REPLACES the types.ts shipped with 15.19 — it's additive,
 * nothing from the prior versions was removed.
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
    articleCount?: number;
}

export interface KnowledgeCategoryFormValues {
    name: string;
    slug: string;
    description: string;
    icon: string;
    sortOrder: number;
}

/* ---------------------------------------------------------------------- */
/* 15.20 — Create/Edit Article additions                                  */
/* ---------------------------------------------------------------------- */

/**
 * The full shape needed to populate the article form in edit mode.
 * A superset of KnowledgeArticleListItem — adds the raw `content` and the
 * SEO fields that the list view doesn't need.
 */
export interface KnowledgeArticleDetail {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    categoryId: string;
    status: KnowledgeArticleStatus;
    visibility: KnowledgeArticleVisibility;
    featured: boolean;
    sortOrder: number;
    publishedAt: string | Date | null;
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
}
