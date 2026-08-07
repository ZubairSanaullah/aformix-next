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
         * image/*       → IMAGE
         * video/*       → VIDEO
         * audio/*       → AUDIO
         * application/pdf → DOCUMENT
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

        const { data } =
            supabaseAdmin.storage
                .from("media")
                .getPublicUrl(filename);

        const media = await prisma.media.create({
            data: {
                filename,
                originalName: file.name,
                url: data.publicUrl,
                mimeType: file.type,
                type,
                size: file.size,
                width,
                height,
                folder: "uploads",
                alt: null,
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