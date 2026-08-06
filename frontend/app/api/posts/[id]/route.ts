import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations/post";
import { generateSlug } from "@/lib/blog/slug";
import { calculateReadingTime } from "@/lib/blog/reading-time";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
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
                { status: 401 }
            );
        }

        const { id } = await params;

        const post = await prisma.post.findUnique({
            where: {
                id,
            },

            include: {
                category: true,

                tags: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!post) {
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

        return NextResponse.json({
            success: true,
            post,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            {
                status: 500,
            }
        );
    }
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
                { status: 401 }
            );
        }

        const { id } = await params;

        const existingPost = await prisma.post.findUnique({
            where: { id },
        });

        if (!existingPost) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Post not found.",
                },
                { status: 404 }
            );
        }

        const isAdmin = session.user.role === "ADMIN";
        const isAuthor = existingPost.authorId === session.user.id;

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

        const result = postSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: result.error.flatten(),
                },
                { status: 400 }
            );
        }

        const data = result.data;

        const slug =
            data.title === existingPost.title
                ? existingPost.slug
                : generateSlug(data.title);

        if (slug !== existingPost.slug) {
            const duplicate = await prisma.post.findFirst({
                where: {
                    slug,
                    NOT: {
                        id,
                    },
                },
            });

            if (duplicate) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "A post with this title already exists.",
                    },
                    { status: 409 }
                );
            }
        }

        const readingTime = calculateReadingTime(data.content);

        await prisma.postRevision.create({
            data: {
                postId: existingPost.id,

                title: existingPost.title,
                slug: existingPost.slug,
                excerpt: existingPost.excerpt,
                content: existingPost.content,

                featuredImage: existingPost.featuredImage,

                status: existingPost.status,

                seoTitle: existingPost.seoTitle,
                seoDescription: existingPost.seoDescription,
                seoKeywords: existingPost.seoKeywords,

                readingTime: existingPost.readingTime,

                categoryId: existingPost.categoryId,
                authorId: existingPost.authorId,
            },
        });

        const post = await prisma.post.update({
            where: {
                id,
            },

            data: {
                title: data.title,

                slug,

                excerpt: data.excerpt,

                content: data.content,

                featuredImage:
                    data.featuredImage || null,

                seoTitle:
                    data.seoTitle || null,

                seoDescription:
                    data.seoDescription ||
                    null,

                readingTime,

                category: {
                    connect: {
                        id: data.categoryId,
                    },
                },

                tags: {
                    set: [],

                    connect: data.tagIds.map(
                        (id) => ({
                            id,
                        })
                    ),
                },
            },

            include: {
                category: true,
                tags: true,
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
                message: "Something went wrong.",
            },
            { status: 500 }
        );
    }
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

        console.log("Delete ID:", id);

        const existingPost = await prisma.post.findUnique({
            where: {
                id,
            },
        });

        console.log(existingPost);

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
        const isAuthor = existingPost.authorId === session.user.id;

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

        await prisma.post.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Post moved to Trash.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}