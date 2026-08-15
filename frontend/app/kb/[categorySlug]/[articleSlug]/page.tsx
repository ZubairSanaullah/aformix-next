import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { getArticleBySlug } from "@/lib/services/knowledge-articles";
import { sanitizeArticleHtml } from "@/lib/kb/sanitize";
import { getSiteUrl } from "@/lib/kb/site";
import {
    buildArticleJsonLd,
    buildBreadcrumbJsonLd,
} from "@/lib/kb/structured-data";
import { extractFirstImage } from "@/lib/kb/extractFirstImage";

import KBBreadcrumbs from "@/components/kb/KBBreadcrumbs";
import JsonLd from "@/components/kb/JsonLd";

// Same rendered-content CSS reused from the admin preview (15.22) — keeps
// public articles visually identical to what the author saw in the editor.
import "@/components/workspace/editor/EditorStyles.css";

interface ArticlePageProps {
    params: Promise<{ categorySlug: string; articleSlug: string }>;
}

function formatDate(date: string | Date | null) {
    if (!date) return null;

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

async function getPublicArticle(articleSlug: string) {
    const article = await getArticleBySlug(articleSlug);

    // Anonymous visitors only ever see published, public, non-deleted
    // content — anything else is treated as not found, same as a slug
    // that doesn't exist. This is the entire access-control check for
    // this route.
    if (
        !article ||
        article.deletedAt ||
        article.status !== "PUBLISHED" ||
        article.visibility !== "PUBLIC"
    ) {
        return null;
    }

    return article;
}

export async function generateMetadata({
    params,
}: ArticlePageProps): Promise<Metadata> {
    const { articleSlug } = await params;
    const article = await getPublicArticle(articleSlug);

    if (!article) {
        return { title: "Article not found" };
    }

    const siteUrl = getSiteUrl();
    const canonicalPath = article.category
        ? `/kb/${article.category.slug}/${article.slug}`
        : `/kb/${article.slug}`;

    // Explicit canonicalUrl wins (author-set override); otherwise the
    // article's own KB URL is self-referencing — always set one or the
    // other, never neither.
    const canonical = article.canonicalUrl || `${siteUrl}${canonicalPath}`;

    const title = article.metaTitle || article.title;
    const description =
        article.metaDescription || article.excerpt || undefined;
    const ogImage = extractFirstImage(article.content);

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "article",
            publishedTime: article.publishedAt
                ? new Date(article.publishedAt).toISOString()
                : undefined,
            modifiedTime: new Date(article.updatedAt).toISOString(),
            authors: article.author?.name ? [article.author.name] : undefined,
            images: ogImage ? [{ url: ogImage }] : undefined,
        },
        twitter: {
            card: ogImage ? "summary_large_image" : "summary",
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { categorySlug, articleSlug } = await params;

    const article = await getPublicArticle(articleSlug);

    if (!article) {
        notFound();
    }

    // Canonicalize the URL to the article's actual category slug, in case
    // it was reassigned to a different category after being linked/bookmarked.
    if (article.category && article.category.slug !== categorySlug) {
        redirect(`/kb/${article.category.slug}/${article.slug}`);
    }

    const siteUrl = getSiteUrl();
    const articleUrl = `${siteUrl}/kb/${categorySlug}/${article.slug}`;
    const publishedLabel = formatDate(article.publishedAt);
    const sanitizedContent = sanitizeArticleHtml(article.content);

    const breadcrumbItems = [
        { label: "Knowledge Base", href: "/kb" },
        ...(article.category
            ? [
                  {
                      label: article.category.name,
                      href: `/kb/${article.category.slug}`,
                  },
              ]
            : []),
        { label: article.title },
    ];

    return (
        <article className="section-padding mx-auto max-w-3xl px-6">
            <JsonLd
                data={buildArticleJsonLd({
                    title: article.title,
                    description: article.excerpt,
                    url: articleUrl,
                    imageUrl: extractFirstImage(article.content),
                    publishedAt: article.publishedAt,
                    updatedAt: article.updatedAt,
                    authorName: article.author?.name,
                })}
            />

            <JsonLd
                data={buildBreadcrumbJsonLd(
                    breadcrumbItems.map((item) => ({
                        name: item.label,
                        url: item.href
                            ? `${siteUrl}${item.href}`
                            : articleUrl,
                    }))
                )}
            />

            <KBBreadcrumbs items={breadcrumbItems} />

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--color-text)]">
                {article.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-muted)]">
                {article.author?.name && (
                    <span>By {article.author.name}</span>
                )}

                {article.author?.name && publishedLabel && <span>·</span>}

                {publishedLabel && <span>{publishedLabel}</span>}
            </div>

            {article.excerpt && (
                <p className="mt-6 border-l-2 border-[var(--color-primary)] pl-4 text-base italic leading-7 text-[var(--color-text-muted)]">
                    {article.excerpt}
                </p>
            )}

            <div
                className="tiptap mt-8"
                // Sanitized above via sanitizeArticleHtml() — do not swap
                // this back to raw article.content.
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
        </article>
    );
}
