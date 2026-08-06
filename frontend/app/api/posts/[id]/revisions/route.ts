import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const revisions = await prisma.postRevision.findMany({
            where: {
                postId: id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(revisions);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch revisions." },
            { status: 500 }
        );
    }
}