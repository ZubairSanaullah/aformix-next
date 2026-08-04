import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/blog/slug";

import { tagSchema } from "@/lib/validations/tag";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const body = await req.json();

        const data = tagSchema.parse(body);

        const slug = generateSlug(data.name);

        const existing = await prisma.tag.findFirst({
            where: {
                OR: [
                    { name: data.name },
                    { slug },
                ],
            },
        });

        if (existing) {
            return NextResponse.json(
                {
                    error:
                        "A tag with this name already exists.",
                },
                {
                    status: 400,
                }
            );
        }

        await prisma.tag.create({
            data: {
                name: data.name,
                slug,
                description:
                    data.description || null,
            },
        });

        return NextResponse.json({
            message: "Tag created successfully.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Failed to create tag.",
            },
            {
                status: 500,
            }
        );
    }
}