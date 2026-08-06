"use client";

import { useState } from "react";
import { toast } from "sonner";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";

interface PublishingPanelProps {
    postId: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export default function PublishingPanel({
    postId,
    status,
}: PublishingPanelProps) {
    const [currentStatus, setCurrentStatus] =
        useState(status);

    const [loading, setLoading] =
        useState(false);


    async function updateStatus(
        newStatus:
            | "DRAFT"
            | "PUBLISHED"
            | "ARCHIVED"
    ) {
        try {
            setLoading(true);

            const response = await fetch(
                `/api/posts/${postId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed"
                );
            }


            setCurrentStatus(newStatus);

            toast.success(
                "Status updated"
            );

        } catch (error) {
            console.error(error);

            toast.error(
                "Failed to update status"
            );

        } finally {
            setLoading(false);
        }
    }


    return (
        <GlassCard className="space-y-5 p-6">

            <div className="flex items-center justify-between">

                <h2 className="font-semibold">
                    Publishing
                </h2>


                <Badge>
                    {currentStatus}
                </Badge>

            </div>


            <div className="space-y-3">

                <Button
                    className="w-full"
                    disabled={loading}
                    onClick={() =>
                        updateStatus(
                            "PUBLISHED"
                        )
                    }
                >
                    Publish
                </Button>


                <Button
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                    onClick={() =>
                        updateStatus(
                            "DRAFT"
                        )
                    }
                >
                    Move to Draft
                </Button>


                <Button
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                    onClick={() =>
                        updateStatus(
                            "ARCHIVED"
                        )
                    }
                >
                    Archive
                </Button>

            </div>

        </GlassCard>
    );
}