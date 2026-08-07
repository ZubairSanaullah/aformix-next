"use client";

import { toast } from "sonner";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import {
    UploadCloud,
    X,
    ImageIcon,
    FileVideo,
    FileAudio,
    FileText,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { MediaItem } from "./MediaCard";

interface UploadingFile {
    id: string;
    file: File;
    previewUrl: string;
    progress: number;
    status: "uploading" | "success" | "error";
    errorMessage?: string;
}

interface UploadDropzoneProps {
    onUploadComplete?: (media: MediaItem) => void;
    accept?: string;
    maxSizeMb?: number;
}

const DEFAULT_ACCEPT = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/mp4",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
].join(",");

function getFileType(file: File) {
    if (file.type.startsWith("image/")) {
        return "IMAGE";
    }

    if (file.type.startsWith("video/")) {
        return "VIDEO";
    }

    if (file.type.startsWith("audio/")) {
        return "AUDIO";
    }

    if (
        file.type === "application/pdf" ||
        file.type.includes("word") ||
        file.type.includes("excel") ||
        file.type.includes("spreadsheet") ||
        file.type.includes("powerpoint") ||
        file.type.includes("presentation") ||
        file.type === "text/plain" ||
        file.type === "text/csv"
    ) {
        return "DOCUMENT";
    }

    return "OTHER";


}

function getPreviewIcon(file: File) {
    const type = getFileType(file);

    switch (type) {
        case "IMAGE":
            return (
                <ImageIcon className="h-8 w-8" />
            );

        case "VIDEO":
            return (
                <FileVideo className="h-8 w-8" />
            );

        case "AUDIO":
            return (
                <FileAudio className="h-8 w-8" />
            );

        default:
            return (
                <FileText className="h-8 w-8" />
            );
    }
}

