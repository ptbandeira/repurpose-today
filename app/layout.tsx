import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "RepurposeToday — The Repurpose Framework™ for Professionals in Transition",
  description:
    "A guided framework for mid-career professionals navigating career reinvention in the AI age. Purpose discovery, peer cohorts, and actionable next steps. Join the founding cohort — free.",
  openGraph: {
    title: "RepurposeToday — Career Reinvention for the AI Age",
    description:
      "92 million jobs restructured by 2030. The reskilling industry says take a course. We built a framework. Join 10 professionals finding their next chapter.",
    type: "website",
    url: "https://repurposetoday.com",
    siteName: "RepurposeToday",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RepurposeToday — Career Reinvention for the AI Age",
    description:
      "92 million jobs restructured by 2030. The reskilling industry says take a course. We built a framework. Join 10 professionals finding their next chapter.",
    images: ["/opengraph-image"],
  },
  metadataBase: new URL("https://repurposetoday.com"),
  alternates: {
    canonical: "https://repurposetoday.com",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "RepurposeToday",
  url: "https://repurposetoday.com",
  description:
    "Purpose discovery framework for professionals navigating the AI transition.",
  founder: {
    "@type": "Person",
    name: "Pedro Bandeira",
    jobTitle: "Serial Entrepreneur",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Analog AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  autoDisplay: false,
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');
              }
            `,
          }}
        />
      </head>
      <body className="font-body bg-neutral-50 text-neutral-900 antialiased">
        <div id="google_translate_element" className="hidden" />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
