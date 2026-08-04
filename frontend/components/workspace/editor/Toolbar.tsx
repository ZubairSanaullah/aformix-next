"use client";

import type { Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Code2,
    Undo2,
    Redo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ToolbarProps {
    editor: Editor;
}

export default function Toolbar({ editor }: ToolbarProps) {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-2 border-b p-3">
            <Button
                type="button"
                variant={editor.isActive("bold") ? "default" : "outline"}
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant={editor.isActive("italic") ? "default" : "outline"}
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant={editor.isActive("underline") ? "default" : "outline"}
                size="icon"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant={editor.isActive("strike") ? "default" : "outline"}
                size="icon"
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant={
                    editor.isActive("heading", { level: 1 }) ? "default" : "outline"
                }
                size="icon"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
            >
                <Heading1 className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant={
                    editor.isActive("heading", { level: 2 }) ? "default" : "outline"
                }
                size="icon"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <Heading2 className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant={editor.isActive("bulletList") ? "default" : "outline"}
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant={editor.isActive("orderedList") ? "default" : "outline"}
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant={editor.isActive("blockquote") ? "default" : "outline"}
                size="icon"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant={editor.isActive("codeBlock") ? "default" : "outline"}
                size="icon"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
                <Code2 className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <Undo2 className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <Redo2 className="h-4 w-4" />
            </Button>
        </div>
    );
}