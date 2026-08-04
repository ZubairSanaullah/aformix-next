"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PostForm from "@/components/workspace/blog/PostForm";
import type { PostInput } from "@/lib/validations/post";

type Category = { id: string; name: string };

type Tag = { id: string; name: string };

interface Props {
  categories: Category[];
  tags: Tag[];
}

export default function CreatePostClient({ categories, tags }: Props) {
  const router = useRouter();

  const onSubmit = async (data: PostInput) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to create post.");
        return;
      }

      toast.success("Post created successfully!");
      router.push("/workspace/blog");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <PostForm
      mode="create"
      categories={categories}
      tags={tags}
      onSubmit={onSubmit}
    />
  );
}
