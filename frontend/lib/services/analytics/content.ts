import { prisma } from "@/lib/prisma";

export async function getContentAnalytics(startDate: Date, endDate: Date) {
    const posts = await prisma.post.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
            deletedAt: null
        },
        select: {
            status: true,
            views: true,
        }
    });

    const totalPosts = posts.length;
    let publishedPosts = 0;
    let draftPosts = 0;
    let archivedPosts = 0;
    let totalViews = 0;

    for (const post of posts) {
        if (post.status === "PUBLISHED") publishedPosts++;
        else if (post.status === "DRAFT") draftPosts++;
        else if (post.status === "ARCHIVED") archivedPosts++;

        totalViews += post.views || 0;
    }

    const averageViewsPerPost = totalPosts > 0 ? totalViews / totalPosts : 0;

    const articles = await prisma.knowledgeArticle.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
            deletedAt: null
        },
        select: {
            status: true,
            visibility: true,
            featured: true,
            category: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });

    const totalArticles = articles.length;
    let publishedArticles = 0;
    let draftArticles = 0;
    let archivedArticles = 0;
    let publicArticles = 0;
    let internalArticles = 0;
    let featuredArticles = 0;

    const categoriesMap: Record<string, { name: string, count: number }> = {};

    for (const article of articles) {
        if (article.status === "PUBLISHED") publishedArticles++;
        else if (article.status === "DRAFT") draftArticles++;
        else if (article.status === "ARCHIVED") archivedArticles++;

        if (article.visibility === "PUBLIC") publicArticles++;
        else if (article.visibility === "INTERNAL") internalArticles++;

        if (article.featured) featuredArticles++;

        const catId = article.category?.id;
        if (catId) {
            if (!categoriesMap[catId]) {
                categoriesMap[catId] = { name: article.category.name, count: 0 };
            }
            categoriesMap[catId].count++;
        }
    }

    const articlesByCategory = Object.values(categoriesMap).sort((a, b) => b.count - a.count);

    return {
        blog: {
            total: totalPosts,
            published: publishedPosts,
            draft: draftPosts,
            archived: archivedPosts,
            views: totalViews,
            averageViews: Number(averageViewsPerPost.toFixed(2))
        },
        knowledgeBase: {
            total: totalArticles,
            published: publishedArticles,
            draft: draftArticles,
            archived: archivedArticles,
            public: publicArticles,
            internal: internalArticles,
            featured: featuredArticles,
            byCategory: articlesByCategory
        }
    };
}
