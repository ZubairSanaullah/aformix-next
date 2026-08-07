const ALLOWED_MEDIA_TYPES = [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",


    // Videos
    "video/mp4",
    "video/webm",
    "video/quicktime",

    // Audio
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/mp4",

    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Text
    "text/plain",
    "text/csv",


];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function validateMedia(file: File) {
    if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
        throw new Error(
            `Unsupported file type: ${file.type || "unknown"}`
        );
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(
            "File size exceeds the 50 MB limit."
        );
    }

}

export {
    ALLOWED_MEDIA_TYPES,
    MAX_FILE_SIZE,
};
