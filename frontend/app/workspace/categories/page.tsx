import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoriesTable from "@/components/workspace/categories/CategoriesTable";

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    posts: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Categories
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Organize your blog posts into categories.
                    </p>
                </div>

                <Link
                    href="/workspace/categories/create"
                    className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                >
                    New Category
                </Link>
            </div>

            <CategoriesTable categories={categories} />
        </div>
    );
}