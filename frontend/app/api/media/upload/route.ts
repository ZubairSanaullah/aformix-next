import crypto from "crypto";

import sharp from "sharp";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

import { validateMedia } from "@/lib/validations/media";
import { getMediaType } from "@/lib/media";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    message: "Unauthorized.",
                },
                {
                    status: 401,
                }
            );
        }

        const formData = await request.formData();

        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    message: "No file provided.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Optional folder ID.
         *
         * If the user is currently inside a folder,
         * UploadDropzone sends that folderId.
         *
         * If no folderId is provided, the file will
         * automatically go into the protected "uploads"
         * folder.
         */
        const folderIdValue = formData.get("folderId");

        const requestedFolderId =
            typeof folderIdValue === "string" &&
                folderIdValue.trim()
                ? folderIdValue.trim()
                : null;

        validateMedia(file);

        const extension =
            file.name.split(".").pop()?.toLowerCase() ?? "";

        const filename =
            `${crypto.randomUUID()}.${extension}`;

        const buffer = Buffer.from(
            await file.arrayBuffer()
        );

        /*
         * Determine the media type from the MIME type.
         *
         * image/*         → IMAGE
         * video/*         → VIDEO
         * audio/*         → AUDIO
         * documents       → DOCUMENT
         * everything else → OTHER
         */
        const type = getMediaType(file.type);

        /*
         * Only images should be processed with Sharp.
         *
         * PDFs, videos, audio files, etc. should not be
         * passed through Sharp.
         */
        let width: number | undefined;
        let height: number | undefined;

        if (type === "IMAGE") {
            const imageMetadata =
                await sharp(buffer).metadata();

            width = imageMetadata.width;
            height = imageMetadata.height;
        }

        /*
         * Upload the physical file to Supabase Storage.
         */
        const { error } = await supabaseAdmin.storage
            .from("media")
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error(
                "[SUPABASE_UPLOAD]",
                error
            );

            return NextResponse.json(
                {
                    message:
                        "Failed to upload file.",
                },
                {
                    status: 500,
                }
            );
        }

        /*
         * Get the public URL for the uploaded file.
         */
        const { data } =
            supabaseAdmin.storage
                .from("media")
                .getPublicUrl(filename);

        const url = data.publicUrl;

        /*
         * Resolve the folder.
         *
         * If a folderId was supplied:
         *   → verify that the folder exists.
         *
         * If no folderId was supplied:
         *   → use/create the protected "uploads" folder.
         */
        let resolvedFolderId: string;

        if (requestedFolderId) {
            const folder = await prisma.folder.findUnique({
                where: {
                    id: requestedFolderId,
                },
            });

            if (!folder) {
                /*
                 * The file has already been uploaded to
                 * Supabase at this point, so remove it if
                 * the requested folder doesn't exist.
                 */
                await supabaseAdmin.storage
                    .from("media")
                    .remove([filename]);

                return NextResponse.json(
                    {
                        message:
                            "Selected folder not found.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            resolvedFolderId = folder.id;
        } else {
            /*
             * "uploads" is the default/protected folder.
             *
             * upsert makes this self-healing if the folder
             * somehow doesn't exist.
             */
            const uploadsFolder =
                await prisma.folder.upsert({
                    where: {
                        name: "uploads",
                    },
                    update: {},
                    create: {
                        name: "uploads",
                    },
                });

            resolvedFolderId = uploadsFolder.id;
        }

        /*
         * Create the Media database record.
         *
         * IMPORTANT:
         * Media.folder is now a Prisma relation.
         * We therefore use folderId instead of the old:
         *
         *     folder: "uploads"
         */
        const media = await prisma.media.create({
            data: {
                filename,
                originalName: file.name,
                url,
                mimeType: file.type,
                type,
                size: file.size,
                width,
                height,
                folderId: resolvedFolderId,
                alt: null,
            },

            include: {
                folder: true,
            },
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error(
            "[MEDIA_UPLOAD]",
            error
        );

        return NextResponse.json(
            {
                message: "Upload failed.",
            },
            {
                status: 500,
            }
        );
    }
}
