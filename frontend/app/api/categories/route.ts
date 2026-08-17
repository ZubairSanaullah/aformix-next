import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { generateSlug } from "@/lib/blog/slug";

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

        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden: Admin access required",
                },
                {
                    status: 403,
                }
            );
        }

        const result = categorySchema.safeParse(body);

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

        const slug = generateSlug(data.name);

        const existingCategory = await prisma.category.findFirst({
            where: {
                OR: [
                    { name: data.name },
                    { slug },
                ],
            },
        });

        if (existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A category with this name already exists.",
                },
                {
                    status: 409,
                }
            );
        }

        const category = await prisma.category.create({
            data: {
                name: data.name,
                slug,
                description: data.description || null,
            },
        });

        return NextResponse.json(
            {
                success: true,
                category,
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