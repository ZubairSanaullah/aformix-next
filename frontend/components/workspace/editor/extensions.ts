import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

export const editorExtensions = [
    StarterKit.configure({
        codeBlock: false,
        link: false,
        underline: false,
    }),

    Underline,

    Highlight.configure({
        multicolor: true,
    }),

    Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
            class: "text-primary underline",
            rel: "noopener noreferrer",
            target: "_blank",
        },
    }),

    Image.configure({
        inline: false,
        allowBase64: false,
    }),

    Placeholder.configure({
        placeholder: "Start writing something amazing...",
    }),

    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),

    TaskList,

    TaskItem.configure({
        nested: true,
    }),

    CodeBlockLowlight.configure({
        lowlight,
    }),
];