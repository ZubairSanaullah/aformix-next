"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code2,
    Highlighter,
} from "lucide-react";

import ToolbarButton from "../toolbar/ToolbarButton";

interface Props {
    editor: Editor;
}

export default function BubbleMenu({
    editor,
}: Props) {
    if (!editor) return null;

    return (
        <TiptapBubbleMenu
            editor={editor}
            tippyOptions={{
                duration: 150,
                placement: "top",
            }}
        >
            <div className="flex items-center gap-1 rounded-xl border bg-background p-1 shadow-lg">
                <ToolbarButton
                    icon={Bold}
                    title="Bold"
                    active={editor.isActive("bold")}
                    onClick={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                />

                <ToolbarButton
                    icon={Italic}
                    title="Italic"
                    active={editor.isActive("italic")}
                    onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                />

                <ToolbarButton
                    icon={Underline}
                    title="Underline"
                    active={editor.isActive("underline")}
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                />

                <ToolbarButton
                    icon={Strikethrough}
                    title="Strike"
                    active={editor.isActive("strike")}
                    onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                    }
                />

                <ToolbarButton
                    icon={Highlighter}
                    title="Highlight"
                    active={editor.isActive("highlight")}
                    onClick={() =>
                        editor.chain().focus().toggleHighlight().run()
                    }
                />

                <ToolbarButton
                    icon={Code2}
                    title="Inline Code"
                    active={editor.isActive("code")}
                    onClick={() =>
                        editor.chain().focus().toggleCode().run()
                    }
                />
            </div>
        </TiptapBubbleMenu>
    );
}