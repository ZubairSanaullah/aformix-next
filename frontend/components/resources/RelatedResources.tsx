import Link from "next/link";
import Image from "next/image";
import type { Resource } from "@/types/resource";

interface RelatedResourcesProps {
  resources: Resource[];
}

export default function RelatedResources({ resources }: RelatedResourcesProps) {
  if (!resources.length) return null;

  return (
    <section className="mt-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">Related guides</p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">Explore more resources</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {resources.map((resource) => (
          <Link key={resource.slug} href={`/resources/${resource.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 transition-all duration-400 hover:-translate-y-1 hover:border-[var(--color-primary)]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={resource.image} alt={resource.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">{resource.category}</p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--color-text)]">{resource.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{resource.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
