"use client";

import "./EditorStyles.css";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import { editorExtensions } from "./extensions";
import Toolbar from "./toolbar/Toolbar";
import EditorFooter from "./toolbar/EditorFooter";
import BubbleMenu from "./menus/BubbleMenu";
import FloatingMenu from "./menus/FloatingMenu";
import { uploadImage } from "@/lib/editor/uploadImage";


interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    editable?: boolean;
    showToolbar?: boolean;
}

export default function Editor({
    value,
    onChange,
    editable = true,
    showToolbar = true,
}: EditorProps) {
    const editorRef = useRef<any>(null);

    const handleImageUpload = async (file: File) => {
        const src = await uploadImage(file);

        editorRef.current
            ?.chain()
            .focus()
            .setImage({
                src,
                alt: file.name,
            })
            .run();
    };

    const editor = useEditor({
        extensions: editorExtensions,

        content: value,

        editable,

        immediatelyRender: false,

        editorProps: {
            attributes: {
                class: "tiptap min-h-[400px] focus:outline-none",
            },

            handleDrop(view, event) {
                const file = event.dataTransfer?.files?.[0];

                if (!file || !file.type.startsWith("image/")) {
                    return false;
                }

                handleImageUpload(file);

                return true;
            },

            handlePaste(view, event) {
                const items = event.clipboardData?.items;

                if (!items) return false;

                for (const item of items) {
                    if (item.type.startsWith("image/")) {
                        const file = item.getAsFile();

                        if (file) {
                            handleImageUpload(file);
                            return true;
                        }
                    }
                }

                return false;
            },
        },

        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        editorRef.current = editor;
    }, [editor]);

    useEffect(() => {
        if (!editor) return;

        const current = editor.getHTML();

        if (current !== value) {
            editor.commands.setContent(value, {
                emitUpdate: false,
            });
        }
    }, [editor, value]);

    if (!editor) return null;

    return (
        <div className="editor-container">
            {showToolbar && (
                <>
                    <Toolbar editor={editor} />

                    <BubbleMenu editor={editor} />

                    <FloatingMenu editor={editor} />
                </>
            )}

            <EditorContent editor={editor} />

            {showToolbar && <EditorFooter html={value} />}
        </div>
    );
}