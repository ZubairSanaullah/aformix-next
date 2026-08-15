/**
 * Types for the PUBLIC Knowledge Base (15.23), distinct from the
 * admin-side types in components/workspace/knowledge/types.ts — the public
 * surface only ever deals with PUBLISHED + PUBLIC content and doesn't need
 * admin-only fields (deletedAt, sortOrder editing state, etc.).
 */

export interface PublicCategory {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
}

export interface PublicArticleAuthor {
    name: string | null;
}

export interface PublicArticleListItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featured: boolean;
    publishedAt: string | Date | null;
    category: PublicCategory | null;
}

export interface PublicArticleDetail extends PublicArticleListItem {
    content: string;
    metaTitle: string | null;
    metaDescription: string | null;
    author: PublicArticleAuthor | null;
    updatedAt: string | Date;
}
