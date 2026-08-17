import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
}

export default function QuickActionCard({
    title,
    description,
    icon: Icon,
    href,
}: QuickActionCardProps) {
    return (
        <Link
            href={href}
            className="
                group
                w-full
                rounded-xl
                border
                border-[var(--workspace-border)]
                bg-[var(--workspace-surface)]
                p-4
                text-left
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-[var(--workspace-primary)]/30
                hover:shadow-[var(--workspace-shadow-md)]
                active:scale-[0.99]
                cursor-pointer
                flex
                flex-col
            "
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--workspace-primary-soft)] transition-transform duration-200 group-hover:scale-105">
                <Icon className="h-4 w-4 text-[var(--workspace-primary)]" />
            </div>

            <h3 className="mt-4 text-xs font-semibold text-[var(--workspace-text)]">
                {title}
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-[var(--workspace-text-muted)]">
                {description}
            </p>
        </Link>
    );
}