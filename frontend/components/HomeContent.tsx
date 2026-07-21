"use client";

import useReveal from "@/hooks/useReveal";

import Hero from "./Hero";
import TechMarquee from "./TechMarquee";
import About from "./About";
import Portfolio from "./Portfolio";
import Services from "./Services";
import WhyChooseUs from "./WhyChooseUs";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import Contact from "./Contact";

export default function HomeContent() {
  useReveal();

  return (
    <>
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