"use client";

import type { Editor } from "@tiptap/react";
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from "lucide-react";

import ToolbarButton from "./ToolbarButton";

interface Props {
    editor: Editor;
}

export default function AlignmentGroup({
    editor,
}: Props) {
    return (
        <>
            <ToolbarButton
                icon={AlignLeft}
                title="Align Left"
                active={editor.isActive({ textAlign: "left" })}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
            />

            <ToolbarButton
                icon={AlignCenter}
                title="Align Center"
                active={editor.isActive({ textAlign: "center" })}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
            />

            <ToolbarButton
                icon={AlignRight}
                title="Align Right"
                active={editor.isActive({ textAlign: "right" })}
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
            />

            <ToolbarButton
                icon={AlignJustify}
                title="Justify"
                active={editor.isActive({ textAlign: "justify" })}
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            />
        </>
    );
}