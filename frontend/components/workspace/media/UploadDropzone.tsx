"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadingFile {
    id: string;
    file: File;
    previewUrl: string;
    progress: number;
    status: "uploading" | "success" | "error";
    errorMessage?: string;
}

interface UploadDropzoneProps {
    onUploadComplete?: (media: {
        id: string;
        filename: string;
        url: string;
        mimeType: string;
        size: number;
        width?: number;
        height?: number;
    }) => void;
    accept?: string;
    maxSizeMb?: number;
}

export function UploadDropzone({
    onUploadComplete,
    accept = "image/*",
    maxSizeMb = 10,
}: UploadDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<UploadingFile[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFile = useCallback(
        (uploadingFile: UploadingFile) => {
            const formData = new FormData();
            formData.append("file", uploadingFile.file);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadingFile.id ? { ...f, progress } : f
                        )
                    );
                }
            });

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id === uploadingFile.id
                                    ? { ...f, status: "success", progress: 100 }
                                    : f
                            )
                        );
                        onUploadComplete?.(data);
                    } catch {
                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id === uploadingFile.id
                                    ? {
                                        ...f,
                                        status: "error",
                                        errorMessage: "Invalid server response",
                                    }
                                    : f
                            )
                        );
                    }
                } else {
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === uploadingFile.id
                                ? {
                                    ...f,
                                    status: "error",
                                    errorMessage: `Upload failed (${xhr.status})`,
                                }
                                : f
                        )
                    );
                }
            });

            xhr.addEventListener("error", () => {
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === uploadingFile.id
                            ? { ...f, status: "error", errorMessage: "Network error" }
                            : f
                    )
                );
            });

            xhr.open("POST", "/api/media/upload");
            xhr.send(formData);
        },
        [onUploadComplete]
    );

    const handleFiles = useCallback(
        (fileList: FileList | null) => {
            if (!fileList || fileList.length === 0) return;

            const newFiles: UploadingFile[] = [];

            Array.from(fileList).forEach((file) => {
                if (!file.type.startsWith("image/")) return;

                if (file.size > maxSizeMb * 1024 * 1024) {
                    newFiles.push({
                        id: crypto.randomUUID(),
                        file,
                        previewUrl: URL.createObjectURL(file),
                        progress: 0,
                        status: "error",
                        errorMessage: `Exceeds ${maxSizeMb}MB limit`,
                    });
                    return;
                }

                newFiles.push({
                    id: crypto.randomUUID(),
                    file,
                    previewUrl: URL.createObjectURL(file),
                    progress: 0,
                    status: "uploading",
                });
            });

            setFiles((prev) => [...prev, ...newFiles]);

            newFiles
                .filter((f) => f.status === "uploading")
                .forEach((f) => uploadFile(f));
        },
        [maxSizeMb, uploadFile]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const target = prev.find((f) => f.id === id);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((f) => f.id !== id);
        });
    };

    return (
        <div className="w-full space-y-4">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-colors",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
            >
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">
                    Drag & drop images here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF, WEBP up to {maxSizeMb}MB
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = "";
                    }}
                />
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {files.map((f) => (
                        <div
                            key={f.id}
                            className="relative overflow-hidden rounded-md border bg-muted/30"
                        >
                            <div className="relative aspect-square w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={f.previewUrl}
                                    alt={f.file.name}
                                    className="h-full w-full object-cover"
                                />

                                {f.status === "uploading" && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
                                        <div className="h-1.5 w-3/4 overflow-hidden rounded-full bg-white/30">
                                            <div
                                                className="h-full bg-white transition-all"
                                                style={{ width: `${f.progress}%` }}
                                            />
                                        </div>
                                        <span className="mt-1 text-xs">{f.progress}%</span>
                                    </div>
                                )}

                                {f.status === "success" && (
                                    <div className="absolute right-1.5 top-1.5 rounded-full bg-white p-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                )}

                                {f.status === "error" && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-950/70 p-2 text-center text-white">
                                        <AlertCircle className="h-5 w-5" />
                                        <span className="text-[10px] leading-tight">
                                            {f.errorMessage}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(f.id);
                                }}
                                className="absolute left-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                            >
                                <X className="h-3 w-3" />
                            </button>

                            <div className="flex items-center gap-1 px-2 py-1 text-[11px] text-muted-foreground">
                                <ImageIcon className="h-3 w-3 shrink-0" />
                                <span className="truncate">{f.file.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}