"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface RestorePostButtonProps {
    postId: string;
}

export default function RestorePostButton({
    postId,
}: RestorePostButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function handleRestore() {
        try {
            const response = await fetch(
                `/api/posts/${postId}/restore`,
                {
                    method: "PATCH",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            toast.success("Post restored successfully.");

            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to restore post.");
        }
    }

    return (
        <button
            onClick={handleRestore}
            disabled={isPending}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-muted disabled:opacity-50"
            title="Restore post"
        >
            <RotateCcw className="h-4 w-4" />
        </button>
    );
}