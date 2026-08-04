"use client";

import type { Editor } from "@tiptap/react";
import {
    Undo2,
    Redo2,
} from "lucide-react";

import ToolbarButton from "./ToolbarButton";

interface Props {
    editor: Editor;
}

export default function HistoryGroup({
    editor,
}: Props) {
    return (
        <>
            <ToolbarButton
                icon={Undo2}
                title="Undo"
                disabled={!editor.can().chain().focus().undo().run()}
                onClick={() => editor.chain().focus().undo().run()}
            />

            <ToolbarButton
                icon={Redo2}
                title="Redo"
                disabled={!editor.can().chain().focus().redo().run()}
                onClick={() => editor.chain().focus().redo().run()}
            />
        </>
    );
}