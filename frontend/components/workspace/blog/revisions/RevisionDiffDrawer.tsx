"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import RevisionDiffViewer from "./RevisionDiffViewer";

interface RevisionDiffDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    leftRevision: any;
    rightRevision: any;
}

export default function RevisionDiffDrawer({
    open,
    onOpenChange,
    leftRevision,
    rightRevision,
}: RevisionDiffDrawerProps) {

    if (!leftRevision || !rightRevision) {
        return null;
    }

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent
                side="right"
                className="w-full overflow-y-auto sm:max-w-5xl"
            >
                <SheetHeader>
                    <SheetTitle>
                        Compare Revisions
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6 rounded-xl border bg-muted/30 p-4">
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="font-medium">Older Revision</p>
                            <p className="text-muted-foreground">
                                {leftRevision.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(leftRevision.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="font-medium">Newer Revision</p>
                            <p className="text-muted-foreground">
                                {rightRevision.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(rightRevision.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <RevisionDiffViewer
                        leftRevision={leftRevision}
                        rightRevision={rightRevision}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}