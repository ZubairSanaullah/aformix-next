"use client";

import { useRef } from "react";
import type { Editor } from "@tiptap/react";
import { ImagePlus } from "lucide-react";

import ToolbarButton from "../toolbar/ToolbarButton";
import { uploadImage } from "@/lib/editor/uploadImage";

interface Props {
    editor: Editor;
}

export default function ImageUploader({ editor }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    function openPicker() {
        inputRef.current?.click();
    }

    async function handleChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        const media = await uploadImage(file);

        editor
            .chain()
            .focus()
            .setImage({
                src: media.url,
                alt: media.originalName,
            })
            .run();

        event.target.value = "";
    }

    return (
        <>
            <ToolbarButton
                icon={ImagePlus}
                title="Insert Image"
                onClick={openPicker}
            />

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleChange}
            />
        </>
    );
}