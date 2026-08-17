"use client";

import { useState, type SVGProps, type ComponentType } from "react";
import { Send, Copy, MessageCircle } from "lucide-react";
import { FaFacebookF, FaLinkedin } from "react-icons/fa6";


interface ShareButtonsProps {
  title: string;
  url: string;
}

interface ShareLink {
  key: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: (url: string, title: string) => string;
}

const shareLinks: ShareLink[] = [
  { key: "instagram", label: "Instagram", icon: MessageCircle, href: (url: string) => `https://www.instagram.com/?url=${encodeURIComponent(url)}` },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin, href: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  { key: "facebook", label: "Facebook", icon: FaFacebookF, href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { key: "x", label: "X", icon: (props: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.9 2H22l-6.8 7.8L23.5 22h-6.1l-4.8-6.3L6.6 22H3.4l7.2-8.2L.5 2h6.2l4.3 5.7L18.9 2Z" /></svg>, href: (url: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}` },
  { key: "whatsapp", label: "WhatsApp", icon: Send, href: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}` },
];

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5" aria-label="Share this resource">
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.key}
            href={link.href(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] transition-all duration-300 active:scale-95 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white shadow-xs sm:px-3.5 sm:py-2"
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{link.label}</span>
          </a>
        );
      })}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] transition-all duration-300 active:scale-95 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer shadow-xs sm:px-3.5 sm:py-2"
      >
        <Copy className="h-3.5 w-3.5 shrink-0" />
        <span>{copied ? "Copied!" : "Copy Link"}</span>
      </button>
    </div>
  );
}
