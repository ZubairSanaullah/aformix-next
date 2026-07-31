import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  href: string;
  label?: string;
  compact?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function DownloadButton({
  href,
  label = "Download PDF",
  compact = false,
  children,
  className = "",
  onClick,
}: DownloadButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn("w-full block", className)}
      onClick={onClick}
    >
      <Button
        size={compact ? "sm" : "lg"}
        className="w-full h-12 text-sm sm:text-base font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer rounded-xl flex items-center justify-center gap-2"
      >
        {children ? (
          children
        ) : (
          <>
            <ArrowDownToLine size={18} className="text-white shrink-0" />
            <span className="text-white font-semibold">{label}</span>
          </>
        )}
      </Button>
    </Link>
  );
}