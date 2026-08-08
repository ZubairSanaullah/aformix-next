import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const createFolderSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Folder name is required")
        .max(100, "Folder name must be 100 characters or less"),
});

/**
 * GET /api/folders
 *
 * Returns all folders with their active media count.
 */
export async function GET() {
    try {
        const folders = await prisma.folder.findMany({
            orderBy: {
                name: "asc",
            },
            include: {
                _count: {
                    select: {
                        media: {
                            where: {
                                deletedAt: null,
                            },
                        },
                    },
                },
            },
        });

        const formattedFolders = folders.map((folder) => ({
            id: folder.id,
            name: folder.name,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            mediaCount: folder._count.media,
        }));

        return NextResponse.json({
            folders: formattedFolders,
        });
    } catch (error) {
        console.error("GET /api/folders error:", error);

        return NextResponse.json(
            {
                error: "Failed to fetch folders",
            },
            {
                status: 500,
            },
        );
    }
}

/**
 * POST /api/folders
 *
 * Creates a new media folder.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = createFolderSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error:
                        result.error.issues[0]?.message ??
                        "Invalid folder name",
                },
                {
                    status: 400,
                },
            );
        }

        const name = result.data.name;

        const existingFolder = await prisma.folder.findUnique({
            where: {
                name,
            },
        });

        if (existingFolder) {
            return NextResponse.json(
                {
                    error: "A folder with this name already exists",
                },
                {
                    status: 409,
                },
            );
        }

        const folder = await prisma.folder.create({
            data: {
                name,
            },
        });

        return NextResponse.json(
            {
                folder: {
                    id: folder.id,
                    name: folder.name,
                    createdAt: folder.createdAt,
                    updatedAt: folder.updatedAt,
                    mediaCount: 0,
                },
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("POST /api/folders error:", error);

        return NextResponse.json(
            {
                error: "Failed to create folder",
            },
            {
                status: 500,
            },
        );
    }
}
