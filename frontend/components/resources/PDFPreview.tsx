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
    <GlassCard className="mt-12 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
            <Eye className="h-7 w-7 text-[var(--color-primary)]" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-text)]">
              Preview the Resource
            </h2>

            <p className="mt-2 leading-7 text-[var(--color-text-muted)]">
              Explore the first page before downloading the complete PDF.
            </p>
          </div>
        </div>
      </div>

      <Link
        href={resource.pdf}
        target="_blank"
<<<<<<< HEAD
        className="group relative block overflow-hidden rounded-[2rem] border border-[var(--color-glass-border)] shadow-xl"
=======
        className="group relative block overflow-hidden rounded-[2rem] border border-[var(--color-glass-border)]"
>>>>>>> da515907fea760fe2ecf7855489aaded52e1be30
      >
        <div className="relative aspect-[3/4]">
          <Image
            src={resource.previewImage}
            alt={`${resource.title} Preview`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
<<<<<<< HEAD
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

          {/* Floating Card */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
            <div className="rounded-[1.5rem] border border-white/20 bg-slate-950/90 p-5 sm:p-6 backdrop-blur-xl transition-all duration-500 group-hover:translate-y-[-4px] shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[var(--color-primary)] p-3 text-white shrink-0">
                  <FileText size={22} className="text-white" />
                </div>

                <div className="min-w-0">
                  <p className="text-base sm:text-lg font-semibold text-white truncate">
                    {resource.title}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300">
=======

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Floating Card */}

          <div className="absolute bottom-8 left-8 right-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl transition-all duration-500 group-hover:translate-y-[-4px]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[var(--color-primary)] p-3 text-white">
                  <FileText size={22} />
                </div>

                <div>
                  <p className="text-lg font-semibold text-white">
                    {resource.title}
                  </p>

                  <p className="text-sm text-slate-300">
>>>>>>> da515907fea760fe2ecf7855489aaded52e1be30
                    PDF Preview Available
                  </p>
                </div>
              </div>

<<<<<<< HEAD
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                    PREVIEW AVAILABLE
                  </p>

                  <p className="mt-0.5 text-xs sm:text-sm text-slate-200">
=======
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                    Preview Available
                  </p>

                  <p className="mt-1 text-base text-slate-200">
>>>>>>> da515907fea760fe2ecf7855489aaded52e1be30
                    Open the first page in your browser
                  </p>
                </div>

<<<<<<< HEAD
                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-[var(--color-primary)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--color-primary)]/90 shadow-md shrink-0">
                  <Eye size={16} className="text-white" />
                  <span className="text-white font-semibold">View Preview</span>
                  <ArrowUpRight
                    size={16}
                    className="text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
=======
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium text-white transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/20">
                  <Eye size={18} />

                  <span>View Preview</span>

                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
>>>>>>> da515907fea760fe2ecf7855489aaded52e1be30
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