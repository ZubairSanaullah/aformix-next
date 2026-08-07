import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaType, Prisma } from "@prisma/client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const status = searchParams.get("status");
        const query = searchParams.get("q")?.trim();
        const type = searchParams.get("type");
        const folder = searchParams.get("folder")?.trim();

        const page = Math.max(
            1,
            Number(searchParams.get("page")) || 1
        );

        const limit = Math.min(
            100,
            Math.max(
                1,
                Number(searchParams.get("limit")) || 24
            )
        );

        const where: Prisma.MediaWhereInput = {
            deletedAt:
                status === "trash"
                    ? { not: null }
                    : null,

            ...(query
                ? {
                    OR: [
                        {
                            originalName: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                        {
                            filename: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                        {
                            alt: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),

            ...(type &&
                Object.values(MediaType).includes(
                    type as MediaType
                )
                ? {
                    type: type as MediaType,
                }
                : {}),

            ...(folder
                ? {
                    folder,
                }
                : {}),
        };

        const [total, media] =
            await Promise.all([
                prisma.media.count({
                    where,
                }),

                prisma.media.findMany({
                    where,
                    orderBy:
                        status === "trash"
                            ? {
                                updatedAt: "desc",
                            }
                            : {
                                createdAt: "desc",
                            },
                    skip:
                        (page - 1) * limit,
                    take: limit,
                }),
            ]);

        const totalPages = Math.ceil(
            total / limit
        );

        const safePage =
            totalPages > 0
                ? Math.min(page, totalPages)
                : 1;

        /*
         * If the requested page is beyond the
         * available pages, fetch the correct page.
         */
        const finalMedia =
            safePage === page
                ? media
                : await prisma.media.findMany({
                    where,
                    orderBy:
                        status === "trash"
                            ? {
                                updatedAt: "desc",
                            }
                            : {
                                createdAt: "desc",
                            },
                    skip:
                        (safePage - 1) *
                        limit,
                    take: limit,
                });

        return NextResponse.json({
            media: finalMedia,

            pagination: {
                page: safePage,
                limit,
                total,
                totalPages,

                hasNextPage:
                    safePage < totalPages,

                hasPreviousPage:
                    safePage > 1,
            },
        });
    } catch (error) {
        console.error(
            "[MEDIA_GET]",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Failed to fetch media",
            },
            {
                status: 500,
            }
        );
    }
}