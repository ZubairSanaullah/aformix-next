'use client';

import { useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { BLOG_ARTICLES } from "@/constants/blogData";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, BookOpen } from 'lucide-react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ───────────────────── Background Particles ───────────────────── */
const ParticleField = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (i * 17) % 100,
    y: (i * 29) % 100,
    size: 1 + (i % 4),
    duration: 20 + (i % 15),
    delay: (i % 10) * 0.5,
    opacity: 0.15 + (i % 4) * 0.05,
  }));

  return (
    <div className="hero-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="hero-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

interface HeroSectionProps {
  onExplore: () => void;
  onSubscribe: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onSubscribe }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredArticles = BLOG_ARTICLES.filter(
    article => article.featured
  ).slice(0, 3);

  // Mouse move handler for premium 3D parallax layers
  const handleMouseMove = (e: React.MouseEvent) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    // Apply values to CSS custom variables for performant CSS transition transforms
    hero.style.setProperty("--mouse-x", x.toFixed(4));
    hero.style.setProperty("--mouse-y", y.toFixed(4));
  };

  const handleMouseLeave = () => {
    const hero = heroRef.current;
    if (!hero) return;
    // Reset values smoothly
    gsap.to(hero, {
      "--mouse-x": 0,
      "--mouse-y": 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  useGSAP(() => {
    // Entrance Timeline
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(".hero-badge", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo(".hero-title-chunk", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, "-=0.5")
      .fromTo(".hero-description", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5")
      .fromTo(".hero-cta-btn", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 }, "-=0.4")
      .fromTo(".hero-trust-badge", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: "back.out(1.5)" }, "-=0.3")
      .fromTo(".floating-card-ui", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.6)" }, "-=0.7");

    // Scroll ScrollTrigger Animations
    // 1. Floating cards fly upward at staggered speeds
    gsap.to(".floating-card-ui--1", {
      y: -150,
      x: -20,
      scrollTrigger: {
        trigger: heroRef.current!,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      }
    });

    gsap.to(".floating-card-ui--2", {
      y: -180,
      x: 10,
      scrollTrigger: {
        trigger: heroRef.current!,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });

    gsap.to(".floating-card-ui--3", {
      y: -130,
      x: -15,
      scrollTrigger: {
        trigger: heroRef.current!,
        start: "top top",
        end: "bottom top",
        scrub: 0.9,
      }
    });

  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      id="blog-hero"
      className="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Blog Hero section"
    >
      {/* ── Background Design Layers ── */}
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="hero-bg-glow hero-bg-glow--1" aria-hidden="true" />
      <div className="hero-bg-glow hero-bg-glow--2" aria-hidden="true" />
      <div className="hero-bg-glow hero-bg-glow--3" aria-hidden="true" />
      <div className="hero-bg-streak hero-bg-streak--1" aria-hidden="true" />
      <div className="hero-bg-streak hero-bg-streak--2" aria-hidden="true" />
      <ParticleField />

      {/* ── Main Content Container ── */}
      <div className="hero-container">
        <div className="hero-grid">

          {/* LEFT SIDE: Brand & Value Prop */}
          <div className="hero-left">
            {/* Premium Badge */}
            <div className="hero-badge">
              <span className="hero-badge-pulse" />
              <span className="hero-badge-text">INSIGHTS & INNOVATION</span>
            </div>

            {/* Headline */}
            <h1 className="hero-headline">
              <span className="hero-title-chunk">Insights,</span>
              <br />
              <span className="hero-headline-gradient">
                <span className="hero-title-chunk">Innovation</span>
              </span>
              <br />
              <span className="hero-title-chunk">& Digital Growth</span>
            </h1>

            {/* Subheadline */}
            <p className="hero-description">
              Expert insights on web development, SaaS, SEO, business growth, and emerging technologies
              that shape the future of digital innovation.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <button type="button" onClick={onExplore} className="hero-cta-btn hero-cta-primary">
                <span>Explore Articles</span>
                <ArrowRight size={18} className="hero-cta-arrow" />
              </button>
              <button type="button" onClick={onSubscribe} className="hero-cta-btn hero-cta-secondary">
                <span>Subscribe</span>
                <BookOpen size={16} />
              </button>
            </div>

            {/* Trust Elements: Floating Badges */}
            <div className="hero-trust-badges">
              {[
                { label: "50+ Articles" },
                { label: "20+ Authors" },
                { label: "10K+ Readers" },
              ].map((item) => (
                <div key={item.label} className="hero-trust-badge">
                  <span className="hero-trust-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Visual Centerpiece */}
          <div className="hero-right">
            {/* Floating UI Elements / Glassmorphism Cards */}
            {featuredArticles.map((article, index) => (
              <div 
                key={article.id} 
                className={`floating-card-ui floating-card-ui--${index + 1} cursor-pointer group`}
                style={{
                  width: '240px',
                  padding: '12px',
                  top: index === 0 ? '10%' : index === 1 ? '40%' : 'auto',
                  bottom: index === 2 ? '10%' : 'auto',
                  left: index === 1 ? '-20px' : 'auto',
                  right: index !== 1 ? (index === 0 ? '-10px' : '10px') : 'auto',
                  zIndex: 20 - index,
                }}
              >
                {/* Card Image */}
                <div className="relative h-32 mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-purple-600">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width:768px) 220px, 240px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-1 pb-1">
                  <h3 className="font-bold text-sm line-clamp-2 mb-2 text-white">
                    {article.title}
                  </h3>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{article.author.name}</span>
                    <span>{article.readingTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
