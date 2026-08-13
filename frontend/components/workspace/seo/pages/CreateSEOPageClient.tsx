"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import SEOPageForm from "@/components/workspace/seo/forms/SEOPageForm";
import type { SEOPageInput } from "@/lib/validations/seo";

export default function CreateSEOPageClient() {
    const router = useRouter();

    async function handleSubmit(values: SEOPageInput) {
        try {
            const response = await fetch("/api/seo/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("You need to sign in again to do that.");
                    return;
                }

                if (response.status === 409) {
                    toast.error(
                        data?.error ??
                            "An SEO configuration already exists for this path."
                    );
                    return;
                }

                toast.error(data?.error ?? "Unable to create this SEO page.");
                return;
            }

            toast.success("SEO page created successfully.");

            router.push("/workspace/seo/pages");
            router.refresh();
        } catch (error) {
            console.error("SEO page creation failed:", error);
            toast.error("Something went wrong while creating this SEO page.");
        }
    }

    return <SEOPageForm mode="create" onSubmit={handleSubmit} />;
}
