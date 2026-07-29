import Link from "next/link";
import Image from "next/image";
import type { Resource } from "@/types/resource";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_24px_80px_rgba(39,185,144,0.15)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={resource.image}
          alt={resource.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.75)] via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur">
          {resource.category}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-[var(--color-primary)]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
          PDF
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <span>{resource.readingTime}</span>
          <span>{resource.pages} pages</span>
        </div>

        <h3 className="text-xl font-semibold text-[var(--color-text)]">{resource.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{resource.description}</p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-primary)]">Free download</span>
          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-glass-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            View Resource
          </Link>
        </div>
      </div>
    </article>
  );
}
