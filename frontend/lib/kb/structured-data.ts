import { getSiteUrl } from "./site";

interface ArticleJsonLdInput {
    title: string;
    description?: string | null;
    url: string;
    imageUrl?: string | null;
    publishedAt?: string | Date | null;
    updatedAt: string | Date;
    authorName?: string | null;
}

export function buildArticleJsonLd(article: ArticleJsonLdInput) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description || undefined,
        image: article.imageUrl ? [article.imageUrl] : undefined,
        datePublished: article.publishedAt
            ? new Date(article.publishedAt).toISOString()
            : undefined,
        dateModified: new Date(article.updatedAt).toISOString(),
        author: article.authorName
            ? { "@type": "Person", name: article.authorName }
            : undefined,
        publisher: {
            "@type": "Organization",
            name: "Aformix",
            url: getSiteUrl(),
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": article.url,
        },
    };
}

export function buildBreadcrumbJsonLd(
    items: Array<{ name: string; url: string }>
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * Enables Google's "sitelinks searchbox" — lets a search result for the
 * site show an inline search box that submits straight to /kb?search=...
 * Only render this once, on the /kb browse view (not on every page).
 */
export function buildWebsiteSearchJsonLd() {
    const siteUrl = getSiteUrl();

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: `${siteUrl}/kb`,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/kb?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}
