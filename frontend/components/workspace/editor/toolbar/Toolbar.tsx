"use client";

import type { Editor } from "@tiptap/react";

import HeadingMenu from "./HeadingMenu";
import TextFormattingGroup from "./TextFormattingGroup";
import AlignmentGroup from "./AlignmentGroup";
import ListGroup from "./ListGroup";
import HistoryGroup from "./HistoryGroup";
import ToolbarDivider from "./ToolbarDivider";
import ImageUploader from "../upload/ImageUploader";

interface Props {
    editor: Editor;
}

export default function Toolbar({
    editor,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-1 border-b bg-card p-2">

            <HeadingMenu editor={editor} />

            <ToolbarDivider />

            <TextFormattingGroup editor={editor} />

            <ImageUploader editor={editor} />

            <ToolbarDivider />

            <AlignmentGroup editor={editor} />

            <ToolbarDivider />

            <ListGroup editor={editor} />

            <ToolbarDivider />

            <HistoryGroup editor={editor} />

        </div>
    );
}