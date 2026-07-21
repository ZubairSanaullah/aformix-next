'use client';

import React, { useState } from "react";
import { projects } from "../constants";
import { ArrowUpRight } from "lucide-react";
import Divider from "./Divider";
import Image from "next/image";

const Portfolio: React.FC = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 3);

  return (
    <section id="works" className="reveal section-padding relative w-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[var(--color-bg)]/80 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-primary font-black tracking-[0.35em] uppercase mb-4 inline-block">Our Portfolio</span>
          <h2 className="heading-2 mb-6">Recent Work That Drives Results</h2>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
            Explore a curated selection of projects built for growth, engagement, and polished digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {visibleProjects.map((project, index) => {
            const isFeatured = index === 0;

            return (
              <article
                key={project.id}
                className={`portfolio-card group ${
                  isFeatured ? "md:col-span-2 md:row-span-2 min-h-[560px]" : "min-h-[420px]"
                }`}
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.playbackRate = 1.25;
                    video.play();
                  }
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.pause();
                }}
              >
                {('video' in project && typeof project.video === 'string') ? (
                  <>
                    <video
                      src={project.video}
                      muted
                      loop
                      playsInline
                      preload="none"
                      className="absolute inset-0 h-full w-full object-contain transition-transform duration-1000 group-hover:scale-110"
                    />
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={1000}
                      className="absolute inset-0 h-full w-full object-contain transition-all duration-1000 group-hover:scale-110 group-hover:opacity-0"
                    />
                  </>
                ) : (
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={1000}
                    className="absolute inset-0 h-full w-full object-contain transition-transform duration-1000 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 portfolio-gradient" />
                <div className="absolute inset-x-0 bottom-0 z-20 p-8 flex h-full flex-col justify-end">
                  <div className="mb-4 inline-flex items-center rounded-full border border-[var(--color-border)] glass-effect px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--color-text)] shadow-sm">
                    {project.category}
                  </div>
                  {isFeatured && (
                    <span className="mb-3 inline-flex text-xs uppercase tracking-[0.4em] text-primary">Featured project</span>
                  )}
                  <h3 className={`portfolio-title font-black text-[var(--color-text)] leading-tight ${isFeatured ? "text-4xl md:text-[3rem]" : "text-3xl"}`}>
                    {project.title}
                  </h3>
                  <div className="mt-8 flex items-center justify-between gap-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-view-link inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] glass-effect px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:bg-primary hover:text-white hover:border-primary"
                    >
                      View project
                      <ArrowUpRight size={18} />
                    </a>
                    <span className="text-[var(--color-text-muted)] text-sm">
                      {isFeatured ? "Top case study" : "Project preview"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-[var(--color-text-muted)] text-center">Showing {visibleProjects.length} of {projects.length} projects.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowAllProjects((prev) => !prev)}
          >
            {showAllProjects ? "Show Less Projects" : "View All Projects"}
          </button>
        </div>
      </div>
      <Divider />
    </section>
  );
};

export default Portfolio;
