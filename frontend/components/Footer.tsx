'use client';

import React from "react";
import Link from "next/link";
import { FaLinkedin, FaInstagram, FaFacebookF, FaDiscord, FaTiktok, FaXTwitter, FaEnvelope } from "react-icons/fa6";
import Image from "next/image";
import FooterNewsletter from "./FooterNewsletter";
import { serviceNavItems, getServicePath } from "../constants/serviceNav";

const socialLinks = [
  { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/in/aformix-tech-173393413/" },
  { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/aformixtech/" },
  { name: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com/groups/1307102654425341/" },
  { name: "Discord", icon: FaDiscord, href: "https://discord.com/channels/1510971122164699237/1510971123288899607" },
  { name: "TikTok", icon: FaTiktok, href: "https://www.tiktok.com/@aformixtech" },
  { name: "X", icon: FaXTwitter, href: "https://x.com/Afromixtech" },
  { name: "Email", icon: FaEnvelope, href: "mailto:hello@aformix.com" },
];

const Footer: React.FC = () => {
  return (
    <footer className="reveal pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 border-t border-[var(--color-border)] relative overflow-hidden w-full flex justify-center" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 lg:gap-8 mb-16 sm:mb-24">
          {/* Column 1: Logo, Company Info & Newsletter */}
          <div className="flex flex-col items-start text-left w-full lg:pr-8">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/images/logo.png" alt="Aformix company logo" className="w-8 sm:w-10 object-contain hover:scale-105 transition-all duration-300" width={35} height={35} />
              <h2 className="text-2xl font-bold tracking-wide text-[var(--color-text)]" id="footer-heading">Aformix</h2>
            </div>
            <div className="w-full">
              <FooterNewsletter />
            </div>
          </div>
          <div className="flex flex-col items-start text-left">
            <h4 className="text-[var(--color-text)] font-black uppercase tracking-widest text-xs mb-6 sm:mb-10">Products</h4>
            <ul className="space-y-3 sm:space-y-5 text-left">
              {[
                { label: "SaaS Platforms", href: "/services/saas-development" },
                { label: "E-commerce", href: "/services/e-commerce-development" },
                { label: "Mobile Apps", href: "/services/mobile-app-development" },
                { label: "UI/UX Design", href: "/services/ui-ux-design" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="footer-link text-[var(--color-text-muted)] hover:text-primary font-bold transition-all block text-sm sm:text-base">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start text-left">
            <h4 className="text-[var(--color-text)] font-black uppercase tracking-widest text-xs mb-6 sm:mb-10">Solutions</h4>
            <ul className="space-y-3 sm:space-y-5 text-left">
              {serviceNavItems.slice(0, 8).map((item) => (
                <li key={item.id}>
                  <Link href={getServicePath(item.id)} className="footer-link text-[var(--color-text-muted)] hover:text-primary font-bold transition-all block text-sm sm:text-base">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start text-left">
            <h4 className="text-[var(--color-text)] font-black uppercase tracking-widest text-xs mb-6 sm:mb-10">Company</h4>
            <ul className="space-y-3 sm:space-y-5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/#contact" },
                { label: "Book a Meeting", href: "https://calendly.com/aformixtech/30min", target: "_blank", rel: "noopener noreferrer" },
              ].map((item) => (
                <li key={item.label}>
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link text-[var(--color-text-muted)] hover:text-primary font-bold transition-all text-sm sm:text-base"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="footer-link text-[var(--color-text-muted)] hover:text-primary font-bold transition-all text-sm sm:text-base"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="pt-8 sm:pt-12 border-t border-[var(--color-border)] flex flex-col gap-6 sm:gap-8 md:gap-6 text-[var(--color-text-muted)] font-bold text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8">
            <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} AFORMIX ALL RIGHTS RESERVED.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/privacy-policy" className="hover:text-[var(--color-text)] transition-colors text-xs sm:text-sm">PRIVACY POLICY</Link>
              <Link href="/terms-of-service" className="hover:text-[var(--color-text)] transition-colors text-xs sm:text-sm">TERMS OF SERVICE</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 relative flex-wrap">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                aria-label={`Visit Aformix on ${link.name}`}
                href={link.href}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-primary transition-all duration-300 relative group border border-[var(--color-border)] rounded-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <link.icon size={16} className="sm:size-5 group-hover:text-primary group-hover:scale-110 transition-all duration-300" aria-hidden="true"/>
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
