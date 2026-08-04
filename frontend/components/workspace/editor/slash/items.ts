import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Minus,
    CodeSquare,
    ImagePlus,
} from "lucide-react";

import type { SlashItem } from "./types";

export const slashItems: SlashItem[] = [
    {
        title: "Heading 1",
        description: "Large section heading",
        keywords: ["h1", "heading"],
        icon: Heading1,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleHeading({ level: 1 })
                .run();
        },
    },
    {
        title: "Heading 2",
        description: "Medium section heading",
        keywords: ["h2", "heading"],
        icon: Heading2,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleHeading({ level: 2 })
                .run();
        },
    },
    {
        title: "Heading 3",
        description: "Small section heading",
        keywords: ["h3", "heading"],
        icon: Heading3,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleHeading({ level: 3 })
                .run();
        },
    },
    {
        title: "Bullet List",
        description: "Create a bullet list",
        keywords: ["list"],
        icon: List,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBulletList()
                .run();
        },
    },
    {
        title: "Numbered List",
        description: "Create a numbered list",
        keywords: ["ordered"],
        icon: ListOrdered,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleOrderedList()
                .run();
        },
    },
    {
        title: "Checklist",
        description: "Track tasks",
        keywords: ["todo", "task"],
        icon: CheckSquare,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleTaskList()
                .run();
        },
    },
    {
        title: "Quote",
        description: "Insert a quote",
        keywords: ["blockquote"],
        icon: Quote,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBlockquote()
                .run();
        },
    },
    {
        title: "Divider",
        description: "Horizontal rule",
        keywords: ["hr"],
        icon: Minus,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHorizontalRule()
                .run();
        },
    },
    {
        title: "Code Block",
        description: "Insert code",
        keywords: ["code"],
        icon: CodeSquare,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleCodeBlock()
                .run();
        },
    },
    {
        title: "Image",
        description: "Upload an image",
        keywords: ["photo", "media"],
        icon: ImagePlus,
        command: () => {
            // We'll connect this to the Media Library later.
        },
    },
];