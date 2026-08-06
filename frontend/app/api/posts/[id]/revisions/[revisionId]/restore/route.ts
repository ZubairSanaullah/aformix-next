import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";


interface RouteContext {
    params: Promise<{
        id: string;
        revisionId: string;
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


        const {
            id,
            revisionId,
        } = await params;



        const revision =
            await prisma.postRevision.findUnique({
                where: {
                    id: revisionId,
                },
            });



        if (!revision) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Revision not found",
                },
                {
                    status: 404,
                }
            );
        }



        const post =
            await prisma.post.findUnique({
                where: {
                    id,
                },
            });



        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Post not found",
                },
                {
                    status: 404,
                }
            );
        }



        const isAdmin =
            session.user.role === "ADMIN";

        const isAuthor =
            post.authorId === session.user.id;



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



        // Save current version before restoring
        await prisma.postRevision.create({
            data: {
                postId: post.id,

                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,

                featuredImage:
                    post.featuredImage,

                status: post.status,

                seoTitle:
                    post.seoTitle,

                seoDescription:
                    post.seoDescription,

                seoKeywords:
                    post.seoKeywords,

                readingTime:
                    post.readingTime,

                categoryId:
                    post.categoryId,

                authorId:
                    post.authorId,
            },
        });



        const restored =
            await prisma.post.update({
                where: {
                    id,
                },

                data: {

                    title:
                        revision.title,

                    slug:
                        revision.slug,

                    excerpt:
                        revision.excerpt,

                    content:
                        revision.content,

                    featuredImage:
                        revision.featuredImage,

                    status:
                        revision.status,

                    seoTitle:
                        revision.seoTitle,

                    seoDescription:
                        revision.seoDescription,

                    seoKeywords:
                        revision.seoKeywords,

                    readingTime:
                        revision.readingTime,

                    categoryId:
                        revision.categoryId,

                },
            });



        return NextResponse.json({
            success: true,
            post: restored,
        });


    } catch (error) {

        console.error(error);


        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to restore revision",
            },
            {
                status: 500,
            }
        );
    }
}