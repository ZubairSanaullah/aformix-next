import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export default function Hero({ title, subtitle, eyebrow, ctaHref, ctaLabel }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-[var(--color-glass-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-surface-elevated))] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(49,185,143,0.18),transparent_40%)]" />
      <div className="relative max-w-3xl">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-primary)]">{eyebrow}</p> : null}
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">{subtitle}</p>
        {ctaHref && ctaLabel ? (
          <div className="mt-8">
            <Link href={ctaHref} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02]">
              {ctaLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
