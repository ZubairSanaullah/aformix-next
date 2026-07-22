export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.aformix.com/#organization",
        name: "Aformix",
        url: "https://www.aformix.com",
        logo: "https://www.aformix.com/android-chrome-512.png",
        description:
          "Aformix is a modern software agency specializing in web development, mobile app development, UI/UX design, WordPress websites, landing pages, and SEO.",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "hello@aformix.com",
            areaServed: "Worldwide",
            availableLanguage: ["English"],
          },
          knowsAbout: [
            "Next.js",
            "React",
            "TypeScript",
            "Web Development",
            "Mobile App Development",
            "UI/UX Design",
            "WordPress Development",
            "SEO",
          ],

        sameAs: [
          "https://www.linkedin.com/company/aformix/",
          "https://www.instagram.com/aformixtech/",
          "https://www.tiktok.com/@aformix",
          "https://x.com/Afromixtech"
        ]
      },

      {
        "@type": "WebSite",
        "@id": "https://www.aformix.com/#website",
        url: "https://www.aformix.com",
        name: "Aformix",
        publisher: {
          "@id": "https://www.aformix.com/#organization"
        },
        inLanguage: "en"
      },

      {
        "@type": "ProfessionalService",
        "@id": "https://www.aformix.com/#service",
        name: "Aformix",
        image: "https://www.aformix.com/og-image.png",

        provider: {
          "@id": "https://www.aformix.com/#organization"
        },

        areaServed: {
          "@type": "Place",
          name: "Worldwide",
        },

        serviceType: [
          "Web Development",
          "App Development",
          "UI/UX Design",
          "Landing Pages",
          "Business Websites",
          "Portfolio Websites",
          "WordPress Development",
          "SEO Services"
        ],

        url: "https://www.aformix.com"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}