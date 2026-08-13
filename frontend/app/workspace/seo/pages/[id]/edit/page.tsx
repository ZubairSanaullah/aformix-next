import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";

import { getSEOPageById } from "@/lib/services/seo/pages";
import { deserializeSEOKeywords, type SEOPageInput } from "@/lib/validations/seo";

import EditSEOPageClient from "@/components/workspace/seo/pages/EditSEOPageClient";

interface EditSEOPagePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSEOPagePage({
    params,
}: EditSEOPagePageProps) {
    // NOTE: same auth-guard assumption as the other SEO routes — remove if
    // /workspace/* is already gated by a layout or middleware.
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const { id } = await params;

    const page = await getSEOPageById(id);

    if (!page) {
        notFound();
    }

    const defaultValues: Partial<SEOPageInput> = {
        path: page.path,
        title: page.title ?? "",
        description: page.description ?? "",
        keywords: deserializeSEOKeywords(page.keywords),
        canonicalUrl: page.canonical ?? "",
        noIndex: page.noIndex,
        noFollow: page.noFollow,
        ogTitle: page.ogTitle ?? "",
        ogDescription: page.ogDescription ?? "",
        ogImage: page.ogImage ?? "",
    };

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Edit SEO Page"
                description={`Update metadata for ${page.path}`}
                breadcrumbs={[
                    { label: "SEO", href: "/workspace/seo" },
                    { label: "Pages", href: "/workspace/seo/pages" },
                    { label: page.path },
                ]}
            />

            <EditSEOPageClient pageId={page.id} defaultValues={defaultValues} />
        </div>
    );
}
