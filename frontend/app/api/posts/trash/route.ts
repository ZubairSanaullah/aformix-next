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
                {
                    status: 401,
                }
            );
        }

        await prisma.post.deleteMany({
            where: {
                deletedAt: {
                    not: null,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Trash emptied successfully.",
        });
    } catch (error) {
        console.error(error);

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