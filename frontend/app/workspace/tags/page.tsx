import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";

import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import TagsTable from "@/components/workspace/tags/TagsTable";

export default async function TagsPage() {
    try {
        await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            redirect("/workspace");
        }
        throw error;
    }

    const tags = await prisma.tag.findMany({
        include: {
            _count: {
                select: {
                    posts: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Tags"
                description="Organize posts with reusable tags."
                action={
                    <Link href="/workspace/tags/create">
                        <Button>Create Tag</Button>
                    </Link>
                }
            />

            <TagsTable tags={tags} />
        </div>
    );
}