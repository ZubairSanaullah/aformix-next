"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Cookie,
  Globe,
  Lock,
  Mail,
  Monitor,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ServerCog,
  Shield,
  Clock3,
  CreditCard,
  BarChart3,
  Bell,
  Users,
  ShieldOff,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const policyCards: Array<{ title: string; description: string; icon: LucideIcon; accent: string }> = [
  {
    title: "Personal Information",
    description:
      "Information you provide directly, such as contact details, project briefs, and account preferences.",
    icon: Users,
    accent: "from-cyan-500 via-blue-500 to-purple-500",
  },
  {
    title: "Technical Information",
    description:
      "Device, browser, IP address, and session data used to deliver fast, compatible experiences.",
    icon: Monitor,
    accent: "from-sky-500 via-indigo-500 to-violet-500",
  },
  {
    title: "Cookies & Tracking",
    description:
      "Persistent and session cookies that support authentication, analytics, and interface personalization.",
    icon: Cookie,
    accent: "from-blue-500 via-cyan-500 to-sky-500",
  },
  {
    title: "Communication Data",
    description:
      "Messages, support requests, and email interactions that help us respond quickly and clearly.",
    icon: Mail,
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
  },
  {
    title: "Usage Analytics",
    description:
      "Behavior and performance data used to refine our platform, marketing, and product decisions.",
    icon: BarChart3,
    accent: "from-cyan-500 via-slate-500 to-purple-600",
  },
];

const usageItems = [
  {
    title: "Improve Services",
    description:
      "We use data to optimize website performance, enhance product workflows, and build features that matter to our clients.",
    icon: Sparkles,
  },
  {
    title: "Customer Support",
    description:
      "Client service, onboarding, and project coordination rely on accurate information and secure communications.",
    icon: Bell,
  },
  {
    title: "Security Monitoring",
    description:
      "We detect threats, prevent abuse, and protect your account using advanced monitoring and secure infrastructure.",
    icon: ShieldCheck,
  },
  {
    title: "Marketing Communications",
    description:
      "With consent, we share updates on new solutions, security practices, and agency announcements.",
    icon: Globe,
  },
  {
    title: "Performance Analytics",
    description:
      "Aggregated insights inform product refinement, UX enhancements, and server-side improvements.",
    icon: BarChart3,
  },
  {
    title: "Legal Compliance",
    description:
      "We process data to comply with regulations, contract obligations, and legitimate corporate governance needs.",
    icon: ShieldAlert,
  },
];

const cookiePolicies = [
  {
    title: "Essential Cookies",
    description:
      "Required for secure login, form validation, and core functionality across Aformix services.",
    status: "Always active",
  },
  {
    title: "Analytics Cookies",
    description:
      "Used to understand traffic patterns, improve navigation, and measure campaign performance.",
    status: "Opt-in recommended",
  },
  {
    title: "Performance Cookies",
    description:
      "Help us load pages faster and remember interface preferences for future visits.",
    status: "Adaptive and optional",
  },
];

const securityHighlights = [
  {
    title: "Encryption at Rest and Transit",
    description:
      "We protect stored data and data in transit with industry-standard encryption protocols.",
    icon: Lock,
  },
  {
    title: "Secure Infrastructure",
    description:
      "Our hosting and servers are chosen for redundancy, resilience, and verified compliance controls.",
    icon: ServerCog,
  },
  {
    title: "Data Protection Measures",
    description:
      "Access is limited by role, encrypted backups are maintained, and periodic audits ensure accountability.",
    icon: Shield,
  },
  {
    title: "Third-Party Security Tools",
    description:
      "We partner with trusted vendors for vulnerability scanning, fraud detection, and secure content delivery.",
    icon: ShieldOff,
  },
];

