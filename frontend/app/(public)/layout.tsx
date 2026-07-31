import type { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppBtn from "@/components/WhatsAppBtn";
import OrbitAI from "@/components/OrbitAI";
import RevealInitializer from "@/components/RevealInitializer";
import StructuredData from "@/components/StructuredData";

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