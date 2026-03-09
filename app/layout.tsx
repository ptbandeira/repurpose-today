import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepurposeToday — Career Reinvention Framework",
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
    languages: {
      en: "https://repurposetoday.com",
      pt: "https://repurposetoday.com",
      es: "https://repurposetoday.com",
      "x-default": "https://repurposetoday.com",
    },
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Repurpose Framework?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Repurpose Framework™ is a three-stage guided process (Discover → Connect → Create) for mid-career professionals navigating career reinvention in the AI age. It's not a course — it's a structured framework with peer cohorts.",
      },
    },
    {
      "@type": "Question",
      name: "Who is this for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Professionals aged 35-55 in knowledge work — lawyers, finance professionals, HR leaders, consultants — who feel their industry is being reshaped by AI and want clarity on their next chapter.",
      },
    },
    {
      "@type": "Question",
      name: "Is this a course?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. RepurposeToday is a framework-guided cohort experience, not a lecture series. You work through the Repurpose Framework™ with 9 other professionals over 4 weeks, with structured exercises and peer accountability.",
      },
    },
    {
      "@type": "Question",
      name: "Why is the founding cohort free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The first 10 members help shape the program. In exchange for your feedback and participation, you get the full experience at no cost. Future cohorts will be paid.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need coaching credentials to benefit from this?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all. This is built by a practitioner for practitioners. Pedro Bandeira has reinvented his career five times across four countries — the framework comes from lived experience, not textbooks.",
      },
    },
    {
      "@type": "Question",
      name: "What happens after the 4 weeks?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You'll have a clear purpose statement, a skills-to-purpose map, and an actionable next-steps plan. Alumni stay connected through a private community. Those who want deeper support can continue with paid programs.",
      },
    },
  ],
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {/* GA4 — Replace G-XXXXXXXXXX with your Measurement ID */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
        {/* Google Translate — deferred by 2 seconds */}
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
              setTimeout(function() {
                var s = document.createElement('script');
                s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                document.head.appendChild(s);
              }, 2000);
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
