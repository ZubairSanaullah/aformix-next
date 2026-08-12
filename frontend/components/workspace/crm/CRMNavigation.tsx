"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const crmNavigation = [
    {
        title: "Overview",
        href: "/workspace/crm",
    },
    {
        title: "Contacts",
        href: "/workspace/crm/contacts",
    },
    {
        title: "Companies",
        href: "/workspace/crm/companies",
    },
    {
        title: "Leads",
        href: "/workspace/crm/leads",
    },
    {
        title: "Deals",
        href: "/workspace/crm/deals",
    },
    {
        title: "Pipelines",
        href: "/workspace/crm/deals/pipelines",
    },
    {
        title: "Activities",
        href: "/workspace/crm/activities",
    },
];

export default function CRMNavigation() {
    const pathname = usePathname();

    const activeHref = crmNavigation.reduce<string | null>(
        (best, item) => {
            const matches =
                item.href === "/workspace/crm"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

            if (!matches) {
                return best;
            }

            if (!best || item.href.length > best.length) {
                return item.href;
            }

            return best;
        },
        null
    );

    return (
        <nav
            aria-label="CRM navigation"
            className="
        flex
        items-center
        gap-1
        overflow-x-auto
        border-b
        border-[var(--workspace-border)]
        pb-1
        workspace-scrollbar
      "
        >
            {crmNavigation.map((item) => {
                const active = item.href === activeHref;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              shrink-0
              rounded-md
              px-3
              py-1.5
              text-xs
              font-medium
              transition-colors
              duration-150
              ${active
                                ? "bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]"
                                : "text-[var(--workspace-text-muted)] hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                            }
            `}
                    >
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}