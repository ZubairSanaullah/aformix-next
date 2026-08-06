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

    oldRevision: any;

    currentPost: any;
}



export default function RevisionDiffDrawer({
    open,
    onOpenChange,
    oldRevision,
    currentPost,
}: RevisionDiffDrawerProps) {


    if (!oldRevision || !currentPost) {
        return null;
    }


    return (

        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >

            <SheetContent
                side="right"
                className="w-full overflow-y-auto sm:max-w-4xl"
            >

                <SheetHeader>

                    <SheetTitle>
                        Compare Changes
                    </SheetTitle>

                </SheetHeader>


                <div className="mt-8">

                    <RevisionDiffViewer
                        oldRevision={oldRevision}
                        currentPost={currentPost}
                    />

                </div>


            </SheetContent>

        </Sheet>

    );
}