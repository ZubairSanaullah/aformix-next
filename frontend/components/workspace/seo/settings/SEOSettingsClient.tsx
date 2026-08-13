"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import SEOSettingsForm from "./SEOSettingsForm";
import type { SEOSettingsInput } from "@/lib/validations/seo";

interface SEOSettingsClientProps {
    defaultValues: Partial<SEOSettingsInput>;
    isNew?: boolean;
}

export default function SEOSettingsClient({
    defaultValues,
    isNew,
}: SEOSettingsClientProps) {
    const router = useRouter();

    async function handleSubmit(values: SEOSettingsInput) {
        try {
            const response = await fetch("/api/seo/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("You need to sign in again to do that.");
                    return;
                }

                toast.error(data?.error ?? "Unable to save SEO settings.");
                return;
            }

            toast.success("SEO settings saved successfully.");

            router.refresh();
        } catch (error) {
            console.error("SEO settings update failed:", error);
            toast.error("Something went wrong while saving SEO settings.");
        }
    }

    return (
        <SEOSettingsForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isNew={isNew}
        />
    );
}
