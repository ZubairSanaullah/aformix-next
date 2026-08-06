import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const { ids, action } = await request.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: "No posts selected." },
                { status: 400 }
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
                        error: "Invalid action.",
                    },
                    {
                        status: 400,
                    }
                );
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("[POST_BULK]", error);

        return NextResponse.json(
            {
                error: "Bulk action failed.",
            },
            {
                status: 500,
            }
        );
    }
}