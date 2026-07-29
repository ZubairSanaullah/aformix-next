import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getResourceBySlug, getRelatedResources } from "@/lib/resources";
import { generateSEO } from "@/lib/seo";
// import Breadcrumbs from "@/components/resources/Breadcrumbs";
import DownloadButton from "@/components/resources/DownloadButton";
import ShareButtons from "@/components/resources/ShareButtons";
import StickySidebar from "@/components/resources/StickySidebar";
import RelatedResources from "@/components/resources/RelatedResources";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return generateSEO({
      title: "Resource Not Found | Aformix",
      description: "The requested resource could not be found.",
      path: "/resources",
    });
  }

  return generateSEO({
    title: `${resource.title} | Aformix Resources`,
    description: resource.description,
    path: `/resources/${resource.slug}`,
    keywords: resource.keywords,
  });
}

export async function generateStaticParams() {
  return [
    { slug: "seo-framework" },
    { slug: "chatgpt-prompts" },
    { slug: "landing-page-checklist" },
    { slug: "website-audit" },
    { slug: "ux-checklist" },
    { slug: "local-seo" },
    { slug: "technical-seo" },
    { slug: "ai-productivity" },
    { slug: "wordpress-guide" },
  ];
}

export default async function ResourcePage({ params }: Params) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const relatedResources = getRelatedResources(slug);
  const canonicalUrl = `https://www.aformix.com/resources/${resource.slug}`;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: resource.title,
            description: resource.description,
            image: `https://www.aformix.com${resource.image}`,
            author: {
              "@type": "Organization",
              name: "Aformix",
              url: "https://www.aformix.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Aformix",
              url: "https://www.aformix.com",
            },
            datePublished: resource.publishedAt,
            dateModified: resource.updatedAt,
            mainEntityOfPage: canonicalUrl,
            keywords: resource.keywords.join(", "),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.aformix.com" },
              { "@type": "ListItem", position: 2, name: "Resources", item: "https://www.aformix.com/resources" },
              { "@type": "ListItem", position: 3, name: resource.title, item: canonicalUrl },
            ],
          }),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        {/* <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: resource.title }]} /> */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.8fr_0.75fr]">
          <div>
            <section className="overflow-hidden rounded-[2.5rem] border border-[var(--color-glass-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-surface-elevated))] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={resource.image} alt={resource.title} fill sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur">
                      {resource.category}
                    </span>
                    <span className="rounded-full bg-[var(--color-primary)]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                      Free PDF
                    </span>
                  </div>
                  <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">{resource.title}</h1>
                  <p className="mt-4 max-w-2xl text-lg text-slate-200">{resource.description}</p>
                </div>
              </div>

              <div className="p-8 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
                  <span>{resource.readingTime}</span>
                  <span>•</span>
                  <span>{resource.pages} pages</span>
                  <span>•</span>
                  <span>Updated {resource.updatedAt}</span>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <DownloadButton href={resource.pdf} />
                  <ShareButtons title={resource.title} url={canonicalUrl} />
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                  <section>
                    <h2 className="text-2xl font-semibold text-[var(--color-text)]">Overview</h2>
                    <p className="mt-4 text-lg leading-8 text-[var(--color-text-muted)]">{resource.overview}</p>
                  </section>
                  <div className="rounded-[1.75rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Who this is for</h3>
                    <ul className="mt-4 space-y-3 text-[var(--color-text-muted)]">
                      {resource.audience.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <section className="mt-12 rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-8">
                  <h2 className="text-2xl font-semibold text-[var(--color-text)]">What you’ll learn</h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {resource.learnings.map((item) => (
                      <li key={item} className="flex items-start gap-3 rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)]/70 p-4 text-[var(--color-text-muted)]">
                        <span className="mt-1 text-[var(--color-primary)]">✔</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mt-12 grid gap-8 lg:grid-cols-2">
                  <div className="rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-8">
                    <h2 className="text-2xl font-semibold text-[var(--color-text)]">Why this resource exists</h2>
                    <p className="mt-4 text-lg leading-8 text-[var(--color-text-muted)]">{resource.whyItExists}</p>
                  </div>
                  <div className="rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-8">
                    <h2 className="text-2xl font-semibold text-[var(--color-text)]">Download this guide</h2>
                    <p className="mt-4 text-lg leading-8 text-[var(--color-text-muted)]">Use the PDF to review the framework offline, share it with your team, or hand it to a developer or agency.</p>
                    <div className="mt-6">
                      <DownloadButton href={resource.pdf} />
                    </div>
                  </div>
                </section>

                {resource.faqs?.length ? (
                  <section className="mt-12 rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-8">
                    <h2 className="text-2xl font-semibold text-[var(--color-text)]">Frequently asked questions</h2>
                    <div className="mt-6 space-y-4">
                      {resource.faqs.map((item) => (
                        <div key={item.question} className="rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)]/70 p-4">
                          <h3 className="font-semibold text-[var(--color-text)]">{item.question}</h3>
                          <p className="mt-2 text-[var(--color-text-muted)]">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section className="mt-16 rounded-[2.5rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 p-10 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.36em] text-[var(--color-primary)]">Need help implementing this?</p>
                  <h2 className="mt-4 text-3xl font-semibold text-[var(--color-text)]">Let’s turn this resource into a real growth plan.</h2>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link href="https://calendly.com/aformixtech/30min" target="_blank" rel="noreferrer" className="rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02]">
                      Book Consultation
                    </Link>
                    <Link href="/services" className="rounded-full border border-[var(--color-glass-border)] px-6 py-3 font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
                      Explore Services
                    </Link>
                  </div>
                </section>

                <RelatedResources resources={relatedResources} />
              </div>
            </section>
          </div>

          <div className="hidden lg:block">
            <StickySidebar resource={resource} url={canonicalUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
