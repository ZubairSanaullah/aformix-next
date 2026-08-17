import Link from "next/link";
import Image from "next/image";

import type { Resource } from "@/types/resource";

interface ResourceMiniCardProps {
    resource: Resource;
}

export default function ResourceMiniCard({
    resource,
}: ResourceMiniCardProps) {
    return (
        <Link
            href={`/resources/${resource.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)] sm:rounded-[1.5rem] shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
        >
            <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
                <Image
                    src={resource.coverImage}
                    alt={resource.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] sm:text-xs">
                    {resource.category}
                </p>

                <h3 className="mt-1.5 text-base font-bold text-[var(--color-text)] sm:mt-2 sm:text-lg">
                    {resource.title}
                </h3>

                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-2 sm:text-sm sm:leading-6">
                    {resource.description}
                </p>
            </div>
        </Link>
    );
}