"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { ImagePlus } from "lucide-react";

import ToolbarButton from "./toolbar/ToolbarButton";
import MediaPickerDialog from "@/components/workspace/media/MediaPickerDialog";
import { MediaItem } from "@/components/workspace/media/MediaCard";

interface Props {
    editor: Editor;
}

export default function MediaPickerButton({
    editor,
}: Props) {
    const [open, setOpen] = useState(false);

    function insertImage(media: MediaItem) {
        editor
            .chain()
            .focus()
            .setImage({
                src: media.url,
                alt: media.alt || media.originalName,
            })
            .run();
    }

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
                onSelect={insertImage}
            />
        </>
    );
}