"use client";

import type { Editor } from "@tiptap/react";
import { Heading1 } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface HeadingMenuProps {
    editor: Editor;
}

type HeadingValue =
    | "paragraph"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";

function getCurrentValue(editor: Editor): HeadingValue {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    if (editor.isActive("heading", { level: 4 })) return "h4";
    if (editor.isActive("heading", { level: 5 })) return "h5";
    if (editor.isActive("heading", { level: 6 })) return "h6";

    return "paragraph";
}

export default function HeadingMenu({
    editor,
}: HeadingMenuProps) {
    const value = getCurrentValue(editor);

    const handleChange = (value: HeadingValue) => {
        const chain = editor.chain().focus();

        switch (value) {
            case "paragraph":
                chain.setParagraph().run();
                break;

            case "h1":
                chain.toggleHeading({ level: 1 }).run();
                break;

            case "h2":
                chain.toggleHeading({ level: 2 }).run();
                break;

            case "h3":
                chain.toggleHeading({ level: 3 }).run();
                break;

            case "h4":
                chain.toggleHeading({ level: 4 }).run();
                break;

            case "h5":
                chain.toggleHeading({ level: 5 }).run();
                break;

            case "h6":
                chain.toggleHeading({ level: 6 }).run();
                break;
        }
    };

    return (
        <Select
            value={value}
            onValueChange={(value) =>
                handleChange(value as HeadingValue)
            }
        >
            <SelectTrigger className="h-9 w-[170px]">
                <div className="flex items-center gap-2">
                    <Heading1 className="h-4 w-4" />
                    <SelectValue />
                </div>
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="paragraph">
                    Paragraph
                </SelectItem>

                <SelectItem value="h1">
                    Heading 1
                </SelectItem>

                <SelectItem value="h2">
                    Heading 2
                </SelectItem>

                <SelectItem value="h3">
                    Heading 3
                </SelectItem>

                <SelectItem value="h4">
                    Heading 4
                </SelectItem>

                <SelectItem value="h5">
                    Heading 5
                </SelectItem>

                <SelectItem value="h6">
                    Heading 6
                </SelectItem>
            </SelectContent>
        </Select>
    );
}