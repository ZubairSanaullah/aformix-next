import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function saveFile(file: File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension =
        path.extname(file.name) || "";

    const filename =
        `${crypto.randomUUID()}${extension}`;

    const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads"
    );

    await mkdir(uploadDir, {
        recursive: true,
    });

    const filepath = path.join(
        uploadDir,
        filename
    );

    await writeFile(filepath, buffer);

    return {
        filename,
        filepath,
        url: `/uploads/${filename}`,
        buffer,
        extension: extension.replace(".", ""),
    };
}