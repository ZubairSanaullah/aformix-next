"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import TagForm from "@/components/workspace/tags/TagForm";

import { TagInput } from "@/lib/validations/tag";

interface EditTagFormProps {
    tag: {
        id: string;
        name: string;
        description: string | null;
    };
}

export default function EditTagForm({
    tag,
}: EditTagFormProps) {
    const router = useRouter();

    async function handleSubmit(data: TagInput) {
        try {
            const res = await fetch(`/api/tags/${tag.id}`, {
                method: "PATCH",
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

            toast.success("Tag updated successfully.");

            router.refresh();
            router.push("/workspace/tags");
        } catch {
            toast.error("Something went wrong.");
        }
    }

    return (
        <TagForm
            mode="edit"
            defaultValues={{
                name: tag.name,
                description: tag.description ?? "",
            }}
            onSubmit={handleSubmit}
        />
    );
}