import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { getAllResources } from "@/lib/resources";

export const metadata: Metadata = generateSEO({
  title: "Downloads | Aformix",
  description: "Download premium Aformix resources, guides, and checklists for SEO, design, AI, and growth.",
  path: "/downloads",
});

export default function DownloadsPage() {
  const resources = getAllResources();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <section className="rounded-[3rem] border border-[var(--color-glass-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-surface-elevated))] p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">Downloads</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Download the resources your team needs</h1>
          <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-muted)]">Every asset is optimized for sharing across Instagram, LinkedIn, email campaigns, ManyChat, and WhatsApp.</p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <article key={resource.slug} className="rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">{resource.category}</span>
                <span className="text-sm text-[var(--color-text-muted)]">{resource.pages} pages</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[var(--color-text)]">{resource.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{resource.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={resource.pdf} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">Download PDF</a>
                <Link href={`/resources/${resource.slug}`} className="rounded-full border border-[var(--color-glass-border)] px-5 py-3 text-sm font-semibold text-[var(--color-text)]">View Resource</Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
