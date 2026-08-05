import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const existing = await prisma.media.findUnique({
            where: { id },
        });

        if (!existing || existing.deletedAt) {
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 }
            );
        }

        const deleted = await prisma.media.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return NextResponse.json(deleted);
    } catch (error) {
        console.error("[MEDIA_DELETE]", error);
        return NextResponse.json(
            { error: "Failed to delete media" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json().catch(() => ({}));

        if (body.action !== "restore") {
            return NextResponse.json(
                { error: "Unsupported action" },
                { status: 400 }
            );
        }

        const existing = await prisma.media.findUnique({
            where: { id },
        });

        if (!existing || !existing.deletedAt) {
            return NextResponse.json(
                { error: "Media not found in trash" },
                { status: 404 }
            );
        }

        const restored = await prisma.media.update({
            where: { id },
            data: { deletedAt: null },
        });

        return NextResponse.json(restored);
    } catch (error) {
        console.error("[MEDIA_RESTORE]", error);
        return NextResponse.json(
            { error: "Failed to restore media" },
            { status: 500 }
        );
    }
}