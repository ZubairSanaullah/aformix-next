import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

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

        if (session.user.role !== "ADMIN" && existing.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden: You cannot delete media uploaded by another user" },
                { status: 403 }
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

const updateSchema = z.object({
    action: z.literal("update").optional(),
    alt: z
        .string()
        .max(300, "Alt text must be 300 characters or fewer")
        .nullable()
        .optional(),
    folderId: z
        .string()
        .min(1, "folderId cannot be empty")
        .optional(),
});

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json().catch(() => ({}));

        /*
         * Restore branch — unchanged from existing behavior.
         */
        if (body.action === "restore") {
            const existing = await prisma.media.findUnique({
                where: { id },
            });

            if (!existing || !existing.deletedAt) {
                return NextResponse.json(
                    { error: "Media not found in trash" },
                    { status: 404 }
                );
            }

            if (session.user.role !== "ADMIN" && existing.userId !== session.user.id) {
                return NextResponse.json(
                    { error: "Forbidden: You cannot restore media uploaded by another user" },
                    { status: 403 }
                );
            }

            const restored = await prisma.media.update({
                where: { id },
                data: { deletedAt: null },
            });

            return NextResponse.json(restored);
        }

        /*
         * Metadata update branch — alt text and/or folder.
         * Covers action: "update" or an omitted action with
         * update fields present.
         */
        const parsed = updateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid request",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { alt, folderId } = parsed.data;

        if (alt === undefined && folderId === undefined) {
            return NextResponse.json(
                { error: "No fields to update" },
                { status: 400 }
            );
        }

        const existing = await prisma.media.findUnique({
            where: { id },
        });

        if (!existing || existing.deletedAt) {
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 }
            );
        }

        if (session.user.role !== "ADMIN" && existing.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden: You cannot update media uploaded by another user" },
                { status: 403 }
            );
        }

        if (folderId !== undefined) {
            const targetFolder = await prisma.folder.findUnique({
                where: { id: folderId },
            });

            if (!targetFolder) {
                return NextResponse.json(
                    { error: "Target folder not found" },
                    { status: 404 }
                );
            }
        }

        const updated = await prisma.media.update({
            where: { id },
            data: {
                ...(alt !== undefined && { alt: alt || null }),
                ...(folderId !== undefined && { folderId }),
            },
            include: { folder: true },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[MEDIA_UPDATE]", error);
        return NextResponse.json(
            { error: "Failed to update media" },
            { status: 500 }
        );
    }
}