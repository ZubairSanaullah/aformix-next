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

        if (existingPost.deletedAt) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This post is in Trash and cannot be autosaved.",
                },
                {
                    status: 410,
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

        const content =
            body.content ?? existingPost.content;

        const readingTime =
            calculateReadingTime(content);

        const post = await prisma.post.update({
            where: {
                id,
            },

            data: {
                title:
                    body.title ??
                    existingPost.title,

                excerpt:
                    body.excerpt ??
                    existingPost.excerpt,

                content,

                seoTitle:
                    body.seoTitle ??
                    existingPost.seoTitle,

                seoDescription:
                    body.seoDescription ??
                    existingPost.seoDescription,

                featuredImage:
                    body.featuredImage !== undefined
                        ? body.featuredImage || null
                        : existingPost.featuredImage,

                categoryId:
                    body.categoryId !== undefined
                        ? body.categoryId || null
                        : existingPost.categoryId,

                tags:
                    body.tagIds !== undefined
                        ? {
                            set: body.tagIds.map(
                                (tagId: string) => ({
                                    id: tagId,
                                })
                            ),
                        }
                        : undefined,

                readingTime,

                updatedAt: new Date(),
            },

            select: {
                id: true,
                updatedAt: true,
                readingTime: true,
                categoryId: true,
                featuredImage: true,
            },
        });

        return NextResponse.json({
            success: true,
            updatedAt: post.updatedAt,
            readingTime: post.readingTime,
        });
    } catch (error) {
        console.error("Autosave error:", error);

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