import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaType, Prisma } from "@prisma/client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const status = searchParams.get("status");
        const query = searchParams.get("q")?.trim();
        const type = searchParams.get("type");
        const folderId = searchParams.get("folderId")?.trim();

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

        /*
         * Build the Prisma Media filter.
         *
         * Media.folder is a relation to Folder,
         * therefore folder filtering must use:
         *
         * folder: {
         *     is: {
         *         id: folderId
         *     }
         * }
         */
        const where: Prisma.MediaWhereInput = {
            /*
             * Active media:
             * deletedAt = null
             *
             * Trash:
             * deletedAt != null
             */
            deletedAt:
                status === "trash"
                    ? { not: null }
                    : null,

            /*
             * Search by original filename,
             * stored filename, or alt text.
             */
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

            /*
             * Filter by MediaType when supplied.
             */
            ...(type &&
                Object.values(MediaType).includes(
                    type as MediaType
                )
                ? {
                    type: type as MediaType,
                }
                : {}),

            /*
             * Folder is a Prisma relation.
             *
             * Empty folderId means:
             *     all folders
             *
             * Specific folderId means:
             *     media belonging to that folder
             */
            ...(folderId
                ? {
                    folder: {
                        is: {
                            id: folderId,
                        },
                    },
                }
                : {}),
        };

        /*
         * Count and fetch media in parallel.
         */
        const [total, media] = await Promise.all([
            prisma.media.count({
                where,
            }),

            prisma.media.findMany({
                where,

                /*
                 * Trash is sorted by updatedAt so recently
                 * modified/deleted items appear first.
                 *
                 * Active media is sorted by creation date.
                 */
                orderBy:
                    status === "trash"
                        ? {
                            updatedAt: "desc",
                        }
                        : {
                            createdAt: "desc",
                        },

                skip: (page - 1) * limit,

                take: limit,

                /*
                 * Include the related folder so the frontend
                 * can access folder information if needed.
                 */
                include: {
                    folder: true,
                },
            }),
        ]);

        const totalPages = Math.ceil(
            total / limit
        );

        /*
         * Protect against requesting a page that no longer
         * exists after deleting/filtering media.
         */
        const safePage =
            totalPages > 0
                ? Math.min(page, totalPages)
                : 1;

        /*
         * If the requested page is beyond the available
         * pages, fetch the correct final page.
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

                    include: {
                        folder: true,
                    },
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
                error: "Failed to fetch media",
            },
            {
                status: 500,
            }
        );
    }
}
