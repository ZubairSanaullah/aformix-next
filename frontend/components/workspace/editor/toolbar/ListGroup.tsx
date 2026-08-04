"use client";

import type { Editor } from "@tiptap/react";
import {
    List,
    ListOrdered,
    ListTodo,
    Quote,
    Minus,
} from "lucide-react";

import ToolbarButton from "./ToolbarButton";

interface Props {
    editor: Editor;
}

export default function ListGroup({
    editor,
}: Props) {
    return (
        <>
            <ToolbarButton
                icon={List}
                title="Bullet List"
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
                icon={ListTodo}
                title="Task List"
                active={editor.isActive("taskList")}
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .toggleTaskList()
                        .run()
                }
            />

            <ToolbarButton
                icon={Quote}
                title="Blockquote"
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
                icon={Minus}
                title="Horizontal Rule"
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .setHorizontalRule()
                        .run()
                }
            />
        </>
    );
}