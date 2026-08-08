"use client";

import { useState } from "react";
import Image from "next/image";
import {
    ImageIcon,
    Trash2,
    Upload,
} from "lucide-react";
import { toast } from "sonner";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

interface FeaturedImagePanelProps {
    value?: string | null;
    onChange: (url: string | null) => void;
}

export default function FeaturedImagePanel({
    value,
    onChange,
}: FeaturedImagePanelProps) {
    const [uploading, setUploading] =
        useState(false);

    async function handleUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file =
            event.target.files?.[0];

        if (!file) return;

        try {
            setUploading(true);

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            const response = await fetch(
                "/api/media/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Upload failed."
                );
            }

            onChange(data.url);

            toast.success(
                "Featured image uploaded."
            );
        } catch (error) {
            console.error(error);

            toast.error(
                "Failed to upload image."
            );
        } finally {
            setUploading(false);

            event.target.value = "";
        }
    }

    return (
        <WorkspaceCard
            padding="lg"
            className="space-y-5"
        >
            <div>
                <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                    Featured Image
                </h2>

                <p className="mt-1 text-xs text-[var(--workspace-text-muted)]">
                    Choose the primary image for this
                    post.
                </p>
            </div>

            {value ? (
                <div className="space-y-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--workspace-border)] bg-[var(--workspace-surface-soft)]">
                        <Image
                            src={value}
                            alt="Featured image"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <WorkspaceButton
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                            onChange(null)
                        }
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove Image
                    </WorkspaceButton>
                </div>
            ) : (
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--workspace-border)] bg-[var(--workspace-surface-soft)] px-6 py-10 text-center transition hover:border-[var(--workspace-primary)]/40 hover:bg-[var(--workspace-primary-soft)]/30">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                        {uploading ? (
                            <Upload className="h-4 w-4 animate-pulse" />
                        ) : (
                            <ImageIcon className="h-4 w-4" />
                        )}
                    </div>

                    <span className="mt-3 text-xs font-medium text-[var(--workspace-text)]">
                        {uploading
                            ? "Uploading..."
                            : "Choose featured image"}
                    </span>

                    <span className="mt-1 text-[10px] text-[var(--workspace-text-subtle)]">
                        JPG, PNG, WEBP
                    </span>

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={
                            handleUpload
                        }
                    />
                </label>
            )}
        </WorkspaceCard>
    );
}