"use client";

import type { Editor } from "@tiptap/react";
import { FloatingMenu as TiptapFloatingMenu } from "@tiptap/react/menus";
import {
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    CodeSquare,
} from "lucide-react";

import ToolbarButton from "../toolbar/ToolbarButton";

interface Props {
    editor: Editor;
}

export default function FloatingMenu({ editor }: Props) {
    if (!editor) return null;

    return (
        <TiptapFloatingMenu
            editor={editor}
            tippyOptions={{
                duration: 150,
                placement: "right",
            }}
        >
            <div className="flex items-center gap-1 rounded-xl border bg-background p-1 shadow-lg">
                <ToolbarButton
                    icon={Heading1}
                    title="Heading 1"
                    size="sm"
                    active={editor.isActive("heading", {
                        level: 1,
                    })}
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                    }
                />

                <ToolbarButton
                    icon={Heading2}
                    title="Heading 2"
                    size="sm"
                    active={editor.isActive("heading", {
                        level: 2,
                    })}
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                    }
                />

                <ToolbarButton
                    icon={List}
                    title="Bullet List"
                    size="sm"
                    active={editor.isActive("bulletList")}
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleBulletList()
                            .run()
                    }
                />

                <ToolbarButton
                    icon={ListOrdered}
                    title="Ordered List"
                    size="sm"
                    active={editor.isActive("orderedList")}
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleOrderedList()
                            .run()
                    }
                />

                <ToolbarButton
                    icon={Quote}
                    title="Quote"
                    size="sm"
                    active={editor.isActive("blockquote")}
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleBlockquote()
                            .run()
                    }
                />

                <ToolbarButton
                    icon={CodeSquare}
                    title="Code Block"
                    size="sm"
                    active={editor.isActive("codeBlock")}
                    onClick={() =>
                        editor
                            .chain()
                            .focus()
                            .toggleCodeBlock()
                            .run()
                    }
                />
            </div>
        </TiptapFloatingMenu>
    );
}