"use client";

import { useState } from "react";
import { Download, Share2, Sparkles } from "lucide-react";
import type { Resource } from "@/types/resource";
import { trackEvent } from "@/lib/analytics";
import ShareButtons from "./ShareButtons";

interface MobileResourceBottomBarProps {
  resource: Resource;
  url: string;
}

export default function MobileResourceBottomBar({
  resource,
  url,
}: MobileResourceBottomBarProps) {
  const [showShare, setShowShare] = useState(false);

  const handleDownload = () => {
    trackEvent("resource_download_mobile_bottom", {
      resource_title: resource.title,
      resource_slug: resource.slug,
      category: resource.category,
      file_type: "pdf",
    });
  };

  return (
    <div className="fixed bottom-4 left-3 right-3 z-40 mx-auto max-w-md lg:hidden transition-all duration-300">
      <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/95 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <button
          type="button"
          onClick={() => setShowShare(!showShare)}
          aria-label="Share resource"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] transition-all active:scale-95 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] cursor-pointer"
        >
          <Share2 className="h-4 w-4" />
        </button>

        <a
          href={resource.pdf}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDownload}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-xs sm:text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98] hover:bg-[var(--color-primary)]/90"
        >
          <Download className="h-4 w-4" />
          <span>Download Free PDF</span>
        </a>
      </div>

      {showShare && (
        <div className="mt-2 rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)]/98 p-3 shadow-2xl backdrop-blur-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Share this guide
          </p>
          <ShareButtons title={resource.title} url={url} />
        </div>
      )}
    </div>
  );
}
