'use client';

import RevealInitializer from "./RevealInitializer";

import Hero from "./Hero";
import TechMarquee from "./TechMarquee";
import About from "./About";
import Portfolio from "./Portfolio";
import Services from "./Services";
import WhyChooseUs from "./WhyChooseUs";
import dynamic from "next/dynamic";

import useReveal from "@/hooks/useReveal";

const Testimonials = dynamic(
  () => import("@/components/Testimonials"),
  {
    loading: () => <div className="h-96" />,
  }
);

const Pricing = dynamic(
  () => import("@/components/Pricing"),
  {
    loading: () => <div className="h-96" />,
  }
);

const FAQ = dynamic(
  () => import("@/components/FAQ"),
  {
    loading: () => <div className="h-80" />,
  }
);

const Contact = dynamic(
  () => import("@/components/Contact"),
  {
    loading: () => <div className="h-96" />,
  }
);

export default function HomeContent() {
  useReveal();

  return (
    <>
      <RevealInitializer />
      
      <Hero />
      <TechMarquee />
      <About />
      <Portfolio />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
    </>
  );
}