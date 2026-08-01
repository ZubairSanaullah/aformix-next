import "./globals.css";
import { Outfit, Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import type { Metadata, Viewport } from "next";

import Providers from "./providers";
import { cn } from "@/lib/utils";

import { Toaster } from "sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aformix.com"),

  manifest: "/site.webmanifest",

  applicationName: "Aformix",

  title: {
    default: "Aformix | Modern Web & App Development Agency",
    template: "%s | Aformix",
  },

  description:
    "Aformix builds modern websites, web applications, mobile apps, UI/UX designs, landing pages, WordPress websites, and SEO solutions for startups and growing businesses.",

  keywords: [
    "Aformix",
    "Web Development",
    "App Development",
    "UI UX Design",
    "Landing Pages",
    "Business Websites",
    "Portfolio Websites",
    "WordPress Development",
    "SEO Services",
    "Next.js Development",
    "React Development",
    "Software Company",
    "Pakistan",
  ],

  authors: [
    {
      name: "Aformix",
      url: "https://www.aformix.com",
    },
  ],

  creator: "Aformix",

  publisher: "Aformix",

  category: "Technology",

  referrer: "origin-when-cross-origin",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    title: "Aformix",
    statusBarStyle: "default",
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01":
        process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.aformix.com",
    siteName: "Aformix",
    title: "Aformix | Modern Web & App Development Agency",
    description:
      "Premium web development, mobile app development, UI/UX design, SEO, and WordPress solutions for modern businesses.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aformix",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Aformix | Modern Web & App Development Agency",
    description:
      "Premium web development, mobile app development, UI/UX design, SEO, and WordPress solutions.",
    images: ["/og-image.png"],
    creator: "@Afromixtech",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#31B98F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={cn("font-sans", geist.variable)}>
      <body className={`${outfit.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>

        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!}
        />
      </body>
    </html>
  );
}