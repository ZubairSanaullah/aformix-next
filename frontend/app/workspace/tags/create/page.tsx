"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import TagForm from "@/components/workspace/tags/TagForm";

import { TagInput } from "@/lib/validations/tag";

export default function CreateTagPage() {
    const router = useRouter();

    async function handleSubmit(data: TagInput) {
        try {
            const res = await fetch("/api/tags", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error);
                return;
            }

            toast.success("Tag created successfully.");

            router.refresh();
            router.push("/workspace/tags");
        } catch {
            toast.error("Something went wrong.");
        }
    }

    return (
        <TagForm
            mode="create"
            onSubmit={handleSubmit}
        />
    );
}