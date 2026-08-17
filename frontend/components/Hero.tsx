'use client';

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  ExternalLink,
  Zap,
  Globe,
  Cpu,
  Terminal,
  Database,
  CheckCircle2,
  Cloud
} from "lucide-react";
import { BiMobile } from "react-icons/bi";
import { BsRobot } from "react-icons/bs";
import AnalyticsLink from "@/components/analytics/AnalyticsLink";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ───────────────────── Background Particles ───────────────────── */
const ParticleField: React.FC = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.3 + 0.1,
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

/* ───────────────────────── MAIN HERO ───────────────────────── */
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

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
      .fromTo(".mascot-outer-container", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.9")
      .fromTo(".floating-card-ui", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.6)" }, "-=0.7")
      .fromTo(".workflow-connector-line", { strokeDashoffset: 150, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 1, stagger: 0.2 }, "-=0.5");

    // Scroll ScrollTrigger Animations
    // 1. Mascot floats upward and scales up slightly
    gsap.to(".mascot-wrapper", {
      y: -100,
      scale: 1.05,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      }
    });

    // 2. Glowing Rings scale and rotate faster on scroll
    gsap.to(".glowing-rings-inner", {
      rotation: 180,
      scale: 1.15,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });

    // 3. Floating cards fly upward at staggered speeds
    gsap.to(".floating-card-ui--1", {
      y: -150,
      x: -20,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      }
    });

    // 4. Floating cards fly upward at staggered speeds
    gsap.to(".floating-card-ui--2", {
      y: -180,
      x: 10,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });

    // 5. Floating cards fly upward at staggered speeds
    gsap.to(".floating-card-ui--3", {
      y: -130,
      x: -15,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.9,
      }
    });

    // 6. Connection Lines reveal & stroke-dash animate
    gsap.to(".workflow-connector-line", {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 20%",
        end: "bottom top",
        scrub: 0.5,
      }
    });

  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero section"
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
            <p className="hero-badge">
              <span className="hero-badge-pulse" />
              <span className="hero-badge-text">OrbitAI - Intelligent Digital Solutions</span>
            </p>

            {/* Headline */}
            <h1 className="hero-headline">
              <span className="hero-title-chunk">Building Intelligent</span>
              <br />
              <span className="hero-headline-gradient">
                <span className="hero-title-chunk">Digital Experiences</span>
              </span>
              <br />
              <span className="hero-title-chunk">That Scale</span>
            </h1>

            {/* Subheadline */}
            <p className="hero-description text-xl text-[var(--color-text-muted)] leading-relaxed max-w-xl">
              Aformix helps businesses make intelligent digital products, launch modern web platforms,
              and transform ideas into powerful digital products.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <AnalyticsLink
                href="/#contact"
                className="hero-cta-btn hero-cta-primary"
                eventName="cta_click"
                eventParams={{
                  button: "hero_get_started",
                  location: "homepage",
                }}
                trackCta
                ctaName="Get Started"
                ctaLocation="hero"
              >
                <span>Get Started</span>
                <ArrowRight size={18} className="hero-cta-arrow" />
              </AnalyticsLink>
              <AnalyticsLink
                href="/#portfolio"
                className="hero-cta-btn hero-cta-secondary"
                eventName="cta_click"
                eventParams={{
                  button: "hero_view_portfolio",
                  location: "homepage",
                }}
                trackCta
                ctaName="View Portfolio"
                ctaLocation="hero"
              >
                <span>View Portfolio</span>
                <ExternalLink size={16} />
              </AnalyticsLink>
              <button
                aria-label="Open Orbit AI assistant"
                onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-orbit-ai')); }}
                className="hero-cta-btn hero-cta-secondary"
              >
                <span>Open Orbit AI</span>
                <BsRobot size={16} />
              </button>
            </div>

            {/* Trust Elements: Floating Badges */}
            <div className="hero-trust-badges">
              {[
                { icon: <Zap size={14} />, label: "Full-Stack Development" },
                { icon: <BiMobile size={14} />, label: "Custom Web Apps" },
                { icon: <Globe size={14} />, label: "Web Development" },
                { icon: <Cloud size={14} />, label: "SaaS Solutions" },
              ].map((item, i) => (
                <div key={i} className="hero-trust-badge">
                  <span className="hero-trust-icon">{item.icon}</span>
                  <span className="hero-trust-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Mascot Orbit Centerpiece */}
          <div className="hero-right">

            {/* Animated Glowing Rings behind Orbit */}
            <div className="glowing-rings-container" aria-hidden="true">
              <div className="glowing-rings-inner">
                <div className="glowing-ring glowing-ring--1" />
                <div className="glowing-ring glowing-ring--2" />
                <div className="glowing-ring glowing-ring--3" />
              </div>
            </div>

            {/* Orbit Mascot Canvas Wrapper */}
            <div className="mascot-outer-container">
              <div className="mascot-wrapper">
                <video
                  src="/vid/orbit.mp4"
                  aria-hidden="true"
                  tabIndex={-1}
                  className="mascot-video-element overflow-hidden object-cover"
                  style={{ borderRadius: "30px" }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>

            {/* SVG Connection Nodes & Data Streams */}
            <svg className="workflow-connections-svg" viewBox="0 0 500 500" aria-hidden="true">
              <defs>
                <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#27b990" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#684b9e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#27b990" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Path 1: From Workflow Card to Orbit */}
              <path
                className="workflow-connector-line"
                d="M 90 310 C 120 280, 160 250, 210 240"
                fill="none"
                stroke="url(#lineGrad1)"
                strokeWidth="1.5"
                strokeDasharray="8 6"
              />
              {/* Path 2: From Network Status to Orbit */}
              <path
                className="workflow-connector-line"
                d="M 400 130 C 370 170, 340 200, 290 220"
                fill="none"
                stroke="url(#lineGrad2)"
                strokeWidth="1.5"
                strokeDasharray="8 6"
              />
              {/* Path 3: From Stats Card to Orbit */}
              <path
                className="workflow-connector-line"
                d="M 390 380 C 340 370, 300 340, 260 280"
                fill="none"
                stroke="url(#lineGrad1)"
                strokeWidth="1.5"
                strokeDasharray="8 6"
              />
            </svg>

            {/* Floating UI Elements / Glassmorphism Cards */}

            {/* FLOATING CARD 1: Development Workflow */}
            <div className="floating-card-ui floating-card-ui--1" aria-hidden="true">
              <div className="floating-card-hdr">
                <Terminal size={14} className="text-primary" />
                <span className="floating-card-title">Web App</span>
                <span className="pulse-indicator" />
              </div>
              <div className="workflow-steps">
                <div className="workflow-step active">
                  <CheckCircle2 size={12} className="text-primary" />
                  <span>Analyzing Request</span>
                </div>
                <div className="workflow-step-connector" />
                <div className="workflow-step processing">
                  <Cpu size={12} className="text-secondary-color text-pulse" />
                  <span>Processing Request</span>
                </div>
                <div className="workflow-step-connector" />
                <div className="workflow-step">
                  <Database size={12} className="text-muted" />
                  <span>Sending Response</span>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 2: Network / Agent Status */}
            <div className="floating-card-ui floating-card-ui--2">
              <div className="agent-status-layout">
                <div className="agent-avatar-ring">
                  <BsRobot size={16} className="text-white" />
                </div>
                <div className="agent-status-info">
                  <span className="agent-status-label">Orbit Assistant</span>
                  <span className="agent-status-message">Optimizing workflow...</span>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 3: Performance Metric */}
            <div className="floating-card-ui floating-card-ui--3">
              <div className="metric-card-layout">
                <span className="metric-label">Efficiency Boost</span>
                <div className="metric-value-row">
                  <span className="metric-value">+94%</span>
                  <Zap size={14} className="text-primary fill-primary" />
                </div>
                <div className="metric-bar-bg">
                  <div className="metric-bar-fill" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;

