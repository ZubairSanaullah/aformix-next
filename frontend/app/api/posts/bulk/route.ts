import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

export async function POST(request: Request) {
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

        const { ids, action } = await request.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No posts selected.",
                },
                { status: 400 }
            );
        }

        const isAdmin = session.user.role === "ADMIN";

        if (!isAdmin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden",
                },
                { status: 403 }
            );
        }

        switch (action) {
            case "publish":
                await prisma.post.updateMany({
                    where: {
                        id: {
                            in: ids,
                        },
                        deletedAt: null,
                        status: {
                            not: PostStatus.PUBLISHED,
                        },
                    },
                    data: {
                        status: PostStatus.PUBLISHED,
                        publishedAt: new Date(),
                    },
                });
                break;

            case "archive":
                await prisma.post.updateMany({
                    where: {
                        id: {
                            in: ids,
                        },
                        deletedAt: null,
                    },
                    data: {
                        status: PostStatus.ARCHIVED,
                    },
                });
                break;

            case "delete":
                await prisma.post.updateMany({
                    where: {
                        id: {
                            in: ids,
                        },
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });
                break;

            case "restore":
                await prisma.post.updateMany({
                    where: {
                        id: {
                            in: ids,
                        },
                        deletedAt: {
                            not: null,
                        },
                    },
                    data: {
                        deletedAt: null,
                    },
                });
                break;

            case "permanentDelete":
                await prisma.post.deleteMany({
                    where: {
                        id: {
                            in: ids,
                        },
                        deletedAt: {
                            not: null,
                        },
                    },
                });
                break;

            default:
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid action.",
                    },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            message: "Bulk action completed successfully.",
        });
    } catch (error) {
        console.error("[POST_BULK]", error);

        return NextResponse.json(
            {
                success: false,
                message: "Bulk action failed.",
            },
            { status: 500 }
        );
    }
}