const thirdPartyPartners = [
  {
    title: "Payment Processors",
    description: "Trusted providers process secure invoicing, billing, and subscription payments.",
    icon: CreditCard,
  },
  {
    title: "Analytics Providers",
    description: "We rely on partners for anonymous performance insights and product analytics.",
    icon: BarChart3,
  },
  {
    title: "Hosting Platforms",
    description: "Cloud infrastructure providers deliver fast, scalable hosting for Aformix digital experiences.",
    icon: ServerCog,
  },
  {
    title: "Authentication Systems",
    description: "Secure login and user verification are managed by industry-standard authentication services.",
    icon: Lock,
  },
];

const userRights = [
  {
    title: "Access Your Data",
    description: "Request a copy of the personal information we process about your account or services.",
    icon: ClipboardCheck,
  },
  {
    title: "Request Deletion",
    description: "Ask us to remove data when it is no longer necessary for its original purpose.",
    icon: ShieldAlert,
  },
  {
    title: "Modify Information",
    description: "Keep your profile, billing, and project preferences accurate and up to date.",
    icon: Sparkles,
  },
  {
    title: "Withdraw Consent",
    description: "You may revoke marketing consent at any time without affecting service delivery.",
    icon: Bell,
  },
  {
    title: "Data Portability",
    description: "Receive your personal data in a structured format suitable for transfer to another service.",
    icon: Globe,
  },
];

const sectionLinks = [
  { id: "overview", label: "Overview" },
  { id: "collection", label: "Information" },
  { id: "usage", label: "How We Use" },
  { id: "cookies", label: "Cookies" },
  { id: "security", label: "Security" },
  { id: "third-party", label: "Partners" },
  { id: "rights", label: "Rights" },
  { id: "children", label: "Children" },
  { id: "updates", label: "Updates" },
  { id: "contact", label: "Contact" },
];

const contactEmail = "contact@aformix.com";

const sectionAnimation = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

