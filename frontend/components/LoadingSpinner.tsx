'use client';

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import logo from "../assets/logo.png";
import Image from "next/image";

const LoadingSpinner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(logoRef.current, {
      scale: 1.08,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[var(--color-bg)]"
    >
      {/* Ambient glow blobs, matches hero-bg-glow */}
      <div
        className="pointer-events-none absolute -left-[10%] -top-[10%] h-[45%] w-[45%] rounded-full opacity-20 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(39,185,144,0.5) 0%, transparent 70%)",
          filter: "blur(120px)",
          animation: "loader-float 9s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[45%] w-[45%] rounded-full opacity-20 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(104,75,158,0.45) 0%, transparent 70%)",
          filter: "blur(120px)",
          animation: "loader-float 11s ease-in-out infinite reverse",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div
          ref={logoRef}
          className="flex flex-col items-center gap-4"
        >
          {/* Orbiting rings around the logo */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            <span
              className="absolute inset-0 rounded-full border border-dashed"
              style={{
                borderColor: "rgba(39,185,144,0.25)",
                animation: "loader-ring-spin 6s linear infinite",
              }}
            />
            <span
              className="absolute inset-2 rounded-full border border-dashed"
              style={{
                borderColor: "rgba(104,75,158,0.3)",
                animation: "loader-ring-spin 9s linear infinite reverse",
              }}
            />

            <div
              className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                boxShadow: "0 8px 30px rgba(39,185,144,0.3)",
              }}
            >
              <Image
                src={logo}
                alt="Aformix"
                priority
                className="h-8 w-8 object-contain"
              />
            </div>
          </div>

          <span
            className="text-2xl font-black tracking-wider"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            AFORMIX
          </span>
        </div>

        <div className="h-1 w-48 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div
            className="h-full rounded-full animate-progress"
            style={{
              background:
                "linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-accent))",
            }}
          />
        </div>

        <p className="text-sm tracking-widest text-[var(--color-text-muted)] uppercase">
          Loading
        </p>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
        @keyframes loader-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-24px) scale(1.06); }
        }
        @keyframes loader-ring-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-progress {
            animation: none;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;