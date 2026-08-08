import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        if (session.user.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden",
                },
                { status: 403 }
            );
        }

        // 3. Permanently delete all trashed posts
        await prisma.post.deleteMany({
            where: {
                deletedAt: {
                    not: null,
                },
            },
        });

        // 4. Success
        return NextResponse.json({
            success: true,
            message: "Trash emptied successfully.",
        });
    } catch (error) {
        console.error("[EMPTY_TRASH]", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to empty trash.",
            },
            {
                status: 500,
            }
        );
    }
}