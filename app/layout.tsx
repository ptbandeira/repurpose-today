import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepurposeToday — Find Your Next Chapter",
  description:
    "AI is changing work. We help you find what's next. Guided purpose-discovery, community cohorts, and peer skill-sharing for workers navigating career transitions.",
  openGraph: {
    title: "RepurposeToday — Find Your Next Chapter",
    description:
      "AI is changing work. We help you find what's next.",
    type: "website",
    url: "https://repurposetoday.com",
    siteName: "RepurposeToday",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RepurposeToday — Find Your Next Chapter",
    description:
      "AI is changing work. We help you find what's next.",
    images: ["/opengraph-image"],
  },
  metadataBase: new URL("https://repurposetoday.com"),
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
      </head>
      <body className="font-body bg-warm-50 text-warm-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
