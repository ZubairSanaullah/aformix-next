export interface RevisionAuthor {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

export interface Revision {
    id: string;

    title: string;
    slug: string;
    excerpt: string | null;
    content: string;

    status:
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";

    featuredImage?: string | null;

    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string | null;

    readingTime: number;

    createdAt: string;

    author?: RevisionAuthor;
}