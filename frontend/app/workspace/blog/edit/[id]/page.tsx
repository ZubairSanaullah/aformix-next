import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import EditPostForm from "./EditPostForm";

interface EditPostPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPostPage({
    params,
}: EditPostPageProps) {
    const { id } = await params;

    const [
        post,
        categories,
        tags,
    ] = await Promise.all([
        prisma.post.findUnique({
            where: {
                id,
            },
            include: {
                tags: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),

        prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        }),

        prisma.tag.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        }),
    ]);

    if (!post) {
        notFound();
    }

    return (
        <EditPostForm
            post={post}
            categories={categories}
            tags={tags}
        />
    );
}