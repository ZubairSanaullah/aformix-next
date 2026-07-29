import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";

interface DownloadButtonProps {
  href: string;
  label?: string;
  compact?: boolean;
}

export default function DownloadButton({ href, label = "Download PDF", compact = false }: DownloadButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--color-secondary)] ${compact ? "text-sm" : "text-base"}`}
      aria-label={label}
    >
      <ArrowDownToLine size={18} />
      {label}
    </Link>
  );
}
