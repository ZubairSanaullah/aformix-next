"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Zap,
  Shield,
  CreditCard,
  Calendar,
  Copyleft,
  AlertTriangle,
  Scale,
  Power,
  Link,
  Eye,
  RefreshCw,
  Gavel,
  Mail,
  ChevronRight,
  Copy,
  Check,
  ArrowUp,
  Menu,
  X,
} from 'lucide-react';
import {
  TERMS_OF_SERVICE_DATA,
  QUICK_LINKS,
} from "@/constants/termsData";

interface SectionItem {
  title?: string;
  name?: string;
  condition?: string;
  description: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
  BookOpen: <BookOpen className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  CreditCard: <CreditCard className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  Copyleft: <Copyleft className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Power: <Power className="w-6 h-6" />,
  Link: <Link className="w-6 h-6" />,
  Eye: <Eye className="w-6 h-6" />,
  RefreshCw: <RefreshCw className="w-6 h-6" />,
  Gavel: <Gavel className="w-6 h-6" />,
  Mail: <Mail className="w-6 h-6" />,
};

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        setScrollProgress(scrolled);
        setShowScrollTop(scrollTop > 400);
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
    };
    }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setActiveSection(sectionId);
      element.scrollIntoView({ behavior: 'smooth' });
      if (isMobile) setSidebarOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
        {/* Animated Background */}
        {/* <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.7s'}} />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-primary)/3,transparent,var(--color-secondary)/3)]" />
        </div> */}

        {/* Content */}
        <div className="relative z-10">
          {/* Mobile Menu Toggle */}
          <motion.button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-24 left-4 z-40 p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 hover:border-primary/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            {/* Hero Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-20 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 mt-16">
                  Terms of Service
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl text-[var(--color-text-muted)] mb-4 max-w-3xl mx-auto"
              >
                Legal agreement between Aformix and clients using our web development and digital solutions services.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-sm text-[var(--color-text-muted)]"
              >
                Last Updated: {TERMS_OF_SERVICE_DATA.lastUpdated}
              </motion.p>

              {/* Hero Gradient Border */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-8 max-w-md mx-auto"
              />
            </motion.section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <AnimatePresence>
                {(sidebarOpen || !isMobile) && (
                  <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-1"
                  >
                    <motion.div
                      className="sticky top-32 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-xl transition-colors duration-300"
                      whileHover={{ borderColor: 'var(--color-primary)' }}
                    >
                      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4 uppercase tracking-wider">
                        Quick Navigation
                      </h3>
                      <nav className="space-y-2">
                        {QUICK_LINKS.map((link, index) => {
                          const sectionId = link.toLowerCase().replace(/\s+/g, '-');
                          const isActive = activeSection === sectionId;

                          return (
                            <motion.button
                              type="button"
                              key={index}
                              onClick={() => scrollToSection(sectionId)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 group ${isActive
                                ? 'bg-gradient-to-r from-primary/30 to-secondary/30 text-primary border border-primary/50'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-primary/10'
                                }`}
                              whileHover={{ x: 4 }}
                            >
                              <motion.span
                                initial={false}
                                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -8 }}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </motion.span>
                              {link}
                            </motion.button>
                          );
                        })}
                      </nav>
                    </motion.div>
                  </motion.aside>
                )}
              </AnimatePresence>

              {/* Main Content */}
              <motion.div className="lg:col-span-3">
                <div className="space-y-16">
                  {TERMS_OF_SERVICE_DATA.sections.map((section, index) => (
                    <motion.section
                      key={section.id}
                      id={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true, margin: '-100px' }}
                      className="scroll-mt-40"
                    >
                      {/* Section Header */}
                      <motion.div
                        className="flex items-start gap-4 mb-6"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center text-primary flex-none transition-colors duration-300">
                          {section.icon ? iconMap[section.icon] : <BookOpen className="w-6 h-6" />}
                        </div>
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">
                            {section.title}
                          </h2>
                          <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full" />
                        </div>
                      </motion.div>

                      {/* Section Content */}
                      {section.content && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          viewport={{ once: true }}
                          className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl mb-6 transition-colors duration-300"
                        >
                          <p className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                            {section.content}
                          </p>
                        </motion.div>
                      )}

                      {/* Services Grid */}
                      {section.subsections && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {section.subsections.map((subsection, subIndex) => (
                            <motion.div
                              key={subIndex}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: subIndex * 0.1, duration: 0.4 }}
                              viewport={{ once: true }}
                              className="group p-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 cursor-pointer"
                              whileHover={{ y: -4 }}
                            >
                              <h4 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                                {subsection.name}
                              </h4>
                              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                                {subsection.description}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Responsibilities/Items List */}
                      {section.items && (
                        <div className="space-y-3">
                          {section.items.map((item: SectionItem, itemIndex: number) => (
                            <motion.div
                              key={itemIndex}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.08, duration: 0.4 }}
                              viewport={{ once: true }}
                              className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
                            >
                              <div className="flex-shrink-0 w-1 h-1 bg-gradient-to-b from-primary to-secondary rounded-full mt-2" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-[var(--color-text)] group-hover:text-primary transition-colors">
                                  {item.title || item.name || item.condition}
                                </h4>
                                <p className="text-[var(--color-text-muted)] text-sm mt-1">
                                  {item.description}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Section Divider */}
                      {index < TERMS_OF_SERVICE_DATA.sections.length - 1 && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          viewport={{ once: true }}
                          className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-16"
                        />
                      )}
                    </motion.section>
                  ))}

                  {/* Contact CTA Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-20"
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />

                      <motion.div
                        className="relative bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-2xl p-8 md:p-12 text-center backdrop-blur-xl transition-colors duration-300"
                        whileHover={{ borderColor: 'var(--color-primary)' }}
                      >
                        <motion.h3
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          viewport={{ once: true }}
                          className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4"
                        >
                          Need Clarification About These Terms?
                        </motion.h3>

                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          viewport={{ once: true }}
                          className="text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto"
                        >
                          Our team is here to answer any questions about our Terms of Service or any aspect of our services.
                        </motion.p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                          <motion.a
                            href="mailto:legal@aformix.com"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                          >
                            <Mail className="w-5 h-5" />
                            Contact Legal Team
                          </motion.a>

                          <motion.button
                            type="button"
                            onClick={() => copyToClipboard('legal@aformix.com')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-lg border border-primary/50 text-primary font-semibold hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
                          >
                            {copied ? (
                              <>
                                <Check className="w-5 h-5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-5 h-5" />
                                Copy Email
                              </>
                            )}
                          </motion.button>
                        </div>

                        <p className="text-sm text-[var(--color-text-muted)]">
                          Response time: {TERMS_OF_SERVICE_DATA.contactInfo.hours}
                        </p>
                      </motion.div>
                    </div>
                  </motion.section>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll to Top Button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
   );
}