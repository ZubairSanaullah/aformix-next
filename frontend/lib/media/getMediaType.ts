import { MediaType } from "@prisma/client";

export function getMediaType(
    mimeType: string
): MediaType {
    if (mimeType.startsWith("image/")) {
        return MediaType.IMAGE;
    }

    if (mimeType.startsWith("video/")) {
        return MediaType.VIDEO;
    }

    if (mimeType.startsWith("audio/")) {
        return MediaType.AUDIO;
    }

    if (
        mimeType.includes("pdf") ||
        mimeType.includes("document") ||
        mimeType.includes("msword") ||
        mimeType.includes("officedocument")
    ) {
        return MediaType.DOCUMENT;
    }

    return MediaType.OTHER;
}