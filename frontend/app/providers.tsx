"use client";

import { CurrencyProvider } from "@/context/CurrencyContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PostHogProvider from "@/lib/analytics/PostHogProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}