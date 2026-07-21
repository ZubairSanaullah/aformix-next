'use client';


import React from "react";
import { techStack } from "../constants";
import Divider from "./Divider";

const logoMap: Record<string, string> = {
  "HTML5": "html5",
  "CSS3": "css3",
  "JavaScript": "javascript",
  "React JS": "react",
  "TypeScript": "typescript",
  "GSAP": "greensock",
  "TailwindCSS": "tailwindcss",
  "Node.js": "nodedotjs",
  "Express": "express",
  "MongoDB": "mongodb",
  "WordPress": "wordpress",
  "Next.js": "nextdotjs",
  "Framer Motion": "framer",
  "Redux": "redux",
  "PostgreSQL": "postgresql",
};

const TechMarquee: React.FC = () => {
  return (
    <section className="reveal py-20 border-y border-[var(--color-border)] overflow-hidden relative" style={{ backgroundColor: "var(--color-surface)" }}>
      <h2 className="heading-2 mb-10">
        Our Tech Stack
      </h2>
      {/* Edge fade gradients */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--color-surface)] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10 pointer-events-none"></div>
      <div className="flex animate-marquee whitespace-nowrap gap-16 md:gap-24 items-center">
        {[...techStack, ...techStack, ...techStack].map((tech, index) => {
          const logoSlug = logoMap[tech];
          return (
            <div
              key={index}
              className="flex items-center justify-center group cursor-default select-none opacity-40 hover:opacity-100 transition-opacity duration-500 min-w-[80px]"
              title={tech}
            >
              {logoSlug ? (
                <img
                  src={`https://cdn.simpleicons.org/${logoSlug}/white`}
                  alt={`${tech} logo`}
                  className="h-12 w-12 md:h-14 md:w-14 object-contain group-hover:scale-110 transition-all duration-500 light-mode-invert"
                />
              ) : (
                <span className="text-2xl md:text-4xl font-black text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">{tech}</span>
              )}
            </div>
          );
        })}
      </div>
      <Divider />
    </section>
  );
};

export default TechMarquee;
