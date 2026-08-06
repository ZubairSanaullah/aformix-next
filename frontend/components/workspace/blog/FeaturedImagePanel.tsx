"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Trash2 } from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

interface FeaturedImagePanelProps {
    value?: string | null;
    onChange: (url: string | null) => void;
}

export default function FeaturedImagePanel({
    value,
    onChange,
}: FeaturedImagePanelProps) {
    const [uploading, setUploading] = useState(false);

    async function handleUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            setUploading(true);

            const formData = new FormData();

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
                    "Upload failed"
                );
            }


            onChange(data.url);

        } catch (error) {
            console.error(error);

            alert(
                "Failed to upload image."
            );

        } finally {
            setUploading(false);
        }
    }


    return (
        <GlassCard className="space-y-5 p-6">

            <div className="flex items-center gap-2">

                <ImageIcon className="h-5 w-5" />

                <h2 className="font-semibold">
                    Featured Image
                </h2>

            </div>


            {value ? (

                <div className="space-y-4">

                    <div className="relative aspect-video overflow-hidden rounded-xl border">

                        <Image
                            src={value}
                            alt="Featured image"
                            fill
                            className="object-cover"
                        />

                    </div>


                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                            onChange(null)
                        }
                    >

                        <Trash2 className="mr-2 h-4 w-4" />

                        Remove Image

                    </Button>

                </div>

            ) : (

                <label
                    className="
                        flex
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-dashed
                        p-8
                        text-center
                    "
                >

                    <ImageIcon className="mb-3 h-8 w-8" />


                    <span className="text-sm">
                        {uploading
                            ? "Uploading..."
                            : "Choose featured image"}
                    </span>


                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={handleUpload}
                    />

                </label>

            )}

        </GlassCard>
    );
}