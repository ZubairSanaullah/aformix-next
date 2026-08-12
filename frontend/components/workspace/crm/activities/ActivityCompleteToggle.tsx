"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

interface ActivityCompleteToggleProps {
    activityId: string;
    completed: boolean;
}

export default function ActivityCompleteToggle({
    activityId,
    completed,
}: ActivityCompleteToggleProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleToggle() {
        if (isUpdating) return;

        setIsUpdating(true);

        try {
            const response = await fetch(
                `/api/crm/activities/${activityId}/complete`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        completed: !completed,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update activity status."
                );
            }

            router.refresh();
        } catch (error) {
            console.error("Activity toggle failed:", error);
            toast.error("Couldn't update the activity status.");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isUpdating}
            aria-label={
                completed
                    ? "Mark as incomplete"
                    : "Mark as complete"
            }
            title={
                completed
                    ? "Mark as incomplete"
                    : "Mark as complete"
            }
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${completed
                    ? "border-emerald-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    : "border-[var(--workspace-border)] bg-[var(--workspace-surface)] text-transparent hover:border-[var(--workspace-primary)] hover:text-[var(--workspace-primary)]"
                }`}
        >
            {isUpdating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--workspace-text-muted)]" />
            ) : (
                <Check className="h-3.5 w-3.5" />
            )}
        </button>
    );
}