export function UploadDropzone({
    onUploadComplete,
    accept = DEFAULT_ACCEPT,
    maxSizeMb = 50,
}: UploadDropzoneProps) {
    const router = useRouter();

    const [isDragging, setIsDragging] =
        useState(false);

    const [files, setFiles] =
        useState<UploadingFile[]>([]);

    const inputRef =
        useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            files.forEach((file) => {
                URL.revokeObjectURL(
                    file.previewUrl
                );
            });
        };
    }, [files]);

    const removeFile = useCallback(
        (id: string) => {
            setFiles((prev) => {
                const target = prev.find(
                    (f) => f.id === id
                );

                if (target) {
                    URL.revokeObjectURL(
                        target.previewUrl
                    );
                }

                return prev.filter(
                    (f) => f.id !== id
                );
            });
        },
        []
    );

    const uploadFile = useCallback(
        (uploadingFile: UploadingFile) => {
            const formData =
                new FormData();

            formData.append(
                "file",
                uploadingFile.file
            );

            const xhr =
                new XMLHttpRequest();

            xhr.upload.addEventListener(
                "progress",
                (event) => {
                    if (
                        event.lengthComputable
                    ) {
                        const progress =
                            Math.round(
                                (event.loaded /
                                    event.total) *
                                100
                            );

                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id ===
                                    uploadingFile.id
                                    ? {
                                        ...f,
                                        progress,
                                    }
                                    : f
                            )
                        );
                    }
                }
            );

            xhr.addEventListener(
                "load",
                () => {
                    if (
                        xhr.status >= 200 &&
                        xhr.status < 300
                    ) {
                        try {
                            const data =
                                JSON.parse(
                                    xhr.responseText
                                );

                            setFiles((prev) =>
                                prev.map((f) =>
                                    f.id ===
                                        uploadingFile.id
                                        ? {
                                            ...f,
                                            status:
                                                "success",
                                            progress: 100,
                                        }
                                        : f
                                )
                            );

                            onUploadComplete?.(
                                data
                            );

                            router.refresh();

                            toast.success(
                                `${uploadingFile.file.name} uploaded successfully.`
                            );

                            setTimeout(() => {
                                removeFile(
                                    uploadingFile.id
                                );
                            }, 1500);
                        } catch {
                            toast.error(
                                "Invalid server response."
                            );

                            setFiles((prev) =>
                                prev.map((f) =>
                                    f.id ===
                                        uploadingFile.id
                                        ? {
                                            ...f,
                                            status:
                                                "error",
                                            errorMessage:
                                                "Invalid server response.",
                                        }
                                        : f
                                )
                            );
                        }

                        return;
                    }

                    let message =
                        "Upload failed.";

                    try {
                        message =
                            JSON.parse(
                                xhr.responseText
                            ).message ??
                            message;
                    } catch { }

                    toast.error(message);

                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id ===
                                uploadingFile.id
                                ? {
                                    ...f,
                                    status:
                                        "error",
                                    errorMessage:
                                        message,
                                }
                                : f
                        )
                    );
                }
            );

            xhr.addEventListener(
                "error",
                () => {
                    toast.error(
                        "Network error."
                    );

                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id ===
                                uploadingFile.id
                                ? {
                                    ...f,
                                    status:
                                        "error",
                                    errorMessage:
                                        "Network error.",
                                }
                                : f
                        )
                    );
                }
            );

            xhr.open(
                "POST",
                "/api/media/upload"
            );

            xhr.send(formData);
        },
        [
            onUploadComplete,
            router,
            removeFile,
        ]
    );

    const handleFiles = useCallback(
        (fileList: FileList | null) => {
            if (
                !fileList ||
                fileList.length === 0
            ) {
                return;
            }

            const newFiles: UploadingFile[] =
                [];

            Array.from(fileList).forEach(
                (file) => {
                    const acceptedTypes =
                        accept
                            .split(",")
                            .map((type) =>
                                type.trim()
                            )
                            .filter(Boolean);

                    const isAccepted =
                        acceptedTypes.some(
                            (type) => {
                                if (
                                    type.endsWith(
                                        "/*"
                                    )
                                ) {
                                    return file.type.startsWith(
                                        type.slice(
                                            0,
                                            -1
                                        )
                                    );
                                }

                                return (
                                    file.type ===
                                    type
                                );
                            }
                        );

                    if (!isAccepted) {
                        newFiles.push({
                            id: crypto.randomUUID(),
                            file,
                            previewUrl:
                                "",
                            progress: 0,
                            status: "error",
                            errorMessage:
                                "Unsupported file type.",
                        });

                        return;
                    }

                    if (
                        file.size >
                        maxSizeMb *
                        1024 *
                        1024
                    ) {
                        newFiles.push({
                            id: crypto.randomUUID(),
                            file,
                            previewUrl:
                                "",
                            progress: 0,
                            status: "error",
                            errorMessage: `Exceeds ${maxSizeMb}MB limit`,
                        });

                        return;
                    }

                    const previewUrl =
                        file.type.startsWith(
                            "image/"
                        ) ||
                            file.type.startsWith(
                                "video/"
                            )
                            ? URL.createObjectURL(
                                file
                            )
                            : "";

                    newFiles.push({
                        id: crypto.randomUUID(),
                        file,
                        previewUrl,
                        progress: 0,
                        status: "uploading",
                    });
                }
            );

            setFiles((prev) => [
                ...prev,
                ...newFiles,
            ]);

            newFiles
                .filter(
                    (f) =>
                        f.status ===
                        "uploading"
                )
                .forEach(uploadFile);
        },
        [
            accept,
            maxSizeMb,
            uploadFile,
        ]
    );

    const handleDrop = useCallback(
        (
            e: React.DragEvent<HTMLDivElement>
        ) => {
            e.preventDefault();

            setIsDragging(false);

            handleFiles(
                e.dataTransfer.files
            );
        },
        [handleFiles]
    );

    return (
        <div className="w-full space-y-4">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() =>
                    setIsDragging(false)
                }
                onDrop={handleDrop}
                onClick={() => {
                    if (!isDragging) {
                        inputRef.current?.click();
                    }
                }}
                className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
            >
                <UploadCloud className="h-8 w-8 text-muted-foreground" />

                <p className="text-sm font-medium">
                    Drag & drop files here, or click to browse
                </p>

                <p className="text-xs text-muted-foreground">
                    Images, videos, audio, PDFs and documents up to{" "}
                    {maxSizeMb}MB
                </p>

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        handleFiles(
                            e.target.files
                        );

                        e.target.value = "";
                    }}
                />
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {files.map((f) => {
                        const type =
                            getFileType(
                                f.file
                            );

                        return (
                            <div
                                key={f.id}
                                className="relative overflow-hidden rounded-lg border bg-muted/30 shadow-sm"
                            >
                                <div className="relative aspect-square">
                                    {f.previewUrl ? (
                                        <img
                                            src={
                                                f.previewUrl
                                            }
                                            alt={
                                                f.file
                                                    .name
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                                            {getPreviewIcon(
                                                f.file
                                            )}

                                            <span className="text-[10px] font-medium">
                                                {
                                                    type
                                                }
                                            </span>
                                        </div>
                                    )}

                                    {f.status ===
                                        "uploading" && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                                                <div className="h-1.5 w-3/4 overflow-hidden rounded-full bg-white/30">
                                                    <div
                                                        className="h-full bg-white transition-all duration-300"
                                                        style={{
                                                            width: `${f.progress}%`,
                                                        }}
                                                    />
                                                </div>

                                                <span className="mt-2 text-xs font-medium">
                                                    {
                                                        f.progress
                                                    }
                                                    %
                                                </span>
                                            </div>
                                        )}

                                    {f.status ===
                                        "success" && (
                                            <div className="absolute right-2 top-2 rounded-full bg-white p-1 shadow">
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            </div>
                                        )}

                                    {f.status ===
                                        "error" && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-red-950/80 p-3 text-center text-white">
                                                <AlertCircle className="h-6 w-6" />

                                                <span className="text-[11px] leading-tight">
                                                    {
                                                        f.errorMessage
                                                    }
                                                </span>
                                            </div>
                                        )}

                                    <button
                                        type="button"
                                        onClick={(
                                            e
                                        ) => {
                                            e.stopPropagation();

                                            removeFile(
                                                f.id
                                            );
                                        }}
                                        className="absolute left-2 top-2 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>

                                <div className="space-y-1 p-2">
                                    <div className="flex items-center gap-1">
                                        {type ===
                                            "IMAGE" ? (
                                            <ImageIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                                        ) : type ===
                                            "VIDEO" ? (
                                            <FileVideo className="h-3 w-3 shrink-0 text-muted-foreground" />
                                        ) : type ===
                                            "AUDIO" ? (
                                            <FileAudio className="h-3 w-3 shrink-0 text-muted-foreground" />
                                        ) : (
                                            <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                                        )}

                                        <span
                                            className="truncate text-[11px] font-medium"
                                            title={
                                                f.file
                                                    .name
                                            }
                                        >
                                            {
                                                f
                                                    .file
                                                    .name
                                            }
                                        </span>
                                    </div>

                                    <p className="text-[10px] text-muted-foreground">
                                        {(
                                            f
                                                .file
                                                .size /
                                            1024 /
                                            1024
                                        ).toFixed(
                                            2
                                        )}{" "}
                                        MB
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}