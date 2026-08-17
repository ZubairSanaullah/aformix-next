import Link from "next/link";
import Image from "next/image";
import type { Resource } from "@/types/resource";
import Badge from "@/components/ui/Badge";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 shadow-[0_20px_60px_rgba(0,0,0,0.14)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(39,185,144,0.18)] sm:rounded-[2rem]">
      <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
        <Image
          src={resource.coverImage}
          alt={resource.title}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Left */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          <span className="rounded-full bg-[var(--color-primary)] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-md sm:px-3 sm:py-1 sm:text-xs">
            {resource.type}
          </span>

          <span className="rounded-full border border-white/30 bg-slate-950/80 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-md shadow-md sm:px-3 sm:py-1 sm:text-xs">
            {resource.level}
          </span>
        </div>

        {/* Top Right */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5 sm:right-4 sm:top-4 sm:gap-2">
          {resource.featured && (
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-slate-950 shadow-md sm:px-3 sm:py-1 sm:text-xs">
              ★ Featured
            </span>
          )}

          <span className="rounded-full bg-[var(--color-primary)]/90 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur shadow-md sm:px-3 sm:py-1 sm:text-xs">
            PDF
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-text-muted)] sm:gap-2 sm:text-sm">
          <Badge>
            {resource.category}
          </Badge>

          <span>•</span>

          <span>{resource.pages} Pages</span>

          <span>•</span>

          <span>{resource.readingTime} min read</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-lg font-bold text-[var(--color-text)] sm:mt-4 sm:text-xl">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-3 sm:text-sm sm:leading-7">
          {resource.description}
        </p>

        {/* Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-glass-border)]/50 pt-4 sm:mt-8 sm:pt-0 sm:border-0">
          <span className="text-xs font-semibold text-[var(--color-primary)] sm:text-sm">
            Free Download
          </span>

          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-glass-border)] px-4 py-2 text-xs font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
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