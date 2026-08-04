import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations/post";
import { generateSlug } from "@/lib/blog/slug";
import { calculateReadingTime } from "@/lib/blog/reading-time";

export async function POST(request: Request) {
    try {
        // 1. Authentication

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

        // 2. Validate request

        const body = await request.json();

        const result = postSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: result.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        const data = result.data;

        // 3. Generate slug

        const slug = generateSlug(data.title);

        const duplicate = await prisma.post.findUnique({
            where: {
                slug,
            },
        });

        if (duplicate) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A post with this title already exists.",
                },
                {
                    status: 409,
                }
            );
        }

        // 4. Reading time

        const readingTime = calculateReadingTime(
            data.content
        );

        // 5. Create post

        const post = await prisma.post.create({
            data: {
                title: data.title,
                slug,
                excerpt: data.excerpt,
                content: data.content,

                seoTitle:
                    data.seoTitle || null,

                seoDescription:
                    data.seoDescription || null,

                readingTime,

                authorId: session.user.id,

                categoryId: data.categoryId,

                tags: {
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

        return NextResponse.json(
            {
                success: true,
                post,
            },
            {
                status: 201,
            }
        );
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