import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/category";
import { generateSlug } from "@/lib/blog/slug";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        // 1. Check authentication
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Check admin role
        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // 3. Get category ID
        const { id } = await params;

        // 4. Parse request body
        const body = await request.json();

        // 5. Validate data
        const validation = categorySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: validation.error.flatten(),
                },
                { status: 400 }
            );
        }

        const { name, description } = validation.data;

        // 6. Generate slug
        const slug = generateSlug(name);

        // 7. Check category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return NextResponse.json(
                { error: "Category not found." },
                { status: 404 }
            );
        }

        // 8. Check duplicate name
        const duplicateName = await prisma.category.findFirst({
            where: {
                name,
                NOT: {
                    id,
                },
            },
        });

        if (duplicateName) {
            return NextResponse.json(
                {
                    error: "Category name already exists.",
                },
                { status: 409 }
            );
        }

        // 9. Check duplicate slug
        const duplicateSlug = await prisma.category.findFirst({
            where: {
                slug,
                NOT: {
                    id,
                },
            },
        });

        if (duplicateSlug) {
            return NextResponse.json(
                {
                    error: "Category slug already exists.",
                },
                { status: 409 }
            );
        }

        // 10. Update category
        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
            },
        });

        // 11. Success response
        return NextResponse.json(category);
    } catch (error) {
        console.error("PATCH Category Error:", error);

        return NextResponse.json(
            {
                error: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        // 1. Authentication
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Authorization
        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // 3. Get category ID
        const { id } = await params;

        // 4. Check category exists
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            return NextResponse.json(
                { error: "Category not found." },
                { status: 404 }
            );
        }

        // 5. Check if category is assigned to posts
        const postsCount = await prisma.post.count({
            where: {
                categoryId: id,
            },
        });

        if (postsCount > 0) {
            return NextResponse.json(
                {
                    error:
                        "This category cannot be deleted because it is assigned to one or more posts.",
                },
                { status: 400 }
            );
        }

        // 6. Delete category
        await prisma.category.delete({
            where: { id },
        });

        // 7. Success
        return NextResponse.json({
            message: "Category deleted successfully.",
        });
    } catch (error) {
        console.error("DELETE Category Error:", error);

        return NextResponse.json(
            {
                error: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}