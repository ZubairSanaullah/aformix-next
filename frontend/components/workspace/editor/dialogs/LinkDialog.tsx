"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/checkbox";

interface LinkDialogProps {
    editor: Editor;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function LinkDialog({
    editor,
    open,
    onOpenChange,
}: LinkDialogProps) {
    const [url, setUrl] = useState("");
    const [newTab, setNewTab] = useState(true);

    useEffect(() => {
        if (!editor || !open) return;

        const previous =
            editor.getAttributes("link").href ?? "";

        setUrl(previous);
    }, [editor, open]);

    function handleSave() {
        if (!url.trim()) {
            editor.chain().focus().unsetLink().run();
            onOpenChange(false);
            return;
        }

        editor
            .chain()
            .focus()
            .setLink({
                href: url,
                target: newTab ? "_blank" : null,
                rel: newTab
                    ? "noopener noreferrer"
                    : null,
            })
            .run();

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Link</DialogTitle>
                </DialogHeader>

                <Input
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) =>
                        setUrl(e.target.value)
                    }
                />

                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={newTab}
                        onCheckedChange={(checked) =>
                            setNewTab(!!checked)
                        }
                    />

                    <span className="text-sm">
                        Open in new tab
                    </span>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() =>
                            onOpenChange(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button onClick={handleSave}>
                        Save Link
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}