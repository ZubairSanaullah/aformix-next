import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(
    request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const post = await prisma.post.findUnique({
            where: {
                id,
            },
        });

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Post not found.",
                },
                { status: 404 }
            );
        }

        const isAdmin = session.user.role === "ADMIN";
        const isAuthor = post.authorId === session.user.id;

        if (!isAdmin && !isAuthor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden",
                },
                { status: 403 }
            );
        }

        if (!post.deletedAt) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Post is not in Trash.",
                },
                { status: 400 }
            );
        }

        const updatedPost = await prisma.post.update({
            where: {
                id,
            },
            data: {
                deletedAt: null,
            },
        });

        return NextResponse.json({
            success: true,
            post,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to restore post.",
            },
            {
                status: 500,
            }
        );
    }
}