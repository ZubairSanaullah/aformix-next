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
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-glass-border)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-surface-elevated))] px-5 py-10 sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:rounded-[3rem] lg:px-16 lg:py-20 shadow-[0_20px_70px_rgba(0,0,0,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(49,185,143,0.18),transparent_40%)]" />
      <div className="relative max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)] sm:text-sm sm:tracking-[0.32em]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold leading-tight text-[var(--color-text)] sm:mt-4 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] sm:mt-6 sm:text-lg sm:leading-8">
          {subtitle}
        </p>
        {ctaHref && ctaLabel ? (
          <div className="mt-6 sm:mt-8">
            <Link
              href={ctaHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] sm:w-auto shadow-md"
            >
              {ctaLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
