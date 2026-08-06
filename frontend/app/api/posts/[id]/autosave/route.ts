import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime } from "@/lib/blog/reading-time";

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

        const existingPost = await prisma.post.findUnique({
            where: {
                id,
            },
        });

        if (!existingPost) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Post not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const isAdmin = session.user.role === "ADMIN";
        const isAuthor =
            existingPost.authorId === session.user.id;

        if (!isAdmin && !isAuthor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden",
                },
                {
                    status: 403,
                }
            );
        }

        const body = await request.json();

        const readingTime = calculateReadingTime(
            body.content ?? ""
        );

        const post = await prisma.post.update({
            where: {
                id,
            },
            data: {
                title:
                    body.title ?? existingPost.title,

                excerpt:
                    body.excerpt ??
                    existingPost.excerpt,

                content:
                    body.content ??
                    existingPost.content,

                seoTitle:
                    body.seoTitle ??
                    existingPost.seoTitle,

                seoDescription:
                    body.seoDescription ??
                    existingPost.seoDescription,

                readingTime,

                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            updatedAt: post.updatedAt,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Autosave failed.",
            },
            {
                status: 500,
            }
        );
    }
}