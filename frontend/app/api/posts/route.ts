import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations/post";
import { generateSlug } from "@/lib/blog/slug";
import { calculateReadingTime } from "@/lib/blog/reading-time";

export async function POST(request: Request) {
    try {
        const body = await request.json();

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

        const slug = generateSlug(data.title);

        const existingPost = await prisma.post.findUnique({
            where: {
                slug,
            },
        });

        if (existingPost) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A post with this title already exists.",
                },
                {
                    status: 409,
                }
            );
        }

        const readingTime = calculateReadingTime(data.content);

        const post = await prisma.post.create({
            data: {
                title: data.title,
                slug,
                excerpt: data.excerpt,
                content: data.content,
                seoTitle: data.seoTitle || null,
                seoDescription: data.seoDescription || null,
                readingTime,
                authorId: session.user.id,
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