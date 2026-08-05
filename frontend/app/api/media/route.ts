import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status"); // "active" (default) | "trash"
        const query = searchParams.get("q")?.trim();

        const media = await prisma.media.findMany({
            where: {
                deletedAt: status === "trash" ? { not: null } : null,
                ...(query
                    ? {
                        OR: [
                            { originalName: { contains: query, mode: "insensitive" as const } },
                            { filename: { contains: query, mode: "insensitive" as const } },
                            { alt: { contains: query, mode: "insensitive" as const } },
                        ],
                    }
                    : {}),
            },
            orderBy: {
                ...(status === "trash"
                    ? { updatedAt: "desc" as const }
                    : { createdAt: "desc" as const }),
            },
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error("[MEDIA_GET]", error);
        return NextResponse.json(
            { error: "Failed to fetch media" },
            { status: 500 }
        );
    }
}