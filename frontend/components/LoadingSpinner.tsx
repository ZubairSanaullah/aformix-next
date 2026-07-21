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
      scale: 1.1,
      duration: 1,
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--color-bg)]"
    >
      <div className="flex flex-col items-center gap-8">
        <div
          ref={logoRef}
          className="flex flex-col items-center gap-3"
        >
          <Image 
            src={logo} 
            alt="Aformix" 
            priority
            className="w-14 h-14 object-contain" />
          <span className="text-3xl font-black tracking-wider text-[var(--color-text)]">
            AFORMIX
          </span>
        </div>
        <div className="w-48 h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div className="h-full rounded-full animate-progress" style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }}></div>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] tracking-widest uppercase">Loading</p>
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
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
