import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
=======

import { Button } from "@/components/ui/button";
>>>>>>> da515907fea760fe2ecf7855489aaded52e1be30

interface DownloadButtonProps {
  href: string;
  label?: string;
  compact?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function DownloadButton({
  href,
  label = "Download PDF",
  compact = false,
  children,
  className = "",
}: DownloadButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
<<<<<<< HEAD
      className={cn("w-full block", className)}
    >
      <Button
        size={compact ? "sm" : "lg"}
        className="w-full h-12 text-sm sm:text-base font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer rounded-xl flex items-center justify-center gap-2"
      >
=======
      className={className}
    >
      <Button size={compact ? "sm" : "default"}>
>>>>>>> da515907fea760fe2ecf7855489aaded52e1be30
        {children ? (
          children
        ) : (
          <>
<<<<<<< HEAD
            <ArrowDownToLine size={18} className="text-white shrink-0" />
            <span className="text-white font-semibold">{label}</span>
=======
            <ArrowDownToLine size={18} />
            <span>{label}</span>
>>>>>>> da515907fea760fe2ecf7855489aaded52e1be30
          </>
        )}
      </Button>
    </Link>
  );
}