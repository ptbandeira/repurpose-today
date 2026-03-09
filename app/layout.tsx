import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepurposeToday — Find Your Next Chapter",
  description:
    "Purpose discovery for professionals navigating the AI transition. Guided Ikigai assessment, community cohorts, and peer skill-sharing. Join the founding cohort — free.",
  openGraph: {
    title: "RepurposeToday — Find Your Next Chapter",
    description:
      "AI is changing work. We help you find what's next. Purpose discovery, not just reskilling.",
    type: "website",
    url: "https://repurposetoday.com",
    siteName: "RepurposeToday",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RepurposeToday — Find Your Next Chapter",
    description:
      "AI is changing work. We help you find what's next. Purpose discovery, not just reskilling.",
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
  "@type": "Organization",
  name: "RepurposeToday",
  url: "https://repurposetoday.com",
  description:
    "Purpose discovery for professionals navigating the AI transition. Guided Ikigai assessment, community cohorts, and peer skill-sharing.",
  founder: {
    "@type": "Person",
    name: "Pedro Bandeira",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body bg-warm-50 text-warm-900 antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
