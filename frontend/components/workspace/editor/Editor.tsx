"use client";

import "./EditorStyles.css";

import { useCallback, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { toast } from "sonner";

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
    const editorRef =
        useRef<ReturnType<typeof useEditor>>(null);

    const handleImageUpload = useCallback(
        async (file: File) => {
            if (!editorRef.current) {
                return;
            }

            try {
                const media =
                    await uploadImage(file);

                editorRef.current
                    .chain()
                    .focus()
                    .setImage({
                        src: media.url,
                        alt:
                            media.alt ||
                            media.originalName ||
                            file.name,
                    })
                    .run();
            } catch (error) {
                console.error(
                    "[EDITOR_IMAGE_UPLOAD]",
                    error
                );

                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to upload image."
                );
            }
        },
        []
    );

    const editor = useEditor({
        extensions: editorExtensions,

        content: value,

        editable,

        immediatelyRender: false,

        editorProps: {
            attributes: {
                class:
                    "tiptap min-h-[400px] focus:outline-none",
            },

            handleDrop(view, event) {
                const files =
                    event.dataTransfer?.files;

                if (!files?.length) {
                    return false;
                }

                const imageFile =
                    Array.from(files).find(
                        (file) =>
                            file.type.startsWith(
                                "image/"
                            )
                    );

                if (!imageFile) {
                    return false;
                }

                void handleImageUpload(
                    imageFile
                );

                return true;
            },

            handlePaste(view, event) {
                const items =
                    event.clipboardData?.items;

                if (!items) {
                    return false;
                }

                for (
                    const item of items
                ) {
                    if (
                        !item.type.startsWith(
                            "image/"
                        )
                    ) {
                        continue;
                    }

                    const file =
                        item.getAsFile();

                    if (!file) {
                        continue;
                    }

                    void handleImageUpload(
                        file
                    );

                    return true;
                }

                return false;
            },
        },

        onUpdate({ editor }) {
            onChange(
                editor.getHTML()
            );
        },
    });

    useEffect(() => {
        editorRef.current =
            editor;
    }, [editor]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        const current =
            editor.getHTML();

        if (current !== value) {
            editor.commands.setContent(
                value,
                {
                    emitUpdate: false,
                }
            );
        }
    }, [editor, value]);

    if (!editor) {
        return null;
    }

    return (
        <div className="editor-container">
            {showToolbar && (
                <>
                    <Toolbar
                        editor={editor}
                    />

                    <BubbleMenu
                        editor={editor}
                    />

                    <FloatingMenu
                        editor={editor}
                    />
                </>
            )}

            <EditorContent
                editor={editor}
            />

            {showToolbar && (
                <EditorFooter
                    html={value}
                />
            )}
        </div>
    );
}