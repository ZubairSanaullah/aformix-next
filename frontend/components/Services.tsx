'use client';

import React, { useRef, useState } from "react";
import Link from "next/link";
import { services } from "../constants";
import { homepageServiceSlugs, getServicePath } from "../constants/serviceNav";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Divider from "./Divider";
import Image from "next/image";

const Services: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Only apply JS drag for mouse; let touch devices use native scrolling
    if (event.pointerType !== "mouse" || !sliderRef.current) return;
    setIsDragging(true);
    setStartX(event.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    try {
      sliderRef.current.setPointerCapture(event.pointerId);
    } catch (e) {
      // Pointer capture may not be supported.
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !isDragging || !sliderRef.current) return;
    event.preventDefault();
    const x = event.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    setIsDragging(false);
    if (sliderRef.current) {
      try {
        sliderRef.current.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may not be supported.
      }
    }
  };

  const serviceImages: Record<number, string> = {
    1: '/img/services/1.png',
    2: '/img/services/2.png',
    3: '/img/services/3.jpg',
    4: '/img/services/4.png',
    5: '/img/services/5.png',
    6: '/img/services/6.png',
    7: '/img/services/7.png',
    8: '/img/services/8.png',

  };

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const distance = sliderRef.current.clientWidth * 0.85;
    sliderRef.current.scrollBy({ left: direction === "left" ? -distance : distance, behavior: "smooth" });
  };

  return (
    <section id="services" className="reveal section-padding relative overflow-hidden w-full" aria-labelledby="services-heading">
      <div 
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] -z-10"
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-primary font-black tracking-[0.35em] uppercase mb-4 inline-block">Our Services</span>
          <h2 
            id="services-heading"
            className="heading-2 mb-6"
          >
            World-Class Solutions
          </h2>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
            From custom architectures to enterprise-scale systems, we deliver technology that empowers your business to scale effortlessly.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              className="slider-nav-btn"
              aria-label="Scroll services left"
            >
              <ArrowLeft 
                aria-hidden="true"
                size={18} 
              />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("right")}
              className="slider-nav-btn"
              aria-label="Scroll services right"
            >
              <ArrowRight 
                size={18} 
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div className="services-slider-wrapper">
          <div
            tabIndex={0}
            ref={sliderRef}
            role="region"
            aria-label="Aformix services carousel"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                scrollSlider("left");
              }

              if (event.key === "ArrowRight") {
                event.preventDefault();
                scrollSlider("right");
              }
            }}
            className={`services-slider-container ${isDragging ? "dragging" : ""}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {services.map((service) => {
              const slug = homepageServiceSlugs[service.id];
              return (
                <Link
                  key={service.id}
                  href={slug ? getServicePath(slug) : "/#services"}
                  className="service-card card-premium min-w-[260px] w-[85vw] sm:min-w-[380px] max-w-[380px] h-[440px] sm:h-[520px] flex-shrink-0 group block"
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                >
                  <div className="service-card-image-wrapper">
                    <Image
                      width={800}
                      height={1000}
                      src={serviceImages[service.id]}
                      alt={`${service.title} service illustration`}
                      className="service-card-image"
                      draggable={false}
                      onDragStart={(event) => event.preventDefault()}
                    />
                  </div>

                  <div className="service-card-bottom">
                    <span>{service.title}</span>
                  </div>

                  <div className="service-card-description-panel">
                    <p>{service.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Divider />
    </section>
  );
};

export default Services;
