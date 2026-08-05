import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const extension = file.name.split(".").pop();
        const filename = `${crypto.randomUUID()}.${extension}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        const { error } = await supabaseAdmin.storage
            .from("media")
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("[SUPABASE_UPLOAD]", error);

            return NextResponse.json(
                { error: "Failed to upload image" },
                { status: 500 }
            );
        }

        const { data } = supabaseAdmin.storage
            .from("media")
            .getPublicUrl(filename);

        const media = await prisma.media.create({
            data: {
                filename,
                originalName: file.name,
                url: data.publicUrl,
                mimeType: file.type,
                size: file.size,
            },
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error("[MEDIA_UPLOAD]", error);

        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}