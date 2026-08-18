import type { ReactNode } from "react";
import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealInitializer from "@/components/RevealInitializer";
import StructuredData from "@/components/StructuredData";

const CookieConsent = dynamic(() => import("@/components/CookieConsent"), {
  ssr: false,
});
const WhatsAppBtn = dynamic(() => import("@/components/WhatsAppBtn"), {
  ssr: false,
});
const OrbitAI = dynamic(() => import("@/components/OrbitAI"), {
  ssr: false,
});

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <>
      <StructuredData />
      <RevealInitializer />

      <Navbar />

      <main id="main-content">
        {children}
      </main>

      <Footer />

      <CookieConsent />
      <WhatsAppBtn />
      <OrbitAI />
    </>
  );
}