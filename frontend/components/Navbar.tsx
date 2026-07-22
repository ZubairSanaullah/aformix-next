"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navLinks } from "../constants";
import { serviceNavItems, getServicePath } from "../constants/serviceNav";
import { Menu, X, ArrowRight, Sun, Moon, Monitor, Layout, Users, ChevronDown, Smartphone, BookOpen, BriefcaseBusiness, Calendar1, FileText } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Image from "next/image";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoverStyle, setHoverStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiUrl = baseApiUrl.includes("vercel.app") && !baseApiUrl.includes("/_/backend")
    ? `${baseApiUrl}/_/backend`
    : baseApiUrl;

  const checkAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("authStateChange", checkAuth);
    return () => window.removeEventListener("authStateChange", checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("authStateChange"));
    router.push("/login");
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? 'light' : 'dark');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        aria-label="Primary navigation"
        className={`fixed top-0 left-0 w-full z-[100] transition-transform duration-500 ease-in-out flex justify-center pointer-events-none ${isVisible ? "translate-y-0" : "-translate-y-full"
          } ${isScrolled ? "py-4" : "py-8"}`}
      >
        <div className="max-w-7xl mx-auto px-6 w-full pointer-events-auto">
          <div className={`flex items-center justify-between px-4 md:px-8 py-3 md:py-4 rounded-3xl transition-all duration-500 ${isScrolled
            ? "bg-[var(--color-bg)] shadow-2xl border border-[var(--color-glass-border)]"
            : "bg-transparent"
            }`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="/images/logo.png" 
                alt="Aformix logo"
                width={10} 
                height={10}
                priority
                className="w-4 md:w-7 cursor-pointer hover:scale-95 transition-transform" />
              <p className="text-base md:text-xl text-[var(--color-text)] font-bold transition-colors duration-500">Aformix</p>
            </Link>

            {/* Desktop Links */}
            <div
              className="hidden md:flex items-center gap-4 lg:gap-8 group relative flex-1 justify-center"
              onMouseLeave={() => {
                setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
                setHoveredMenu(null);
              }}
            >
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative py-4 flex items-center"
                  onMouseEnter={(e) => {
                    setHoverStyle({
                      left: e.currentTarget.offsetLeft,
                      width: e.currentTarget.offsetWidth,
                      opacity: 1,
                    });
                    setHoveredMenu(link.name);
                  }}
                >
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="nav-link flex items-center gap-1.5 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="nav-link flex items-center gap-1.5 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                    >
                      {link.name}
                      {['Products', 'Services', 'Company'].includes(link.name) && (
                        <ChevronDown size={14} className={`transition-transform duration-300 ${hoveredMenu === link.name ? 'rotate-180 text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`} />
                      )}
                    </a>
                  )}

                  {/* Dropdown Menu */}
                  {['Products', 'Services', 'Company'].includes(link.name) && (
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-300 ease-out z-50 ${link.name === 'Services' ? 'w-[520px]' : 'w-[340px]'
                        } ${hoveredMenu === link.name
                          ? "opacity-100 translate-y-0 visible pointer-events-auto"
                          : "opacity-0 translate-y-4 invisible pointer-events-none"
                        }`}
                    >
                      <div className="glass-effect rounded-2xl p-2 border border-[var(--color-glass-border)] shadow-2xl relative overflow-hidden backdrop-blur-xl bg-[var(--color-bg)]/95">
                        {/* Glow line at top */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-70" />

                        <div className="flex flex-col gap-1">
                          {link.name === 'Products' && (
                            <>
                              <a href="#" className="p-3 hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 group/item flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                  <Monitor size={20} />
                                </div>
                                <div>
                                  <h4 className="text-[var(--color-text)] font-semibold text-sm group-hover/item:text-[var(--color-primary)] transition-colors">Trading Platform</h4>
                                  <p className="text-[var(--color-text-muted)] text-xs mt-1 leading-relaxed">Advanced stock tracking & analytics.</p>
                                </div>
                              </a>
                              <a href="#" className="p-3 hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 group/item flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                  <Layout size={20} />
                                </div>
                                <div>
                                  <h4 className="text-[var(--color-text)] font-semibold text-sm group-hover/item:text-[var(--color-primary)] transition-colors">SaaS Templates</h4>
                                  <p className="text-[var(--color-text-muted)] text-xs mt-1 leading-relaxed">Beautifully designed UI templates.</p>
                                </div>
                              </a>
                              <a href="#" className="p-3 hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 group/item flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                  <Smartphone size={20} />
                                </div>
                                <div>
                                  <h4 className="text-[var(--color-text)] font-semibold text-sm group-hover/item:text-[var(--color-primary)] transition-colors">Mobile Toolkit</h4>
                                  <p className="text-[var(--color-text-muted)] text-xs mt-1 leading-relaxed">React Native component library.</p>
                                </div>
                              </a>
                            </>
                          )}
                          {link.name === 'Services' && (
                            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                              <div className="grid grid-cols-2 gap-1 p-1">
                                {serviceNavItems.map((item) => {
                                  const ItemIcon = item.icon;
                                  return (
                                    <Link
                                      key={item.id}
                                      href={getServicePath(item.id)}
                                      className="p-3 hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 group/item flex gap-3 items-start"
                                    >
                                      <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                        <ItemIcon size={18} />
                                      </div>
                                      <div className="min-w-0">
                                        <h4 className="text-[var(--color-text)] font-semibold text-xs group-hover/item:text-[var(--color-primary)] transition-colors truncate">
                                          {item.title}
                                        </h4>
                                        <p className="text-[var(--color-text-muted)] text-[11px] mt-0.5 leading-relaxed line-clamp-2">
                                          {item.shortDescription}
                                        </p>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {link.name === 'Company' && (
                            <>
                              <Link href="/about-us" className="p-3 hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 group/item flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                  <Users size={20} />
                                </div>
                                <div>
                                  <h4 className="text-[var(--color-text)] font-semibold text-sm group-hover/item:text-[var(--color-primary)] transition-colors">About Us</h4>
                                  <p className="text-[var(--color-text-muted)] text-xs mt-1 leading-relaxed">Learn about our mission and vision.</p>
                                </div>
                              </Link>
                              <Link href="/blog" className="p-3 hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 group/item flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                  <BookOpen size={20} />
                                </div>
                                <div>
                                  <h4 className="text-[var(--color-text)] font-semibold text-sm group-hover/item:text-[var(--color-primary)] transition-colors">Blog</h4>
                                  <p className="text-[var(--color-text-muted)] text-xs mt-1 leading-relaxed">Insights of Digital Growth</p>
                                </div>
                              </Link>

                              <a href="#portfolio" className="p-3 hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 group/item flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                  <BriefcaseBusiness size={20} />
                                </div>
                                <div>
                                  <h4 className="text-[var(--color-text)] font-semibold text-sm group-hover/item:text-[var(--color-primary)] transition-colors">Portfolio</h4>
                                  <p className="text-[var(--color-text-muted)] text-xs mt-1 leading-relaxed">Showcase of our best work</p>
                                </div>
                              </a>

                              <Link href="https://calendly.com/aformixtech/30min" target="_blank" className="p-3 hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 group/item flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                  <Calendar1 size={20} />
                                </div>
                                <div>
                                  <h4 className="text-[var(--color-text)] font-semibold text-sm group-hover/item:text-[var(--color-primary)] transition-colors">Book a Call</h4>
                                  <p className="text-[var(--color-text-muted)] text-xs mt-1 leading-relaxed">Get a free consultation</p>
                                </div>
                              </Link>

                              <Link href="/terms-of-service" target="_blank" className="p-3 hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 group/item flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                  <FileText size={20} />
                                </div>
                                <div>
                                  <h4 className="text-[var(--color-text)] font-semibold text-sm group-hover/item:text-[var(--color-primary)] transition-colors">Terms of Service</h4>
                                  <p className="text-[var(--color-text-muted)] text-xs mt-1 leading-relaxed">Terms & conditions</p>
                                </div>
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* Sliding Dot */}
              <div
                className="absolute bottom-1 h-1.5 w-1.5 rounded-full transition-all duration-1000 ease-out pointer-events-none"
                style={{
                  left: hoverStyle.left + hoverStyle.width / 2 - 3,
                  opacity: hoverStyle.opacity,
                  backgroundColor: "var(--color-primary)"
                }}
              />
            </div>

            <div className="hidden md:flex items-center gap-3 lg:gap-6 flex-shrink-0">
              {/* Theme Toggle */}
              <button 
                aria-label="Toggle theme"
                onClick={toggleTheme} 
                className="w-9 lg:w-10 h-9 lg:h-10 rounded-xl glass-effect flex items-center justify-center text-[var(--color-text)] hover:text-primary transition-colors cursor-pointer flex-shrink-0" title="Toggle Theme">
                {theme === "light" ? <Sun size={16} className="lg:w-[18px] lg:h-[18px]" /> : theme === "dark" ? <Moon size={16} className="lg:w-[18px] lg:h-[18px]" /> : <Monitor size={16} className="lg:w-[18px] lg:h-[18px]" />}
              </button>

              {user ? (
                <div className="relative group/profile">
                  <button 
                    aria-label={`User menu for ${user.name}`}
                    className="w-9 lg:w-10 h-9 lg:h-10 rounded-full glass-effect flex items-center justify-center text-[var(--color-text)] font-bold uppercase hover:ring-2 hover:ring-primary transition-all cursor-pointer text-xs lg:text-sm flex-shrink-0">
                      {user.name ? user.name[0] : "U"}
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl glass-effect opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-300 flex flex-col z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--color-glass-border)] mb-1">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">{user.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 text-left text-sm text-red-500 hover:bg-[var(--color-glass)] transition-colors cursor-pointer font-medium">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <button className="btn-outline hidden lg:flex items-center gap-2 !py-2.5 !px-4 lg:!px-6 text-xs lg:text-sm cursor-pointer flex-shrink-0">
                      Login
                    </button>
                  </Link>
                  <a href="#contact">
                    <button className="btn-primary hidden lg:flex items-center gap-2 !py-2.5 !px-4 lg:!px-6 text-xs lg:text-sm cursor-pointer flex-shrink-0">
                      Get Started <ArrowRight size={14} className="lg:w-4 lg:h-4" />
                    </button>
                  </a>
                </>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Theme Toggle */}
              <button 
                aria-label="Toggle theme"
                onClick={toggleTheme} 
                className="w-10 h-10 rounded-xl glass-effect flex items-center justify-center text-[var(--color-text)] hover:text-primary transition-colors cursor-pointer" title="Toggle Theme">
                {theme === "light" ? <Sun size={16} /> : theme === "dark" ? <Moon size={16} /> : <Monitor size={16} />}
              </button>

              {/* Mobile User Avatar */}
              {user && (
                <div className="relative group/profile-mobile">
                  <button 
                    aria-label={`User menu for ${user.name}`}
                    className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-[var(--color-text)] font-bold uppercase hover:ring-2 hover:ring-primary transition-all cursor-pointer text-xs">
                      {user.name ? user.name[0] : "U"}
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 py-2 rounded-xl glass-effect opacity-0 invisible group-hover/profile-mobile:opacity-100 group-hover/profile-mobile:visible transition-all duration-300 flex flex-col z-50 overflow-hidden shadow-2xl">
                    <div className="px-4 py-3 border-b border-[var(--color-glass-border)] mb-1">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">{user.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 text-left text-sm text-red-500 hover:bg-[var(--color-glass)] transition-colors cursor-pointer font-medium">
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {/* Hamburger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                className="w-10 h-10 rounded-xl glass-effect flex items-center justify-center text-[var(--color-text)] cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-navigation"
          aria-hidden={!isMobileMenuOpen}
          className={`md:hidden absolute top-full left-0 w-full px-4 pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] overflow-hidden ${isMobileMenuOpen ? "max-h-[500px] py-3 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none"
          }`}>
          <div className="glass-effect rounded-2xl p-5 flex flex-col gap-1 shadow-2xl border border-[var(--color-glass-border)]">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-sm font-semibold text-[var(--color-text)] hover:text-primary hover:bg-[var(--color-glass)] rounded-xl transition-all duration-300 flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-40"></span>
                {link.name}
              </Link>
            ))}

            <div className="h-px bg-[var(--color-border)] w-full my-2"></div>

            {!user && (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block mb-2">
                <button className="btn-outline w-full cursor-pointer text-sm py-2.5 flex items-center justify-center gap-2">
                  Login
                </button>
              </Link>
            )}

            <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block">
              <button className="btn-primary w-full cursor-pointer text-sm py-2.5 flex items-center justify-center gap-2">
                Get Started <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
