import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { tagSchema } from "@/lib/validations/tag";
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
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;

        const body = await request.json();

        const validation = tagSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: validation.error.flatten(),
                },
                { status: 400 }
            );
        }

        const { name, description } = validation.data;

        const slug = generateSlug(name);

        const existingTag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!existingTag) {
            return NextResponse.json(
                { error: "Tag not found." },
                { status: 404 }
            );
        }

        const duplicateName = await prisma.tag.findFirst({
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
                    error: "Tag name already exists.",
                },
                { status: 409 }
            );
        }

        const duplicateSlug = await prisma.tag.findFirst({
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
                    error: "Tag slug already exists.",
                },
                { status: 409 }
            );
        }

        const tag = await prisma.tag.update({
            where: { id },
            data: {
                name,
                slug,
                description,
            },
        });

        return NextResponse.json(tag);
    } catch (error) {
        console.error("PATCH Tag Error:", error);

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
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const { id } = await params;

        const tag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!tag) {
            return NextResponse.json(
                { error: "Tag not found." },
                { status: 404 }
            );
        }

        const postsCount = await prisma.post.count({
            where: {
                tags: {
                    some: {
                        id,
                    },
                },
            },
        });

        if (postsCount > 0) {
            return NextResponse.json(
                {
                    error: "This tag cannot be deleted because it is assigned to one or more posts.",
                },
                { status: 400 }
            );
        }

        await prisma.tag.delete({
            where: { id },
        });

        return NextResponse.json({
            message: "Tag deleted successfully.",
        });
    } catch (error) {
        console.error("DELETE Tag Error:", error);

        return NextResponse.json(
            {
                error: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}