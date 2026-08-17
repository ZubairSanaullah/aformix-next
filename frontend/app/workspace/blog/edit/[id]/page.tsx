import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
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
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

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

    if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
        redirect("/workspace/blog");
    }

    return (
        <EditPostForm
            post={post}
            categories={categories}
            tags={tags}
        />
    );
}