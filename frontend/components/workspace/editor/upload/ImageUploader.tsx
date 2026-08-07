"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { ImagePlus } from "lucide-react";

import ToolbarButton from "../toolbar/ToolbarButton";
import type { MediaItem } from "@/components/workspace/media/MediaCard";
import MediaPickerDialog from "@/components/workspace/media/MediaPickerDialog";

interface Props {
    editor: Editor;
}

export default function ImageUploader({
    editor,
}: Props) {
    const [open, setOpen] = useState(false);

    const handleSelect = (media: MediaItem) => {
        editor
            .chain()
            .focus()
            .setImage({
                src: media.url,
                alt:
                    media.alt ||
                    media.originalName,
            })
            .run();

        setOpen(false);
    };

    return (
        <>
            <ToolbarButton
                icon={ImagePlus}
                title="Insert Image"
                onClick={() => setOpen(true)}
            />

            <MediaPickerDialog
                open={open}
                onClose={() => setOpen(false)}
                onSelect={handleSelect}
            />
        </>
    );
}