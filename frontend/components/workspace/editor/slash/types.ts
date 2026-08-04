import type { Editor } from "@tiptap/react";
import type { LucideIcon } from "lucide-react";

export interface SlashItem {
    title: string;
    description?: string;
    keywords: string[];
    icon: LucideIcon;
    command: (props: {
        editor: Editor;
        range: {
            from: number;
            to: number;
        };
    }) => void;
}