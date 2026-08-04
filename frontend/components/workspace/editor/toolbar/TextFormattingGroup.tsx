"use client";

import type { Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
} from "lucide-react";

import ToolbarButton from "./ToolbarButton";

interface Props {
    editor: Editor;
}

export default function TextFormattingGroup({
    editor,
}: Props) {
    return (
        <>
            <ToolbarButton
                icon={Bold}
                title="Bold"
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
            />

            <ToolbarButton
                icon={Italic}
                title="Italic"
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            />

            <ToolbarButton
                icon={Underline}
                title="Underline"
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            />

            <ToolbarButton
                icon={Strikethrough}
                title="Strike"
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            />
        </>
    );
}