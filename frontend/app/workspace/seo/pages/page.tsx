import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { auth } from "@/auth";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspacePageActions from "@/components/workspace/ui/WorkspacePageActions";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import { getSEOPages } from "@/lib/services/seo/pages";
import { scoreSEOPage } from "@/components/workspace/seo/shared/seo-scoring";

import SEOPagesTable, {
    type SEOPageListItem,
} from "@/components/workspace/seo/pages/SEOPagesTable";

export default async function SEOPagesListPage() {
    // NOTE: same auth-guard assumption as the SEO dashboard route — remove
    // if /workspace/* is already gated by a layout or middleware.
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const pages = await getSEOPages();

    const items: SEOPageListItem[] = pages.map((page) => {
        const { score, criticalCount } = scoreSEOPage(page);

        return {
            id: page.id,
            path: page.path,
            title: page.title,
            description: page.description,
            noIndex: page.noIndex,
            noFollow: page.noFollow,
            score,
            criticalCount,
        };
    });

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="SEO Pages"
                description="Manage metadata, robots directives, and Open Graph tags for individual pages."
                actions={
                    <WorkspacePageActions>
                        <Link href="/workspace/seo/pages/create">
                            <WorkspaceButton size="sm">
                                <Plus className="h-3.5 w-3.5" />
                                New SEO Page
                            </WorkspaceButton>
                        </Link>
                    </WorkspacePageActions>
                }
            />

            <SEOPagesTable initialPages={items} />
        </div>
    );
}
