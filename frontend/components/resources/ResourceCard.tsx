import Link from "next/link";
import Image from "next/image";
import type { Resource } from "@/types/resource";
import Badge from "@/components/ui/Badge";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_90px_rgba(39,185,144,0.18)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={resource.coverImage}
          alt={resource.title}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Top Left */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white shadow-lg">
            {resource.type}
          </span>

          <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {resource.level}
          </span>
        </div>

        {/* Top Right */}
        <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
          {resource.featured && (
            <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black shadow-lg">
              ★ Featured
            </span>
          )}

          <span className="rounded-full bg-[var(--color-primary)]/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            PDF
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Badge>
            {resource.category}
          </Badge>

          <span>•</span>

          <span>{resource.pages} Pages</span>

          <span>•</span>

          <span>{resource.readingTime} min</span>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-xl font-semibold text-[var(--color-text)]">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-text-muted)]">
          {resource.description}
        </p>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-primary)]">
            Free Download
          </span>

          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-glass-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            <span className="transition-all duration-300 group-hover:translate-x-0.5">
              View Resource →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}