export interface UploadedMedia {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "OTHER";
    size: number;
    width?: number | null;
    height?: number | null;
    folderId?: string | null;
    alt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export async function uploadImage(
    file: File,
    folderId?: string
): Promise<UploadedMedia> {
    const formData = new FormData();

    formData.append("file", file);

    if (folderId) {
        formData.append("folderId", folderId);
    }

    const response = await fetch(
        "/api/media/upload",
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Failed to upload image."
        );
    }

    return data;
}