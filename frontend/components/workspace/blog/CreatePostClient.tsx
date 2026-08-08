"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import PostForm from "@/components/workspace/blog/PostForm";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";

import type { PostInput } from "@/lib/validations/post";

type Category = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};

interface Props {
  categories: Category[];
  tags: Tag[];
}

export default function CreatePostClient({
  categories,
  tags,
}: Props) {
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
        toast.error(
          result.message ||
          "Failed to create post."
        );
        return;
      }

      toast.success(
        "Post created successfully."
      );

      router.push("/workspace/blog");
      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong while creating the post."
      );
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <WorkspacePageHeader
        title="Create Post"
        description="Write, organize, and prepare your article for publishing."
        breadcrumbs={[
          {
            label: "Workspace",
            href: "/workspace",
          },
          {
            label: "Blog",
            href: "/workspace/blog",
          },
          {
            label: "Create Post",
          },
        ]}
        actions={
          <WorkspaceButton
            asChild
            variant="secondary"
            size="sm"
          >
            <a href="/workspace/blog">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </a>
          </WorkspaceButton>
        }
      />

      <WorkspaceCard
        padding="none"
        className="overflow-hidden"
      >
        <div
          className="
                        border-b
                        border-[var(--workspace-border)]
                        bg-[var(--workspace-background)]
                        px-5
                        py-4
                        sm:px-6
                    "
        >
          <div
            className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
          >
            <div className="min-w-0">
              <h2
                className="
                                    text-sm
                                    font-semibold
                                    text-[var(--workspace-text)]
                                "
              >
                New Article
              </h2>

              <p
                className="
                                    mt-0.5
                                    text-xs
                                    text-[var(--workspace-text-muted)]
                                "
              >
                Add your content and publishing
                details below.
              </p>
            </div>

            <WorkspaceButton
              variant="secondary"
              size="sm"
              type="submit"
              form="create-post-form"
            >
              <Save className="h-3.5 w-3.5" />

              Save Post
            </WorkspaceButton>
          </div>
        </div>

        <PostForm
          mode="create"
          categories={categories}
          tags={tags}
          onSubmit={onSubmit}
        />
      </WorkspaceCard>
    </div>
  );
}