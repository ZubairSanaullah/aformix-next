import { redirect } from "next/navigation";

import { auth } from "@/auth";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";

import CreateSEOPageClient from "@/components/workspace/seo/pages/CreateSEOPageClient";

export default async function CreateSEOPagePage() {
    // NOTE: same auth-guard assumption as the other SEO routes — remove if
    // /workspace/* is already gated by a layout or middleware.
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="New SEO Page"
                description="Configure metadata, robots directives, and Open Graph tags for a page."
                breadcrumbs={[
                    { label: "SEO", href: "/workspace/seo" },
                    { label: "Pages", href: "/workspace/seo/pages" },
                    { label: "New" },
                ]}
            />

            <CreateSEOPageClient />
        </div>
    );
}
