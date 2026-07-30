import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";

import { Button } from "@/components/ui/button";

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
      className={className}
    >
      <Button size={compact ? "sm" : "default"}>
        {children ? (
          children
        ) : (
          <>
            <ArrowDownToLine size={18} />
            <span>{label}</span>
          </>
        )}
      </Button>
    </Link>
  );
}