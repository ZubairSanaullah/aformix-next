import type { Metadata } from "next";

import KBHeader from "@/components/kb/KBHeader";
import KBFooter from "@/components/kb/KBFooter";
import { getSiteUrl } from "@/lib/kb/site";

export const metadata: Metadata = {
    // NOTE: if your root app/layout.tsx already sets metadataBase, this
    // one just re-asserts the same value for the /kb subtree — harmless
    // either way, but you can remove it here if it causes a duplicate-key
    // warning in your setup.
    metadataBase: new URL(getSiteUrl()),
    title: {
        default: "Knowledge Base — Aformix",
        template: "%s — Aformix Docs",
    },
    description:
        "Guides, tutorials, and answers to help you get the most out of Aformix.",
    openGraph: {
        siteName: "Aformix Docs",
        type: "website",
        url: `${getSiteUrl()}/kb`,
    },
    twitter: {
        card: "summary",
    },
};

export default function KBLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <KBHeader />
            <main className="flex-1">{children}</main>
            <KBFooter />
        </div>
    );
}
