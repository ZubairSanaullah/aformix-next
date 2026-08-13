import { redirect } from "next/navigation";

import { auth } from "@/auth";

import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";

import { getSEOSettings } from "@/lib/services/seo/settings";
import {
    robotsBooleansToValues,
    type SEOSettingsInput,
} from "@/lib/validations/seo";

import SEOSettingsClient from "@/components/workspace/seo/settings/SEOSettingsClient";

export default async function SEOSettingsPage() {
    // NOTE: same auth-guard assumption as the other SEO routes — remove if
    // /workspace/* is already gated by a layout or middleware.
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const settings = await getSEOSettings();

    // getSEOSettings() returns defaultRobotsIndex/defaultRobotsFollow as the
    // raw Prisma booleans, but the settings form (and PATCH payload) work
    // with the "INDEX"/"NOINDEX" and "FOLLOW"/"NOFOLLOW" enum strings —
    // converting with the existing helper rather than duplicating the logic.
    const robots = robotsBooleansToValues(
        settings?.defaultRobotsIndex ?? true,
        settings?.defaultRobotsFollow ?? true
    );

    const defaultValues: Partial<SEOSettingsInput> = {
        siteTitle: settings?.siteTitle ?? "",
        siteDescription: settings?.siteDescription ?? "",
        canonicalUrl: settings?.canonicalUrl ?? "",
        defaultOgImage: settings?.defaultOgImage ?? "",
        twitterHandle: settings?.twitterHandle ?? "",
        defaultRobotsIndex: robots.index,
        defaultRobotsFollow: robots.follow,
    };

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="SEO Settings"
                description="Site-wide defaults used when individual pages don't override them."
                breadcrumbs={[
                    { label: "SEO", href: "/workspace/seo" },
                    { label: "Settings" },
                ]}
            />

            <SEOSettingsClient
                defaultValues={defaultValues}
                isNew={!settings}
            />
        </div>
    );
}
