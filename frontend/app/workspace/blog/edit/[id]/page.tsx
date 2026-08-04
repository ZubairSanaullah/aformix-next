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

    const post = await prisma.post.findUnique({
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
    });

    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
        },
    });

    const tags = await prisma.tag.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
        },
    });

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