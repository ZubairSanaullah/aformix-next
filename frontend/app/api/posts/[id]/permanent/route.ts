import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { id } = await params;

        const post = await prisma.post.findFirst({
            where: {
                id,
                deletedAt: {
                    not: null,
                },
            },
        });

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Trashed post not found.",
                },
                { status: 404 }
            );
        }

        const isAuthor = post.authorId === session.user.id;
        const isAdmin = session.user.role === "ADMIN";

        if (!isAdmin && !isAuthor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden: You cannot delete another author's post.",
                },
                { status: 403 }
            );
        }


        await prisma.post.delete({
            where: {
                id,
                deletedAt: {
                    not: null,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Post permanently deleted.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to permanently delete post.",
            },
            {
                status: 500,
            }
        );
    }
}