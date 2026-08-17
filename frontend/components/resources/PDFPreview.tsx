import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, FileText } from "lucide-react";

import type { Resource } from "@/types/resource";
import GlassCard from "@/components/ui/GlassCard";

interface PDFPreviewProps {
  resource: Resource;
}

export default function PDFPreview({ resource }: PDFPreviewProps) {
  return (
    <GlassCard className="mt-8 p-5 sm:mt-12 sm:p-8 rounded-2xl sm:rounded-[2rem]">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 sm:h-14 sm:w-14 sm:rounded-2xl">
            <Eye className="h-5 w-5 text-[var(--color-primary)] sm:h-7 sm:w-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
              Preview the Resource
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-2 sm:text-sm sm:leading-7">
              Explore the first page before downloading the complete PDF.
            </p>
          </div>
        </div>
      </div>

      <Link
        href={resource.pdf}
        target="_blank"
        className="group relative block overflow-hidden rounded-xl border border-[var(--color-glass-border)] shadow-xl sm:rounded-[2rem]"
      >
        <div className="relative aspect-[3/4] sm:aspect-[4/3] md:aspect-[3/4]">
          <Image
            src={resource.previewImage}
            alt={`${resource.title} Preview`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

          {/* Floating Card */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
            <div className="rounded-xl border border-white/20 bg-slate-950/90 p-3.5 sm:p-5 sm:rounded-[1.5rem] backdrop-blur-xl transition-all duration-500 group-hover:translate-y-[-4px] shadow-2xl">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="rounded-lg bg-[var(--color-primary)] p-2 text-white shrink-0 sm:rounded-xl sm:p-3">
                  <FileText className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate sm:text-lg">
                    {resource.title}
                  </p>

                  <p className="text-[11px] text-slate-300 sm:text-sm">
                    PDF Preview Available
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2.5 sm:mt-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-3 sm:pt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 sm:text-xs sm:tracking-[0.25em]">
                    PREVIEW AVAILABLE
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-200 sm:text-sm">
                    Open the first page in your browser
                  </p>
                </div>

                <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/20 bg-[var(--color-primary)] px-3.5 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-[var(--color-primary)]/90 shadow-md sm:w-auto sm:px-4 sm:py-2.5 sm:text-sm shrink-0">
                  <Eye size={15} className="text-white" />
                  <span className="text-white font-semibold">View Preview</span>
                  <ArrowUpRight
                    size={15}
                    className="text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </GlassCard>
  );
}