function PolicyBadge({ text }: { text: string }) {
  return (
  <span className="inline-flex items-center rounded-full bg-[var(--color-surface-elevated)] px-3 py-1 text-sm font-medium uppercase tracking-[0.2em] text-primary shadow-lg">
    {text}
  </span>
  );
}

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

      const current = sectionLinks.reduce((currentId, section) => {
        const sectionElement = document.getElementById(section.id);
        if (!sectionElement) return currentId;
        const offset = sectionElement.getBoundingClientRect().top;
        return offset <= 120 ? section.id : currentId;
      }, "overview");

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative overflow-hidden overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)] scroll-smooth w-full transition-colors duration-300">

      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-[var(--color-surface)]">
        <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-12 top-40 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--color-primary)/15,transparent_35%),radial-gradient(circle_at_bottom_right,var(--color-secondary)/12,transparent_25%)] pointer-events-none" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col px-6 pb-24 pt-24 overflow-x-hidden sm:px-8 lg:px-10 mt-16">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
          className="relative overflow-hidden rounded-4xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-6 py-16 shadow-2xl shadow-[var(--color-bg)]/40 backdrop-blur-xl sm:px-10 lg:px-14 transition-colors duration-300"
          id="overview"
        >
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--color-surface)]/80 to-transparent" />
          <div className="absolute right-12 top-8 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute left-10 top-28 h-28 w-28 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(var(--color-primary-rgb),0.06),_transparent_20%),radial-gradient(circle_at_top_right,_rgba(var(--color-secondary-rgb),0.08),_transparent_20%)]" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <PolicyBadge text="Privacy Policy" />
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
              Data protection engineered for high-growth digital brands.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--color-text-muted)] sm:text-lg">
              At Aformix, we build premium web experiences backed by transparent privacy practices, secure systems, and client-first data controls.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                "Agency-grade security",
                "Clear data ownership",
                "Fast compliance-ready terms",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-sm text-[var(--color-text-muted)] shadow-xl">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm text-[var(--color-text-muted)] shadow-lg">
              <Clock3 className="h-4 w-4 text-primary" />
              Last updated: May 15, 2026
            </div>
          </div>
        </motion.section>

        <div className="mt-10 grid gap-10 xl:grid-cols-[280px_1fr] xl:gap-12">
          <aside className="hidden xl:sticky xl:top-28 xl:block">
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">On this page</div>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                Navigate quickly across our privacy commitments, security controls, and rights for your data.
              </p>
              <nav className="mt-6 space-y-3 text-sm text-[var(--color-text)]">
                {sectionLinks.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`group block rounded-3xl border px-4 py-3 transition duration-200 ${activeSection === section.id
                      ? "border-primary/50 bg-[var(--color-surface-elevated)] text-[var(--color-text)] shadow-lg"
                      : "border-transparent hover:border-primary/30 hover:bg-[var(--color-surface-elevated)]"
                      }`}
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <section className="space-y-16">
            <motion.div
              variants={sectionAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-4xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-[var(--color-text)]">Introduction</h2>
                  <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--color-text-muted)]">
                    This document explains how Aformix collects, processes, and safeguards information when you engage with our web development, design, and digital strategy services.
                  </p>
                </div>
                <div className="rounded-3xl border border-primary/15 bg-[var(--color-surface-elevated)] px-5 py-4 text-sm text-primary shadow-xl">
                  By using Aformix, you agree to the terms of this policy and our dedication to protecting your digital experience.
                </div>
              </div>
            </motion.div>

            <section id="collection" className="space-y-8">
              <motion.div
                variants={sectionAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-4xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-[var(--color-text)]">Information We Collect</h2>
                    <p className="mt-2 text-base leading-8 text-[var(--color-text-muted)]">
                      We gather only what is necessary to create secure, customized service for every Aformix client and visitor.
                    </p>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm text-[var(--color-text-muted)]">
                    Five categories of data with dedicated protection.
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {policyCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className="group rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-[var(--color-surface)]"
                      >
                        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 text-xl font-semibold text-[var(--color-text)]">{card.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{card.description}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            <section id="usage" className="space-y-8">
              <motion.div
                variants={sectionAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="rounded-4xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
              >
                <h2 className="text-3xl font-semibold text-[var(--color-text)]">How We Use Information</h2>
                <p className="mt-3 text-base leading-8 text-[var(--color-text-muted)]">
                  Aformix uses personal and technical data to deliver modern digital solutions while preserving trust, reliability, and performance.
                </p>

                <div className="mt-8 space-y-4">
                  {usageItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-primary/30">
                        <div className="absolute inset-y-0 left-0 h-full w-1 rounded-full bg-gradient-to-b from-primary to-secondary opacity-80" />
                        <div className="relative flex gap-4">
                          <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/15">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[var(--color-text)]">{item.title}</h3>
                            <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            <section id="cookies" className="space-y-8">
              <motion.div
                variants={sectionAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="rounded-4xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-[var(--color-text)]">Cookies Policy</h2>
                    <p className="mt-3 text-base leading-8 text-[var(--color-text-muted)]">
                      We use cookies to keep your experience seamless, secure, and tailored to how you interact with Aformix.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    No functional cookies are ever disabled automatically.
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {cookiePolicies.map((cookie) => (
                    <div key={cookie.title} className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-primary/30">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-text)]">{cookie.title}</h3>
                          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{cookie.status}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-[var(--color-text-muted)]">{cookie.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            <section id="security" className="space-y-8">
              <motion.div
                variants={sectionAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="rounded-4xl border border-primary/10 bg-[var(--color-surface)]/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <PolicyBadge text="Data Security" />
                    <h2 className="mt-4 text-3xl font-semibold text-[var(--color-text)]">Secure by design, privacy by default.</h2>
                    <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--color-text-muted)]">
                      Aformix protects client data with a security-first approach across infrastructure, backup policies, and access controls.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-primary/20 bg-[var(--color-surface-elevated)] px-5 py-4 text-sm text-primary shadow-xl">
                    Trusted controls with enterprise-grade reliability.
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {securityHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-primary/30"
                      >
                        <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary ring-1 ring-primary/15">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-text)]">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            <section id="third-party" className="space-y-8">
              <motion.div
                variants={sectionAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="rounded-4xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-[var(--color-text)]">Third-Party Services</h2>
                    <p className="mt-3 text-base leading-8 text-[var(--color-text-muted)]">
                      We work with carefully selected partners to deliver payments, analytics, hosting, and secure authentication.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm text-[var(--color-text-muted)]">
                    <Globe className="h-4 w-4 text-primary" />
                    Verified integration flow.
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {thirdPartyPartners.map((service) => {
                    const Icon = service.icon;
                    return (
                      <div key={service.title} className="group rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-primary/30">
                        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--color-surface)] text-primary ring-1 ring-primary/20">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 text-xl font-semibold text-[var(--color-text)]">{service.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{service.description}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            <section id="rights" className="space-y-8">
              <motion.div
                variants={sectionAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="rounded-4xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
              >
                <h2 className="text-3xl font-semibold text-[var(--color-text)]">Your Rights</h2>
                <p className="mt-3 text-base leading-8 text-[var(--color-text-muted)]">
                  You retain control over your personal data and can exercise these rights through our privacy contact channel.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {userRights.map((right) => {
                    const Icon = right.icon;
                    return (
                      <div key={right.title} className="flex gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-xl transition duration-300 hover:border-primary/30">
                        <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/15">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-text)]">{right.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">{right.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            <section id="children" className="space-y-8">
              <motion.div
                variants={sectionAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-4xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-[var(--color-text)]">Children's Privacy</h2>
                    <p className="mt-3 text-base leading-8 text-[var(--color-text-muted)]">
                      Aformix services are designed for professionals, businesses, and adult decision-makers. We do not intentionally collect data from children under 16.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    Age protection is part of our privacy commitment.
                  </div>
                </div>
              </motion.div>
            </section>

            <section id="updates" className="space-y-8">
              <motion.div
                variants={sectionAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-4xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-300"
              >
                <h2 className="text-3xl font-semibold text-[var(--color-text)]">Policy Updates</h2>
                <p className="mt-3 text-base leading-8 text-[var(--color-text-muted)]">
                  We may update this policy to reflect new technology, regulatory changes, or enhancements to our services. Important updates will be published on this page and shared through our communication channels.
                </p>
                <div className="mt-6 grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 text-[var(--color-text-muted)] shadow-xl">
                  <p className="text-sm leading-7">
                    We encourage you to review this privacy policy periodically. Continued use of Aformix services after changes indicates your acceptance of the updated terms.
                  </p>
                </div>
              </motion.div>
            </section>

            <section id="contact" className="space-y-8">
              <motion.div
                variants={sectionAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative overflow-hidden rounded-4xl border border-primary/20 bg-[var(--color-surface)]/95 px-8 py-12 shadow-2xl backdrop-blur-xl transition-colors duration-300"
              >
                <div className="absolute right-0 top-0 h-48 w-48 -translate-y-10 translate-x-10 rounded-full bg-secondary/10 blur-3xl" />
                <div className="absolute left-0 bottom-0 h-48 w-48 -translate-x-12 translate-y-10 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                  <div>
                    <PolicyBadge text="Need help?" />
                    <h2 className="mt-4 text-3xl font-semibold text-[var(--color-text)]">Have Questions About Your Privacy?</h2>
                    <p className="mt-3 text-base leading-8 text-[var(--color-text-muted)]">
                      Our team is available to answer privacy inquiries, update your preferences, and support secure project delivery.
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-primary">Contact</p>
                        <p className="mt-3 text-lg font-semibold text-[var(--color-text)]">{contactEmail}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:opacity-90"
                      >
                        {copied ? "Copied" : "Copy email"}
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                      Use this address for privacy requests, data access inquiries, and policy-related communications.
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}